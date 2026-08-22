const express = require("express");

const authenticate = require("../middleware/auth.middleware");

const {
  create,
  getAll,
  getOne,
  submit,
  downloadAcknowledgment,
} = require("../controllers/application.controller");

const router = express.Router();

router.use(authenticate);

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.post("/:id/submit", authenticate, submit);
router.get("/:id/acknowledgment", authenticate, downloadAcknowledgment);

module.exports = router;