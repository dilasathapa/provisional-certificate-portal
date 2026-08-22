const { z } = require("zod");

const createApplicationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),

  dateOfBirth: z
    .string()
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "Please provide a valid date of birth"
    ),

  registrationNumber: z
    .string()
    .trim()
    .min(3, "Registration number is required")
    .max(50, "Registration number is too long"),

  address: z
    .string()
    .trim()
    .min(5, "Address is required")
    .max(500, "Address is too long"),
});

module.exports = {
  createApplicationSchema,
};