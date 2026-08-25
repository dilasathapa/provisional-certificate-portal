const applicationService = require("../services/application.service");

const create = async (req, res, next) => {
  try {
    const application =
      await applicationService.createApplication({
        userId: req.user._id,
        applicant: req.body.applicant,
      });

    res.status(201).json({
      message: "Application created successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const applications =
      await applicationService.getUserApplications(
        req.user._id
      );

    res.status(200).json({
      applications,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const application =
      await applicationService.getApplicationById({
        applicationId: req.params.id,
        userId: req.user._id,
      });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json({
      application,
    });
  } catch (error) {
    next(error);
  }
};

const submit = async (req, res, next) => {
  try {
    const result =
      await applicationService.submitApplication({
        applicationId: req.params.id,
        userId: req.user._id,
      });

    res.status(200).json({
      message: "Application submitted successfully",
      application: result.application,
      acknowledgment: result.acknowledgment,
      downloadUrl: result.downloadUrl,
    });
  } catch (error) {
    next(error);
  }
};

const getAcknowledgment = async (
  req,
  res,
  next
) => {
  try {
    const url =
      await applicationService.getAcknowledgmentDownloadUrl({
        applicationId: req.params.id,
        userId: req.user._id,
      });

    res.status(200).json({
      url,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  submit,
  getAcknowledgment,
};