const crypto = require("crypto");

const generateReferenceNumber = () => {
  const randomPart = crypto
    .randomBytes(6)
    .toString("hex")
    .toUpperCase();

  return `PC-${new Date().getFullYear()}-${randomPart}`;
};

module.exports = generateReferenceNumber;