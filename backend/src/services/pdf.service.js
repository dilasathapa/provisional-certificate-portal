const PDFDocument = require("pdfkit");

const generateAcknowledgmentPdf = (application) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      autoFirstPage: true,
    });

    const chunks = [];

    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    doc.on("error", reject);

    /*
     * -------------------------------------------------------
     * PAGE DIMENSIONS
     * -------------------------------------------------------
     */

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    const margin = 50;
    const contentWidth = pageWidth - margin * 2;

    /*
     * -------------------------------------------------------
     * COLORS
     * -------------------------------------------------------
     */

    const dark = "#0f172a";
    const muted = "#64748b";
    const border = "#cbd5e1";
    const lightBackground = "#f8fafc";
    const successBackground = "#ecfdf5";
    const successText = "#047857";

    /*
     * -------------------------------------------------------
     * HEADER
     * -------------------------------------------------------
     */

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(18)
      .text(
        "PROVISIONAL CERTIFICATE",
        margin,
        55,
        {
          width: contentWidth,
          align: "center",
        }
      );

    doc
      .fillColor(muted)
      .font("Helvetica")
      .fontSize(9)
      .text(
        "APPLICATION PORTAL",
        margin,
        79,
        {
          width: contentWidth,
          align: "center",
        }
      );

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(14)
      .text(
        "APPLICATION ACKNOWLEDGMENT",
        margin,
        110,
        {
          width: contentWidth,
          align: "center",
        }
      );

    /*
     * Header divider
     */

    doc
      .strokeColor(border)
      .lineWidth(1)
      .moveTo(margin, 140)
      .lineTo(pageWidth - margin, 140)
      .stroke();

    /*
     * -------------------------------------------------------
     * REFERENCE NUMBER
     * -------------------------------------------------------
     */

    doc
      .fillColor(muted)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(
        "APPLICATION REFERENCE NUMBER",
        margin,
        165
      );

    const referenceBoxY = 184;
    const referenceBoxHeight = 52;

    /*
     * Background
     */

    doc
      .roundedRect(
        margin,
        referenceBoxY,
        contentWidth,
        referenceBoxHeight,
        6
      )
      .fill(lightBackground);

    /*
     * Border
     */

    doc
      .roundedRect(
        margin,
        referenceBoxY,
        contentWidth,
        referenceBoxHeight,
        6
      )
      .lineWidth(1)
      .strokeColor(border)
      .stroke();

    /*
     * Reference number
     *
     * IMPORTANT:
     * Explicit x + width + align ensures the
     * reference number is actually centered.
     */

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(
        application.referenceNumber,
        margin,
        referenceBoxY + 17,
        {
          width: contentWidth,
          align: "center",
          lineBreak: false,
        }
      );

    /*
     * -------------------------------------------------------
     * APPLICANT DETAILS
     * -------------------------------------------------------
     */

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(
        "APPLICANT DETAILS",
        margin,
        270
      );

    const labelX = margin;
    const valueX = margin + 155;
    const valueWidth = contentWidth - 155;

    const drawField = (label, value, y) => {
      doc
        .fillColor(muted)
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .text(label, labelX, y, {
          width: 145,
        });

      doc
        .fillColor(dark)
        .font("Helvetica")
        .fontSize(10)
        .text(value || "—", valueX, y, {
          width: valueWidth,
          lineBreak: false,
        });
    };

    drawField(
      "FULL NAME",
      application.applicant.fullName,
      298
    );

    drawField(
      "REGISTRATION NUMBER",
      application.applicant.registrationNumber,
      323
    );

    drawField(
      "DATE OF BIRTH",
      new Date(
        application.applicant.dateOfBirth
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      348
    );

    /*
     * Address
     */

    doc
      .fillColor(muted)
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .text(
        "ADDRESS",
        labelX,
        378
      );

    doc
      .fillColor(dark)
      .font("Helvetica")
      .fontSize(10)
      .text(
        application.applicant.address,
        valueX,
        378,
        {
          width: valueWidth,
          height: 45,
          ellipsis: true,
        }
      );

    /*
     * -------------------------------------------------------
     * APPLICATION STATUS
     * -------------------------------------------------------
     */

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(
        "APPLICATION STATUS",
        margin,
        440
      );

    /*
     * Status badge
     */

    const statusWidth = 115;
    const statusHeight = 28;
    const statusY = 462;

    doc
      .roundedRect(
        margin,
        statusY,
        statusWidth,
        statusHeight,
        14
      )
      .fill(successBackground);

    doc
      .fillColor(successText)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(
        application.status.toUpperCase(),
        margin,
        statusY + 9,
        {
          width: statusWidth,
          align: "center",
          lineBreak: false,
        }
      );

    /*
     * -------------------------------------------------------
     * DOCUMENTS
     * -------------------------------------------------------
     */

    doc
      .fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(
        "DOCUMENTS SUBMITTED",
        margin,
        520
      );

    const drawDocument = (name, y) => {
      /*
       * Checkmark
       */

      doc
        .fillColor(successText)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(
          "✓",
          margin,
          y
        );

      /*
       * Document name
       */

      doc
        .fillColor(dark)
        .font("Helvetica")
        .fontSize(10)
        .text(
          name,
          margin + 22,
          y + 1
        );

      /*
       * Submitted label
       */

      doc
        .fillColor(muted)
        .font("Helvetica")
        .fontSize(8.5)
        .text(
          "Submitted",
          pageWidth - margin - 65,
          y + 2,
          {
            width: 65,
            align: "right",
          }
        );
    };

    drawDocument("ID Proof", 548);

    drawDocument(
      "Degree Certificate",
      573
    );

    /*
     * -------------------------------------------------------
     * SUBMITTED AT
     * -------------------------------------------------------
     */

    doc
      .fillColor(muted)
      .font("Helvetica-Bold")
      .fontSize(8.5)
      .text(
        "SUBMITTED AT",
        margin,
        620
      );

    doc
      .fillColor(dark)
      .font("Helvetica")
      .fontSize(10)
      .text(
        new Date(
          application.submittedAt
        ).toLocaleString("en-IN", {
          dateStyle: "long",
          timeStyle: "short",
        }),
        margin,
        638
      );

    /*
     * -------------------------------------------------------
     * FOOTER
     * -------------------------------------------------------
     *
     * IMPORTANT:
     * The footer is positioned absolutely at the
     * bottom of the A4 page.
     */

    const footerLineY = pageHeight - 82;

    doc
      .strokeColor(border)
      .lineWidth(0.8)
      .moveTo(margin, footerLineY)
      .lineTo(pageWidth - margin, footerLineY)
      .stroke();

    doc
      .fillColor(muted)
      .font("Helvetica")
      .fontSize(8)
      .text(
        "This is a system-generated acknowledgment and does not require a physical signature.",
        margin,
        footerLineY + 14,
        {
          width: contentWidth,
          align: "center",
          lineBreak: false,
        }
      );

    /*
     * Footer left
     */

    doc
      .fillColor(muted)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(
        "Provisional Certificate Portal",
        margin,
        footerLineY + 35,
        {
          width: contentWidth / 2,
          align: "left",
        }
      );

    /*
     * Footer right
     */

    doc
      .font("Helvetica")
      .fontSize(8)
      .text(
        "Page 1 of 1",
        margin + contentWidth / 2,
        footerLineY + 35,
        {
          width: contentWidth / 2,
          align: "right",
        }
      );

    /*
     * -------------------------------------------------------
     * END DOCUMENT
     * -------------------------------------------------------
     */

    doc.end();
  });
};

module.exports = {
  generateAcknowledgmentPdf,
};