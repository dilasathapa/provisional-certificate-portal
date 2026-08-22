const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    referenceNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      default: null,
    },

    applicant: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      dateOfBirth: {
        type: Date,
        required: true,
      },

      registrationNumber: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },
    },

    status: {
      type: String,
      enum: ["Draft", "Submitted", "Completed"],
      default: "Draft",
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    acknowledgmentPdfKey: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);