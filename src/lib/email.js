import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Ganti email "from" ini dengan domain yang sudah diverifikasi di Resend
// Jika belum ada domain, gunakan 'onboarding@resend.dev' untuk testing
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'sistem@hipmora.my.id'; 

/**
 * Mengirim email menggunakan template dari Resend Dashboard
 * 
 * @param {string} to - Alamat email tujuan
 * @param {string} templateId - ID Template dari Resend (misal: 'hipmora-order-confirm')
 * @param {string} subject - Subjek email
 * @param {object} variables - Variabel dinamis untuk template (opsional)
 */
export async function sendTemplateEmail(to, templateId, subject, variables = {}) {
  try {
    const data = await resend.emails.send({
      from: `HIPMORA <${FROM_EMAIL}>`,
      to: [to],
      reply_to: 'hipmikatalog@gmail.com',
      subject: subject,
      template: {
        id: templateId,
        variables: variables,
      },
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
