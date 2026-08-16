require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Order = require('./src/models/Order').default;
  
  try {
    const newOrder = new Order({
      buyer: new mongoose.Types.ObjectId(),
      tenant: new mongoose.Types.ObjectId(),
      items: [{
        product: new mongoose.Types.ObjectId(),
        quantity: 2,
        price: 82190387446
      }],
      totalAmount: 164380774892,
      shippingAddress: {
        name: 'Denny Jovan',
        phone: '085122',
        address: 'Tamansari',
        city: 'Bogor',
        postalCode: '16610'
      }
    });
    
    await newOrder.save();
    console.log("Success!");
  } catch (err) {
    console.error("Error saving order:", err.message);
  }
  process.exit(0);
}
test();
