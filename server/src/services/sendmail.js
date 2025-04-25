
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
dotenv.config()


const mailTemplate = (name, otp, company) => {
  name = name.split(' ').map(part => {
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  }).join(' ');

  return `<!doctype html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>OTP Email Template</title>

    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 0;
        margin: 0;
      }
      .container-sec {
        background-color: #ffffff;
        border-radius: 8px;
        padding: 20px;
        margin-top: 30px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        max-width: 600px;
      }
      .otp-code {
        font-size: 24px;
        font-weight: bold;
        background-color: #f8f9fa;
        padding: 15px;
        text-align: center;
        border-radius: 8px;
        border: 1px dashed #007bff;
        color: #007bff;
      }
      .footer-text {
        color: #6c757d;
        font-size: 14px;
        text-align: center;
        margin-top: 20px;
      }
      .footer-text a {
        color: #007bff;
        text-decoration: none;
      }
      .otp-lock {
        color: #333;
        font-size: 80px;
      }
      .welcome-section {
        background: #144fa9db;
        padding: 30px;
        border-radius: 4px;
        color: #fff;
        font-size: 20px;
        margin: 20px 0px;
      }
      .welcome-text {
        font-family: monospace;
      }
      .app-name {
        font-size: 30px;
        font-weight: 800;
        margin: 7px 0px;
      }
      .verify-text {
        margin-top: 25px;
        font-size: 25px;
        letter-spacing: 3px;
      }

    </style>

  </head>

  <body>
    <div class="container-sec">
      <div class="text-center">
        <h2>Hello, ${name}</h2>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <div class="otp-code">${otp}</div>
        <p class="mt-4">Please use this OTP to complete your verification. The OTP is valid for the next 1 minutes.</p>
        <p>Thank you,<br>The ${company} Team</p>
      </div>
    </div>
  </body>

</html>`
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587, //default port for gmail
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASS,
  }
})

export const sendMail = async(email, name, otp, company) => {
  const mailOptions = {
    from: `"Hijazi" <${process.env.MAILER_EMAIL}>`,
    to: email,
    subject: 'OTP Verification',
    text: 'Hi, Welcome',
    html: mailTemplate(name,otp, company)
  };

  await transporter.sendMail(mailOptions)
  .then(res => res.accepted.length > 0)
  .catch(err => err);
}