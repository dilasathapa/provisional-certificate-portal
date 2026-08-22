const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = require("../config/s3");

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const uploadFile = async ({ key, buffer, contentType }) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return key;
};

const createDownloadUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: 60,
  });
};

const getSignedDownloadUrl = async ({
  key,
  expiresIn = 300,
}) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn,
  });
};

module.exports = {
  uploadFile,
  createDownloadUrl,
  getSignedDownloadUrl,
};