const PDFDocument = require("pdfkit");

const generateAcknowledgmentPdf = (application) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const chunks = [];

    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(pdfBuffer);
    });

    doc.on("error", reject);

    // Header
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("PROVISIONAL CERTIFICATE PORTAL", {
        align: "center",
      });

    doc.moveDown(0.5);

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("APPLICATION ACKNOWLEDGMENT", {
        align: "center",
      });

    doc.moveDown(1);

    // Reference number
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("Application Reference Number");

    doc
      .fontSize(15)
      .font("Helvetica-Bold")
      .text(application.referenceNumber);

    doc.moveDown(1);

    // Applicant details
    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("Applicant Details");

    doc.moveDown(0.5);

    doc
      .fontSize(11)
      .font("Helvetica")
      .text(`Name: ${application.applicant.fullName}`);

    doc.text(
      `Date of Birth: ${new Date(
        application.applicant.dateOfBirth
      ).toLocaleDateString("en-IN")}`
    );

    doc.text(
      `Registration Number: ${application.applicant.registrationNumber}`
    );

    doc.moveDown(0.5);

    doc
      .font("Helvetica-Bold")
      .text("Address:");

    doc
      .font("Helvetica")
      .text(application.applicant.address);

    doc.moveDown(1);

    // Application status
    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("Application Status");

    doc.moveDown(0.5);

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(application.status);

    doc.moveDown(1);

    // Timestamp
    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("Submitted At");

    doc.moveDown(0.5);

    doc
      .fontSize(11)
      .font("Helvetica")
      .text(
        new Date(application.submittedAt).toLocaleString("en-IN", {
          dateStyle: "long",
          timeStyle: "short",
        })
      );

    doc.moveDown(1);

    // Documents
    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("Documents Submitted");

    doc.moveDown(0.5);

    doc
      .fontSize(11)
      .font("Helvetica")
      .text("✓ ID Proof");

    doc.text("✓ Degree Certificate");

    doc.moveDown(2);

    // Footer message
    doc
      .fontSize(9)
      .font("Helvetica-Oblique")
      .text(
        "This is a system-generated acknowledgment for the provisional certificate application.",
        {
          align: "center",
        }
      );

    doc.end();
  });
};

module.exports = {
  generateAcknowledgmentPdf,
};