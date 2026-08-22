const {
  generateAcknowledgmentPdf,
} = require("./pdf.service");

const {
  uploadFile,
} = require("./storage.service");

const Document = require("../models/Document");

const generateAndStoreAcknowledgment = async ({
  application,
  userId,
}) => {
  const pdfBuffer = await generateAcknowledgmentPdf(application);

  const key = [
    "users",
    userId.toString(),
    "applications",
    application._id.toString(),
    `acknowledgment-${application.referenceNumber}.pdf`,
  ].join("/");

  await uploadFile({
    key,
    buffer: pdfBuffer,
    contentType: "application/pdf",
  });

  const document = await Document.create({
    applicationId: application._id,
    userId,
    type: "ACKNOWLEDGMENT",
    originalName: `acknowledgment-${application.referenceNumber}.pdf`,
    s3Key: key,
    mimeType: "application/pdf",
    size: pdfBuffer.length,
  });

  return document;
};

module.exports = {
  generateAndStoreAcknowledgment,
};