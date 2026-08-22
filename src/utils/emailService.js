const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendVerificationEmail = async (email, employeeId) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'HRMS - Email Verification',
      html: `
        <h1>Welcome to HRMS</h1>
        <p>Your employee ID is: <strong>${employeeId}</strong></p>
        <p>Please click the link below to verify your email:</p>
        <a href="${process.env.BASE_URL}/verify/${employeeId}">Verify Email</a>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

exports.sendLeaveStatusEmail = async (leaveRequest, status) => {
  try {
    const user = await User.findById(leaveRequest.user).populate('profile');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Leave Request ${status}`,
      html: `
        <h2>Leave Request ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
        <p>Dear ${user.profile?.firstName || 'Employee'},</p>
        <p>Your leave request has been <strong>${status}</strong>.</p>
        <p><strong>Leave Type:</strong> ${leaveRequest.leaveType}</p>
        <p><strong>Period:</strong> ${new Date(leaveRequest.startDate).toLocaleDateString()} - ${new Date(leaveRequest.endDate).toLocaleDateString()}</p>
        ${leaveRequest.adminComments ? `<p><strong>Admin Comments:</strong> ${leaveRequest.adminComments}</p>` : ''}
        <p>Thank you.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Leave status email sent to:', user.email);
  } catch (error) {
    console.error('Email sending error:', error);
  }
};