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

const createApplication = async ({
  userId,
  applicant,
}) => {
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
}) => {
  const application = await Application.findOne({
    _id: applicationId,
    userId,
  });

  if (!application) {
    throw new ApiError(
      404,
      "Application not found"
    );
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

  const missingDocuments =
    requiredDocumentTypes.filter(
      (type) => !uploadedTypes.has(type)
    );

  if (missingDocuments.length > 0) {
    throw new ApiError(
      400,
      "Both ID Proof and Degree Certificate are required before submission"
    );
  }

  /*
   * Generate application reference number
   */
  const referenceNumber =
    generateReferenceNumber();

  application.referenceNumber =
    referenceNumber;

  application.status = "Submitted";

  application.submittedAt = new Date();

  await application.save();

  console.log(
    "Application submitted:",
    application._id.toString()
  );

  /*
   * Generate acknowledgment PDF
   * and upload it to S3
   */
  const acknowledgment =
    await generateAndStoreAcknowledgment({
      application,
      userId,
    });

  console.log(
    "Acknowledgment PDF generated and stored:",
    acknowledgment.s3Key
  );

  application.acknowledgmentPdfKey =
    acknowledgment.s3Key;

  await application.save();

  /*
   * Generate temporary signed download URL
   */
  const downloadUrl =
    await getSignedDownloadUrl({
      key: application.acknowledgmentPdfKey,
    });

  return {
    application,
    acknowledgment,
    downloadUrl,
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
    throw new ApiError(
      404,
      "Application not found"
    );
  }

  if (!application.acknowledgmentPdfKey) {
    throw new ApiError(
      404,
      "Acknowledgment PDF not available"
    );
  }

  const url =
    await getSignedDownloadUrl({
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