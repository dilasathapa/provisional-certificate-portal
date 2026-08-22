const crypto = require("crypto");

const generateReferenceNumber = () => {
  const randomPart = crypto
    .randomBytes(5)
    .toString("hex")
    .toUpperCase();

  return `PC-${randomPart}`;
};

module.exports = {
  generateReferenceNumber,
};