import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'sistem@hipmora.my.id';

// Configure the fallback email transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(to, otp) {
  const htmlContent = `
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
  `;

  // First try: Use Resend (Very fast delivery)
  if (process.env.RESEND_API_KEY) {
    try {
      const data = await resend.emails.send({
        from: `HIPMORA Kesatuan <${FROM_EMAIL}>`,
        to: [to],
        subject: 'Verifikasi Pendaftaran Akun HIPMORA',
        html: htmlContent,
      });
      
      if (data.id) {
        console.log('OTP Email sent via Resend:', data.id);
        return { success: true, messageId: data.id };
      }
    } catch (error) {
      console.warn('⚠️ Resend failed to send OTP email, falling back to Gmail SMTP...', error.message);
    }
  }

  // Fallback: Use Nodemailer (Gmail SMTP)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP_USER and SMTP_PASS are not configured! Email will not be sent.');
    console.log(`[DEVELOPMENT] OTP for ${to} is: ${otp}`);
    return { success: false, error: 'Email configuration is missing on the server.' };
  }

  try {
    const mailOptions = {
      from: `"HIPMORA Kesatuan" <${process.env.SMTP_USER}>`,
      to: to,
      subject: 'Verifikasi Pendaftaran Akun HIPMORA',
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent via SMTP: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email via SMTP:', error);
    return { success: false, error: error.message };
  }
}
