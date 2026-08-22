const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email
router.post('/send', protect, async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailList = to.split(',').map(email => email.trim());

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailList.join(','),
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a237e, #0d47a1); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">🏢 Dayflow HRMS</h1>
            <p style="margin: 5px 0 0; opacity: 0.8;">Human Resource Management System</p>
          </div>
          <div style="padding: 30px; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
            <p style="color: #666; font-size: 14px;">
              This is an automated message from Dayflow HRMS. Please do not reply to this email.
            </p>
          </div>
          <div style="text-align: center; padding: 15px; color: #666; font-size: 12px;">
            © ${new Date().getFullYear()} Dayflow HRMS. All rights reserved.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: `Email sent successfully to ${emailList.length} recipient(s)` 
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = router;