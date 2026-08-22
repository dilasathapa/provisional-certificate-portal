const ApiError = require("../utils/ApiError");
const Application = require("../models/Application");

const {
  generateReferenceNumber,
} = require("../utils/reference.util");

const {
  generateAndStoreAcknowledgment,
} = require("./application-pdf.service");

const {
  getSignedDownloadUrl,
} = require("./storage.service");

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

  const referenceNumber = generateReferenceNumber();

  application.referenceNumber = referenceNumber;
  application.status = "Submitted";
  application.submittedAt = new Date();

  await application.save();

  const acknowledgment =
    await generateAndStoreAcknowledgment({
      application,
      userId,
    });

  application.acknowledgmentPdfKey =
    acknowledgment.s3Key;

  await application.save();

  return {
    application,
    acknowledgment,
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