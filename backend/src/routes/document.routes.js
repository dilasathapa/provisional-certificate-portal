const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const uploadMiddleware = require("../middleware/upload.middleware");

const {
  upload,
  download,
} = require("../controllers/document.controller");

const router = express.Router();

router.use(authenticate);

router.post(
  "/applications/:applicationId",
  uploadMiddleware.single("file"),
  upload
);

router.get(
  "/:documentId/download",
  download
);

module.exports = router;