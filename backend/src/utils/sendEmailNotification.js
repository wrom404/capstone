import nodemailer from "nodemailer";

export const sendEmailNotification = async (to, subject, htmlContent) => {
  const recipients = Array.isArray(to.to) ? to.to.join(", ") : to;

  console.log("subject: ", subject);
  console.log("htmlContent: ", htmlContent);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  console.log("recipients: ", recipients);

  const mailOptions = {
    from: `"Parish Scheduler" <${process.env.NODEMAILER_USER}>`,
    to: recipients, // ✅ ensure it's a comma-separated string
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
