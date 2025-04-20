import transporter from "../config/nodemailer.js";

const emailTemplates = {
    // Initial OTP verification
    verifyEmail: (otp) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Welcome to NayaSathi!</h2>
      <p>Please verify your email address to complete your registration.</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <h3 style="margin: 0; font-size: 24px; letter-spacing: 2px;">${otp}</h3>
      </div>
      <p>This code will expire in 3 minutes.</p>
      <p style="color: #64748b; font-size: 14px;">If you didn't request this, please ignore this email.</p>
    </div>
  `,

    // Resend OTP
    resendOtp: (otp) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Your New Verification Code</h2>
      <p>Here's your new verification code for NayaSathi:</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <h3 style="margin: 0; font-size: 24px; letter-spacing: 2px;">${otp}</h3>
      </div>
      <p>This code will expire in 3 minutes.</p>
      <p style="color: #64748b; font-size: 14px;">If you didn't request this, please secure your account.</p>
    </div>
  `,

    // Password reset OTP
    passwordResetOtp: (otp) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Password Reset Request</h2>
      <p>We received a request to reset your NayaSathi account password. Use this code to verify it's you:</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <h3 style="margin: 0; font-size: 24px; letter-spacing: 2px;">${otp}</h3>
      </div>
      <p>This code will expire in 5 minutes.</p>
      <p style="color: #ef4444; font-size: 14px;">If you didn't request a password reset, please secure your account immediately.</p>
    </div>
  `,

    // Password reset success confirmation
    passwordResetSuccess: () => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Password Changed Successfully</h2>
      <p>Your NayaSathi account password has been successfully updated.</p>
      <p>If you made this change, no further action is needed.</p>
      <p style="color: #ef4444; font-size: 14px;">If you didn't make this change, please secure your account immediately.</p>
    </div>
  `,

    // Account locked notification
    accountLocked: () => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4444;">Account Locked</h2>
      <p>Your NayaSathi account has been temporarily locked due to multiple failed login attempts.</p>
      <p>For your security, please wait 30 minutes before trying again or reset your password.</p>
      <p style="color: #64748b; font-size: 14px;">If this wasn't you, please contact our support team immediately.</p>
    </div>
  `,

    // Ban notification
    banNotification: (userName, remarks, adminEmail) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4444;">Account Suspension Notice</h2>
      <p>Dear ${userName},</p>
      <p>Your NayaSathi account has been temporarily suspended due to violation of our community guidelines.</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; font-size: 18px;">Suspension Details:</h3>
        <p><strong>Reason:</strong> ${remarks || "Violation of terms of service"}</p>
        <p><strong>Action By:</strong> ${adminEmail}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p>During this suspension, you won't be able to access your account.</p>
      <p>If you believe this was a mistake, please contact our support team.</p>
      <p style="color: #64748b; font-size: 14px;">This is an automated message. Please do not reply directly to this email.</p>
    </div>
  `,

    // Unban notification
    unbanNotification: (userName, adminEmail) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Account Access Restored</h2>
      <p>Dear ${userName},</p>
      <p>Your NayaSathi account suspension has been lifted and full access has been restored.</p>
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Action By:</strong> ${adminEmail}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p>You may now log in and use all platform features.</p>
      <p>Please review our community guidelines to ensure compliance.</p>
      <p style="color: #64748b; font-size: 14px;">This is an automated message. Please do not reply directly to this email.</p>
    </div>
  `
};

const sendEmail = async (email, type, data) => {
    const templateConfig = {
        // Verification emails
        'verify-email': {
            subject: 'Verify Your Email',
            template: emailTemplates.verifyEmail(data.otp)
        },
        'resend-otp': {
            subject: 'Your New Verification Code',
            template: emailTemplates.resendOtp(data.otp)
        },

        // Password related emails
        'password-reset-otp': {
            subject: 'Password Reset Verification',
            template: emailTemplates.passwordResetOtp(data.otp)
        },
        'password-reset-success': {
            subject: 'Password Changed Successfully',
            template: emailTemplates.passwordResetSuccess()
        },

        // Security notifications
        'account-locked': {
            subject: 'Account Locked Notification',
            template: emailTemplates.accountLocked()
        },
        'account-banned': {
            subject: 'Account Suspension Notice',
            template: emailTemplates.banNotification(data.userName, data.remarks, data.adminEmail)
        },
        'account-unbanned': {
            subject: 'Account Access Restored',
            template: emailTemplates.unbanNotification(data.userName, data.adminEmail)
        }
    };

    if (!templateConfig[type]) {
        throw new Error('Invalid email type');
    }

    const mailOptions = {
        from: `"NayaSathi" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: templateConfig[type].subject,
        html: templateConfig[type].template
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Failed to send ${type} email`);
    }
};



export default sendEmail;