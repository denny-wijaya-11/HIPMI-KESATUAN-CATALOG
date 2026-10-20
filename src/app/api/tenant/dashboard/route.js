import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import { getUserPayload } from '@/lib/auth';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    const user = await getUserPayload();
    if (!user || !['tenant', 'operator', 'admin', 'developer'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // 1. Determine Queries based on Role
    let orderQuery = {};
    let productQuery = {};

    if (user.role === 'operator') {
      // Operator: get all tenants in their university
      const User = mongoose.models.User || mongoose.model('User');
      const tenants = await User.find({ role: 'tenant', university: user.university }).select('_id');
      const tenantIds = tenants.map(t => t._id);
      
      orderQuery = { tenant: { $in: tenantIds } };
      productQuery = { university: user.university, isHidden: { $ne: true } };
    } else if (user.role === 'admin' || user.role === 'developer') {
      // Admin: see all
      orderQuery = {};
      productQuery = { isHidden: { $ne: true } };
    } else {
      // Tenant: see only their own
      const tenantId = new mongoose.Types.ObjectId(user.id);
      orderQuery = { tenant: tenantId };
      productQuery = { owner: tenantId, isHidden: { $ne: true } };
    }

    // 2. Total Products
    const totalProducts = await Product.countDocuments(productQuery);

    // 3. All Orders
    const orders = await Order.find(orderQuery);

    const totalOrders = orders.length;
    let totalRevenue = 0;
    let pendingOrders = 0;

    orders.forEach(order => {
      if (order.status === 'Selesai') {
        totalRevenue += order.totalAmount;
      }
      if (order.status === 'Menunggu Pembayaran' || order.status === 'Diproses') {
        pendingOrders += 1;
      }
    });

    // 4. Sales for last 7 days (WIB / UTC+7)
    const nowWib = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const startWib = new Date(nowWib);
    startWib.setUTCDate(startWib.getUTCDate() - 6);
    startWib.setUTCHours(0, 0, 0, 0);
    const sevenDaysAgoUtc = new Date(startWib.getTime() - 7 * 60 * 60 * 1000);

    const aggregateMatch = {
      ...orderQuery,
      status: { $nin: ['Dibatalkan'] },
      createdAt: { $gte: sevenDaysAgoUtc }
    };

    // Aggregate daily sales with timezone UTC+7
    const salesDataRaw = await Order.aggregate([
      {
        $match: aggregateMatch
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "+07:00" } },
          revenue: {
            $sum: {
              $cond: [
                { $in: ["$status", ["Selesai", "Dikirim", "Diproses"]] },
                "$totalAmount",
                0
              ]
            }
          },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Fill missing days in Indonesian timezone
    const salesChart = [];
    for (let i = 0; i < 7; i++) {
      const curWib = new Date(startWib);
      curWib.setUTCDate(curWib.getUTCDate() + i);
      const dateStr = curWib.toISOString().split('T')[0];
      const found = salesDataRaw.find(s => s._id === dateStr);
      
      const dayName = curWib.toLocaleDateString('id-ID', { weekday: 'short', timeZone: 'UTC' });
      salesChart.push({
        date: dateStr,
        day: dayName,
        revenue: found ? found.revenue : 0,
        orders: found ? found.orders : 0
      });
    }

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      salesChart
    });
  } catch (error) {
    console.error('Tenant Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
