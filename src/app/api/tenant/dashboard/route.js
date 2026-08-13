import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getUserPayload } from '@/lib/auth';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET(request) {
  try {
    const user = await getUserPayload();
    if (!user || user.role !== 'tenant') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const tenantId = user.id;

    // 1. Total Products
    const totalProducts = await Product.countDocuments({ owner: tenantId, isHidden: { $ne: true } });

    // 2. All Orders for this tenant
    const orders = await Order.find({ tenant: tenantId });

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

    // 3. Sales for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Aggregate daily sales
    const salesDataRaw = await Order.aggregate([
      {
        $match: {
          tenant: tenantId,
          status: 'Selesai',
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Fill missing days
    const salesChart = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      const found = salesDataRaw.find(s => s._id === dateStr);
      
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
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
