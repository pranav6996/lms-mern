const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;

  // If email credentials are not configured, log to console
  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.log('===== EMAIL (Dev Mode) =====');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.text || options.html}`);
    console.log('============================');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST || 'smtp.gmail.com',
    port: EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"LearnHub LMS" <${EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
};

module.exports = sendEmail;
