require('dotenv').config({path: '.env.local'});
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Message = require('./src/models/Message').default || require('./src/models/Message');
  const msgs = await Message.find({ image: { $ne: null } }).sort({createdAt: -1}).limit(5);
  console.log(JSON.stringify(msgs, null, 2));
  process.exit(0);
});
