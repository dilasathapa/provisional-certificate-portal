const Application = require("../models/Application");
const Document = require("../models/Document");
const ApiError = require("../utils/ApiError");

const {
  uploadApplicationDocument,
  getDocumentDownloadUrl,
} = require("../services/document.service");

const upload = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { type } = req.body;

    if (!["ID_PROOF", "DEGREE_CERTIFICATE"].includes(type)) {
      throw new ApiError(400, "Invalid document type");
    }

    if (!req.file) {
      throw new ApiError(400, "PDF document is required");
    }

    const application = await Application.findOne({
      _id: applicationId,
      userId: req.user._id,
    });

    if (!application) {
      throw new ApiError(404, "Application not found");
    }

    const existingDocument = await Document.findOne({
      applicationId,
      userId: req.user._id,
      type,
    });

    if (existingDocument) {
      throw new ApiError(
        409,
        `${type} has already been uploaded`
      );
    }

    const document = await uploadApplicationDocument({
      applicationId,
      userId: req.user._id,
      type,
      file: req.file,
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: {
        id: document._id,
        type: document.type,
        originalName: document.originalName,
        size: document.size,
        mimeType: document.mimeType,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const download = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.documentId,
      userId: req.user._id,
    });

    if (!document) {
      throw new ApiError(404, "Document not found");
    }

    const url = await getDocumentDownloadUrl(document);

    return res.status(200).json({
      success: true,
      url,
      expiresIn: 60,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  download,
};