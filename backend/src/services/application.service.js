const Application = require("../models/Application");
const generateReferenceNumber = require("../utils/referenceNumber");

const createApplication = async ({ userId, applicant }) => {
  const referenceNumber = generateReferenceNumber();

  const application = await Application.create({
    userId,
    referenceNumber,
    applicant,
    status: "Submitted",
  });

  return application;
};

const getUserApplications = async (userId) => {
  return Application.find({ userId }).sort({
    createdAt: -1,
  });
};

const getApplicationById = async ({ applicationId, userId }) => {
  return Application.findOne({
    _id: applicationId,
    userId,
  });
};

module.exports = {
  createApplication,
  getUserApplications,
  getApplicationById,
};