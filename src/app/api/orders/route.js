import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json({ error: 'Tidak ada akses' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    const { payload } = await jose.jwtVerify(token.value, secret);

    if (!payload) {
      return NextResponse.json({ error: 'Sesi tidak valid' }, { status: 401 });
    }

    const { items, shippingAddress } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Keranjang kosong' }, { status: 400 });
    }

    await dbConnect();

    // Group items by tenant
    const itemsByTenant = {};

    for (const item of items) {
      // Validasi produk
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ error: `Produk tidak ditemukan` }, { status: 404 });
      }
      if (!product.owner) {
        return NextResponse.json({ error: `Produk ${product.name} tidak memiliki data toko (tenant) yang valid.` }, { status: 400 });
      }

      const tenantId = product.owner.toString();
      
      if (!itemsByTenant[tenantId]) {
        itemsByTenant[tenantId] = {
          tenant: tenantId,
          items: [],
          totalAmount: 0
        };
      }

      let finalPrice = product.price;
      if (item.variantName && product.variants) {
        const variant = product.variants.find(v => v.name === item.variantName);
        if (variant) {
          finalPrice += (variant.additionalPrice || 0);
        }
      }

      itemsByTenant[tenantId].items.push({
        product: product._id,
        quantity: item.quantity,
        price: finalPrice,
        variantName: item.variantName
      });
      itemsByTenant[tenantId].totalAmount += (finalPrice * item.quantity);
    }

    // Create an order for each tenant
    const orderPromises = Object.values(itemsByTenant).map(async (tenantOrder) => {
      // Get the tenant to copy their payment methods
      const tenantUser = await User.findById(tenantOrder.tenant);
      const paymentInstructions = tenantUser?.paymentMethods || [];

      const newOrder = new Order({
        buyer: payload.id,
        tenant: tenantOrder.tenant,
        items: tenantOrder.items,
        totalAmount: tenantOrder.totalAmount,
        shippingAddress,
        paymentInstructions
      });
      return newOrder.save();
    });

    const savedOrders = await Promise.all(orderPromises);

    // Ambil data pembeli
    const buyerUser = await User.findById(payload.id);

    // Send notifications and emails
    for (const order of savedOrders) {
      try {
        const tenantUser = await User.findById(order.tenant);
        
        // 1. Create In-App Notification untuk tenant
        await Notification.create({
          recipient: order.tenant,
          title: 'Pesanan Baru!',
          message: `Anda mendapat pesanan baru sejumlah Rp ${order.totalAmount.toLocaleString('id-ID')}`,
          type: 'order_new',
          link: '/tenant/orders'
        });

        // 1.5 Send FCM Push Notification
        if (tenantUser && tenantUser.fcmToken) {
          try {
            const admin = require('@/lib/firebaseAdmin').default;
            await admin.messaging().send({
              token: tenantUser.fcmToken,
              notification: {
                title: '🛒 Pesanan Baru Masuk!',
                body: `Hore! Ada pesanan baru senilai Rp ${order.totalAmount.toLocaleString('id-ID')}`,
              },
              data: {
                link: '/tenant/orders'
              }
            });
            console.log('Push notification sent to', tenantUser.fcmToken);
          } catch (fcmError) {
            console.error('Failed to send FCM push', fcmError);
          }
        }

        // 2. Kirim Email ke Tenant (Notifikasi pesanan baru)
        if (tenantUser && tenantUser.email && process.env.RESEND_API_KEY) {
          await resend.emails.send({
            from: 'HIPMORA <sistem@hipmora.my.id>',
            reply_to: 'hipmikatalog@gmail.com',
            to: tenantUser.email,
            subject: 'Ada Pesanan Baru di Toko Anda! 🎉',
            html: `
              <h2>Halo ${tenantUser.name},</h2>
              <p>Anda baru saja mendapatkan pesanan baru sebesar <strong>Rp ${order.totalAmount.toLocaleString('id-ID')}</strong>.</p>
              <p>Silakan periksa dashboard tenant Anda untuk memproses pesanan ini.</p>
              <br/>
              <p>Salam hangat,<br/>Tim HIPMORA</p>
            `
          });
        }
      } catch (notifErr) {
        console.error('Failed to send notification for order', order._id, notifErr);
      }
    }

    // 3. Kirim Email Konfirmasi ke Pembeli menggunakan Template "hipmora-order-confirm"
    if (buyerUser && buyerUser.email && process.env.RESEND_API_KEY) {
      const totalSemuaPesanan = savedOrders.reduce((total, order) => total + order.totalAmount, 0);
      
      try {
        const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'sistem@hipmora.my.id';
        const invoiceId = savedOrders[0]._id.toString().substring(0, 8).toUpperCase();
        
        await resend.emails.send({
          from: `HIPMORA <${FROM_EMAIL}>`,
          to: buyerUser.email,
          reply_to: 'hipmikatalog@gmail.com',
          subject: `Pesanan Anda Sedang Diproses (Invoice: #${invoiceId})`,
          html: `
            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
              <div style="background-color: #C62828; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">HIPMORA</h1>
              </div>
              <div style="padding: 30px; background-color: #FAFAF8;">
                <h2 style="color: #333; margin-top: 0;">Halo ${buyerUser.name || 'Pelanggan'},</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                  Terima kasih telah berbelanja di HIPMORA! Pesanan Anda sedang diproses oleh penjual.
                </p>
                <div style="background-color: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #C62828;">Detail Pesanan</h3>
                  <p><strong>Invoice ID:</strong> #${invoiceId}</p>
                  <p><strong>Total Item:</strong> ${items.length} Produk</p>
                  <p><strong>Total Pembayaran:</strong> Rp ${totalSemuaPesanan.toLocaleString('id-ID')}</p>
                </div>
                <p style="color: #777; font-size: 14px; margin-bottom: 0;">
                  <em>Anda dapat memantau status pesanan melalui menu Profil -> Pesanan Saya.</em>
                </p>
              </div>
            </div>
          `
        });
      } catch (buyerEmailErr) {
        console.error('Gagal mengirim email template ke pembeli', buyerEmailErr);
      }
    }

    // Empty user cart after checkout
    await User.findByIdAndUpdate(payload.id, { $set: { cart: [] } });

    return NextResponse.json({ 
      success: true, 
      message: 'Pesanan berhasil dibuat',
      orderIds: savedOrders.map(o => o._id.toString())
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Gagal memproses pesanan' }, { status: 500 });
  }
}
