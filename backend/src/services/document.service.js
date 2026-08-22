const Document = require("../models/Document");

const {
  uploadFile,
  createDownloadUrl,
} = require("./storage.service");

const uploadApplicationDocument = async ({
  applicationId,
  userId,
  type,
  file,
}) => {
  const safeFileName = file.originalname
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .toLowerCase();

  const key = [
    "users",
    userId.toString(),
    "applications",
    applicationId.toString(),
    `${type.toLowerCase()}-${Date.now()}-${safeFileName}`,
  ].join("/");

  await uploadFile({
    key,
    buffer: file.buffer,
    contentType: file.mimetype,
  });

  const document = await Document.create({
    applicationId,
    userId,
    type,
    originalName: file.originalname,
    s3Key: key,
    mimeType: file.mimetype,
    size: file.size,
  });

  return document;
};

const getDocumentDownloadUrl = async (document) => {
  return createDownloadUrl(document.s3Key);
};

module.exports = {
  uploadApplicationDocument,
  getDocumentDownloadUrl,
};