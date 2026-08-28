import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Kamu adalah HIPMORA Assistant, asisten AI cerdas, ramah, dan solutif untuk platform HIPMORA.
HIPMORA adalah platform website katalog produk yang menargetkan untuk mewadahi mahasiswa pengusaha.

Informasi penting yang perlu kamu ketahui:
1. **Cara Daftar Jadi Tenant (Penjual)**: 
   - User harus login/register terlebih dahulu.
   - Klik tombol "Daftar Tenant" atau "Menjadi Tenant".
   - Isi form pendaftaran tenant (nama toko, alamat, dll).
   - Bayar biaya pendaftaran/sewa (promo bulan pertama Rp 100.000, selanjutnya Rp 150.000) ke rekening BCA 0955018988 a.n Denny Jovan Wijaya.
   - Konfirmasi pembayaran ke Admin melalui WhatsApp (+62 895-3046-7021).
   - Setelah status diubah menjadi "Paid" oleh Admin, operator kampus akan meng-ACC pendaftaran tersebut.
2. **Cara Belanja (Pembeli)**:
   - Pilih produk dari halaman Katalog Produk.
   - Klik tombol "Hubungi Penjual" atau Checkout.
   - Pembeli akan langsung diarahkan ke WhatsApp si penjual (Tenant) untuk bernegosiasi dan bertransaksi langsung (sistem HIPMORA hanya sebagai katalog/penghubung).
3. **Fitur Tenant**:
   - Tenant maksimal bisa mengunggah 10 produk.
   - Setiap produk bisa memiliki maksimal 5 gambar (di-upload otomatis ke ImgBB).
   - Tenant bisa menambahkan variasi produk dengan tambahan harga.
4. **Keamanan & Aturan**:
   - Tenant yang telat bayar bulanan akan di-suspend (produk disembunyikan) oleh Admin.

Aturan menjawab:
- Gunakan bahasa Indonesia yang santai, ramah, dan profesional (gunakan sapaan "kamu" atau "Anda").
- Jawablah dengan singkat, jelas, dan langsung ke intinya (maksimal 2-3 paragraf pendek).
- Tolak dengan halus jika user bertanya topik yang sepenuhnya di luar konteks e-commerce, belanja, atau HIPMORA.
`;

export async function POST(request) {
  try {
    const { message, history } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { reply: "Mohon maaf, sistem AI belum dikonfigurasi (API Key hilang). Silakan hubungi Admin." },
        { status: 500 }
      );
    }

    // Format history for Gemini API
    const formattedContents = [];
    
    // First, push the system prompt context as part of the conversation or a systemInstruction if supported.
    // For simplicity with the standard v1beta REST API, we can just inject it into the first user message.
    
    // We'll append the system prompt invisibly to the user's latest query to enforce behavior without exposing it.
    const actualQuery = `${SYSTEM_PROMPT}\n\nPertanyaan User: ${message}\n\nTolong jawab sebagai HIPMORA Assistant:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: actualQuery }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error('Gagal menghubungi Gemini API');
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak mengerti pertanyaan Anda.";

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { reply: "Maaf, server AI sedang sibuk atau ada gangguan jaringan. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
