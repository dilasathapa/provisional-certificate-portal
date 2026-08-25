const ApiError = require("../utils/ApiError");

const Application = require("../models/Application");
const Document = require("../models/Document");

const {
  generateReferenceNumber,
} = require("../utils/reference.util");

const {
  generateAndStoreAcknowledgment,
} = require("./application-pdf.service");

const {
  getSignedDownloadUrl,
} = require("./storage.service");

const {
  sendApplicationSubmittedEmail,
} = require("./email.service");

const createApplication = async ({ userId, applicant }) => {
  const application = await Application.create({
    userId,
    applicant,
    status: "Draft",
  });

  return application;
};

const getUserApplications = async (userId) => {
  return Application.find({ userId }).sort({
    createdAt: -1,
  });
};

const getApplicationById = async ({
  applicationId,
  userId,
}) => {
  return Application.findOne({
    _id: applicationId,
    userId,
  });
};

const submitApplication = async ({
  applicationId,
  userId,
  email,
}) => {
  const application = await Application.findOne({
    _id: applicationId,
    userId,
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.status !== "Draft") {
    throw new ApiError(
      400,
      "Only draft applications can be submitted"
    );
  }

  const requiredDocumentTypes = [
    "ID_PROOF",
    "DEGREE_CERTIFICATE",
  ];

  const documents = await Document.find({
    applicationId: application._id,
    userId,
    type: {
      $in: requiredDocumentTypes,
    },
  });

  const uploadedTypes = new Set(
    documents.map((document) => document.type)
  );

  const missingDocuments = requiredDocumentTypes.filter(
    (type) => !uploadedTypes.has(type)
  );

  if (missingDocuments.length > 0) {
    throw new ApiError(
      400,
      "Both ID Proof and Degree Certificate are required before submission"
    );
  }

  // Generate reference number
  const referenceNumber = generateReferenceNumber();

  application.referenceNumber = referenceNumber;
  application.status = "Submitted";
  application.submittedAt = new Date();

  await application.save();

  // Generate and store acknowledgment PDF
  const acknowledgment =
    await generateAndStoreAcknowledgment({
      application,
      userId,
    });

  application.acknowledgmentPdfKey =
    acknowledgment.s3Key;

  await application.save();

  let emailSent = false;

  try {
    const downloadUrl = await getSignedDownloadUrl({
      key: acknowledgment.s3Key,
    });

    await sendApplicationSubmittedEmail({
      email: req.user.email,
      application,
      downloadUrl,
    });

    emailSent = true;
  } catch (emailError) {
    console.error(
      "Application email failed:",
      emailError
    );
  }

  // Generate temporary download URL
  const downloadUrl = await getSignedDownloadUrl({
    key: application.acknowledgmentPdfKey,
  });

  // Send confirmation email
  // Email failure should not affect successful application submission.
  try {
    const User = require("../models/User");

    const user = await User.findById(userId);

    if (user?.email) {
      console.log(
        "Sending application submission email to:",
        user.email
      );

      await sendApplicationSubmittedEmail({
        email: user.email,
        application,
        downloadUrl,
      });

      console.log(
        "Application submission email sent successfully"
      );
    } else {
      console.log(
        "No email found for user:",
        userId
      );
    }
  } catch (emailError) {
    console.error(
      "Failed to send application submission email:"
    );

    console.error(emailError);
  }

  return {
    application,
    acknowledgment,
    emailSent
  };
};

const getAcknowledgmentDownloadUrl = async ({
  applicationId,
  userId,
}) => {
  const application = await Application.findOne({
    _id: applicationId,
    userId,
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (!application.acknowledgmentPdfKey) {
    throw new ApiError(
      404,
      "Acknowledgment PDF not available"
    );
  }

  const url = await getSignedDownloadUrl({
    key: application.acknowledgmentPdfKey,
  });

  return url;
};

module.exports = {
  createApplication,
  submitApplication,
  getUserApplications,
  getApplicationById,
  getAcknowledgmentDownloadUrl,
};
