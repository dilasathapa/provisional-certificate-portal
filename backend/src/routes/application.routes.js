const express = require("express");

const authenticate = require("../middleware/auth.middleware");

const {
  create,
  getAll,
  getOne,
} = require("../controllers/application.controller");

const router = express.Router();

router.use(authenticate);

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);

module.exports = router;