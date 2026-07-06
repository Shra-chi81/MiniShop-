// Quick seed script: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  { name: 'Wireless Headphones', description: 'Noise-cancelling over-ear headphones with 30h battery life.', price: 89.99, category: 'Electronics', brand: 'SoundCore', stock: 25, images: ['https://placehold.co/400x400?text=Headphones'] },
  { name: 'Running Shoes', description: 'Lightweight breathable running shoes for daily training.', price: 64.5, category: 'Footwear', brand: 'SprintX', stock: 40, images: ['https://placehold.co/400x400?text=Shoes'] },
  { name: 'Stainless Steel Water Bottle', description: 'Insulated bottle keeps drinks cold for 24 hours.', price: 19.99, category: 'Home', brand: 'HydroFlow', stock: 100, images: ['https://placehold.co/400x400?text=Bottle'] },
  { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard with hot-swappable switches.', price: 74.0, category: 'Electronics', brand: 'KeyForge', stock: 15, images: ['https://placehold.co/400x400?text=Keyboard'] },
  { name: 'Yoga Mat', description: 'Non-slip eco-friendly yoga mat, 6mm thick.', price: 24.99, category: 'Fitness', brand: 'ZenFit', stock: 60, images: ['https://placehold.co/400x400?text=Yoga+Mat'] },
  { name: 'Backpack', description: 'Water-resistant 25L backpack with laptop sleeve.', price: 45.0, category: 'Accessories', brand: 'UrbanPack', stock: 30, images: ['https://placehold.co/400x400?text=Backpack'] },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB, seeding...');

  await Product.deleteMany({});
  await Product.insertMany(products);

  const adminEmail = 'admin@example.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({ name: 'Admin User', email: adminEmail, password: 'admin1234', role: 'admin' });
    console.log('Admin created: admin@example.com / admin1234');
  }

  console.log(`Seeded ${products.length} products.`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
