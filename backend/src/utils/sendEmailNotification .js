import nodemailer from "nodemailer";

export const sendEmailNotification = async (
  to,
  subject,
  htmlContent // Accepts HTML
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER, // Your email address
      pass: process.env.NODEMAILER_PASS, // Your email password or app password
    },
  });

  const mailOptions = {
    from: `"Parish Scheduler" <${process.env.NODEMAILER_USER}>`,
    to,
    subject,
    html: htmlContent, // This replaces plain text with HTML
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return;
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
