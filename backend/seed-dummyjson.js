// Seeds MongoDB with real product data from the DummyJSON public API.
// Run: node seed-dummyjson.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const DUMMYJSON_URL = 'https://dummyjson.com/products?limit=100';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB. Fetching products from DummyJSON...');

  const res = await fetch(DUMMYJSON_URL);
  if (!res.ok) throw new Error(`DummyJSON request failed: ${res.status}`);
  const { products: dummyProducts } = await res.json();

  const products = dummyProducts.map((p) => ({
    name: p.title,
    description: p.description,
    price: p.price,
    category: p.category,
    brand: p.brand || 'Generic',
    stock: p.stock,
    images: p.images?.length ? p.images : [p.thumbnail],
    ratingsAverage: p.rating || 0,
    numReviews: Math.floor(Math.random() * 50),
  }));

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products from DummyJSON.`);

  const adminEmail = 'admin@example.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({ name: 'Admin User', email: adminEmail, password: 'admin1234', role: 'admin' });
    console.log('Admin created: admin@example.com / admin1234');
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});