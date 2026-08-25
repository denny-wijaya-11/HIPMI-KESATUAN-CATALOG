import nodemailer from 'nodemailer';

// Configure the email transporter using SMTP
// You will need to provide SMTP credentials in your .env.local file
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your Gmail address
    pass: process.env.SMTP_PASS, // Your Gmail App Password
  },
});

/**
 * Sends an OTP email to the specified address.
 * 
 * @param {string} to - The recipient's email address
 * @param {string} otp - The one-time password to send
 */
export async function sendOTPEmail(to, otp) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP_USER and SMTP_PASS are not configured in .env.local! Email will not be sent.');
    // In development mode without credentials, we might just log the OTP for testing purposes
    console.log(`[DEVELOPMENT] OTP for ${to} is: ${otp}`);
    return { success: false, error: 'Email configuration is missing on the server.' };
  }

  try {
    const mailOptions = {
      from: `"HIPMORA Kesatuan" <${process.env.SMTP_USER}>`,
      to: to,
      subject: 'Verifikasi Pendaftaran Akun HIPMORA',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #C62828; margin: 0;">HIPMORA Kesatuan</h2>
          </div>
          <p style="font-size: 16px; color: #333;">Halo,</p>
          <p style="font-size: 16px; color: #333;">Terima kasih telah mendaftar di <strong>Katalog HIPMORA Kesatuan</strong>. Untuk melanjutkan proses pendaftaran, silakan gunakan kode OTP berikut:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; text-align: center; border-radius: 8px; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #C62828;">${otp}</span>
          </div>
          
          <p style="font-size: 14px; color: #666;">Kode OTP ini berlaku selama <strong>10 menit</strong>. Jangan berikan kode ini kepada siapa pun, termasuk pihak HIPMORA.</p>
          
          <div style="margin-top: 30px; border-top: 1px solid #eaeaea; padding-top: 20px; text-align: center;">
            <p style="font-size: 12px; color: #999;">Email ini dikirim secara otomatis oleh sistem, mohon untuk tidak membalas email ini.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
}
