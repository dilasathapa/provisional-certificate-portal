const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,

  // Port 587 uses STARTTLS
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendApplicationSubmittedEmail = async ({
  email,
  application,
  downloadUrl,
}) => {
  const applicantName =
    application.applicant?.fullName ||
    "Applicant";

  await transporter.sendMail({
    from:
      process.env.EMAIL_FROM ||
      process.env.EMAIL_USER,

    to: email,

    subject:
      "Application Submitted Successfully - Provisional Certificate Portal",

    text: `
Hello ${applicantName},

Your Provisional Certificate application has been successfully submitted.

Application Reference Number:
${application.referenceNumber}

Status:
${application.status}

Submitted At:
${new Date(
  application.submittedAt
).toLocaleString("en-IN")}

Your acknowledgment PDF is now available.

Download your acknowledgment:
${downloadUrl}

You can also access your application from the Provisional Certificate Portal dashboard.

Regards,
Provisional Certificate Portal
    `.trim(),

    html: `
      <div style="
        margin: 0;
        padding: 40px 20px;
        background: #f4f7f8;
        font-family: Arial, Helvetica, sans-serif;
      ">
        <div style="
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #e4e7ec;
          border-radius: 12px;
          overflow: hidden;
        ">

          <div style="
            padding: 24px 30px;
            background: #173f5f;
            color: #ffffff;
          ">
            <div style="
              font-size: 18px;
              font-weight: 700;
            ">
              Provisional Certificate Portal
            </div>

            <div style="
              margin-top: 4px;
              font-size: 13px;
              opacity: 0.85;
            ">
              Application Portal
            </div>
          </div>

          <div style="padding: 32px 30px;">

            <table
              role="presentation"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="margin-bottom: 18px;"
            >
              <tr>
                <td
                  width="44"
                  height="44"
                  align="center"
                  valign="middle"
                  style="
                    width: 44px;
                    height: 44px;
                    background-color: #e6f4f1;
                    border-radius: 50%;
                    color: #206b62;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 22px;
                    font-weight: 700;
                    text-align: center;
                    vertical-align: middle;
                    line-height: 44px;
                  "
                >
                  ✓
                </td>
              </tr>
            </table>

            <h1 style="
              margin: 0;
              color: #172033;
              font-size: 24px;
            ">
              Application Submitted
            </h1>

            <p style="
              margin-top: 12px;
              color: #667085;
              font-size: 15px;
              line-height: 1.6;
            ">
              Hello ${applicantName}, your Provisional Certificate
              application has been successfully submitted.
            </p>

            <div style="
              margin-top: 24px;
              padding: 18px;
              background: #f9fafb;
              border: 1px solid #e4e7ec;
              border-radius: 10px;
            ">
              <div style="
                color: #667085;
                font-size: 12px;
                font-weight: 600;
              ">
                APPLICATION REFERENCE
              </div>

              <div style="
                margin-top: 6px;
                color: #173f5f;
                font-size: 20px;
                font-weight: 700;
                letter-spacing: 1px;
              ">
                ${application.referenceNumber}
              </div>

              <div style="
                margin-top: 14px;
                color: #667085;
                font-size: 13px;
              ">
                Status
              </div>

              <div style="
                margin-top: 4px;
                color: #206b62;
                font-size: 14px;
                font-weight: 600;
              ">
                ${application.status}
              </div>
            </div>

            <p style="
              margin-top: 24px;
              color: #475467;
              font-size: 14px;
              line-height: 1.6;
            ">
              Your acknowledgment PDF has been generated successfully.
              You can download it using the button below.
            </p>

            <div style="
              margin-top: 24px;
              text-align: center;
            ">
              <a
                href="${downloadUrl}"
                target="_blank"
                style="
                  display: inline-block;
                  padding: 12px 22px;
                  background: #2a9d8f;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 8px;
                  font-size: 14px;
                  font-weight: 700;
                "
              >
                Download Acknowledgment PDF
              </a>
            </div>

            <p style="
              margin-top: 28px;
              color: #98a2b3;
              font-size: 12px;
              line-height: 1.5;
            ">
              You can also access your application and acknowledgment
              document from your dashboard.
            </p>

          </div>

          <div style="
            padding: 18px 30px;
            background: #f9fafb;
            border-top: 1px solid #e4e7ec;
            text-align: center;
            color: #98a2b3;
            font-size: 11px;
          ">
            This is an automated email from the Provisional Certificate Portal.
            Please do not reply to this email.
          </div>

        </div>
      </div>
    `,
  });
};

module.exports = {
  sendApplicationSubmittedEmail,
};
