const express = require("express");

const authenticate = require("../middleware/auth.middleware");

const {
  create,
  getAll,
  getById,
  submit,
  getAcknowledgment,
} = require("../controllers/application.controller");

const router = express.Router();

router.use(authenticate);

router.post("/", create);

router.get("/", getAll);

router.get("/:id", getById);

router.post("/:id/submit", submit);

router.get("/:id/acknowledgment", getAcknowledgment);

module.exports = router;