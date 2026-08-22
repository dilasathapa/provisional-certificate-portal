const {
  createApplication,
  getUserApplications,
  getApplicationById,
  submitApplication,
  getAcknowledgmentDownloadUrl,
} = require("../services/application.service");

const {
  createApplicationSchema,
} = require("../validators/application.validator");

const ApiError = require("../utils/ApiError");

const create = async (req, res, next) => {
  try {
    const data = createApplicationSchema.parse(req.body);

    const application = await createApplication({
      userId: req.user._id,
      applicant: {
        fullName: data.fullName,
        dateOfBirth: new Date(data.dateOfBirth),
        registrationNumber: data.registrationNumber,
        address: data.address,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Application draft created successfully",
      application: {
        id: application._id,
        referenceNumber: application.referenceNumber,
        applicant: application.applicant,
        status: application.status,
        submittedAt: application.submittedAt,
      }
    });
  } catch (error) {
    next(error);
  }
};

const submit = async (req, res, next) => {
  try {
    const result = await submitApplication({
      applicationId: req.params.id,
      userId: req.user._id,
    });

    const {
      application,
      acknowledgment,
    } = result;

    return res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      application: {
        id: application._id,
        referenceNumber:
          application.referenceNumber,
        applicant: application.applicant,
        status: application.status,
        submittedAt: application.submittedAt,
      },
      acknowledgment: {
        documentId: acknowledgment._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const downloadAcknowledgment = async (
  req,
  res,
  next
) => {
  try {
    const url =
      await getAcknowledgmentDownloadUrl({
        applicationId: req.params.id,
        userId: req.user._id,
      });

    return res.status(200).json({
      success: true,
      url,
      expiresIn: 300,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const applications = await getUserApplications(req.user._id);

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const application = await getApplicationById({
      applicationId: req.params.id,
      userId: req.user._id,
    });

    if (!application) {
      throw new ApiError(404, "Application not found");
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  submit,
  downloadAcknowledgment,
};