const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

const TAX_RATE = 0.08;
const FLAT_SHIPPING = 5.99;
const FREE_SHIPPING_THRESHOLD = 75;

// @route POST /api/orders  (customer) - creates order, validates & decrements stock atomically
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('Order must contain at least one item');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }

      product.stock -= item.quantity;
      await product.save({ session });

      subtotal += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0],
        price: product.price,
        quantity: item.quantity,
      });
    }

    const tax = Number((subtotal * TAX_RATE).toFixed(2));
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
    const total = Number((subtotal + tax + shippingFee).toFixed(2));

    const [order] = await Order.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          shippingAddress,
          subtotal,
          tax,
          shippingFee,
          total,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ success: true, order });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400);
    throw err;
  }
});

// @route GET /api/orders/my - customer's own order history
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, orders });
});

// @route GET /api/orders/:id - single order (owner or admin)
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.json({ success: true, order });
});

// @route GET /api/orders (admin) - all orders, optional status filter
const getAllOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const orders = await Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, orders });
});

// @route PUT /api/orders/:id/status (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = status;
  if (status === 'delivered') order.paymentStatus = 'paid';
  await order.save();
  res.json({ success: true, order });
});

module.exports = { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus };
