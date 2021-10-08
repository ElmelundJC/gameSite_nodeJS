require('dotenv').config();

const router = require('express').Router();
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // create Transporter

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    
    // define the email options
    const mailOptions = {
        from: 'Christian Jacobsen <christianelmelund@hotmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
      };
    
    // send the email

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;