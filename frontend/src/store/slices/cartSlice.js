import { createSlice } from '@reduxjs/toolkit';
import { login, register, logout } from './authSlice';

const TAX_RATE = 0.08;
const FLAT_SHIPPING = 5.99;
const FREE_SHIPPING_THRESHOLD = 75;

// Each user (and guests) gets their own cart, isolated by key.
// Guests use 'guest'; logged-in users use their Mongo _id.
const getCartKey = (ownerId) => `cart_${ownerId || 'guest'}`;

const loadCartFor = (ownerId) => {
  try {
    return JSON.parse(localStorage.getItem(getCartKey(ownerId))) || [];
  } catch {
    return [];
  }
};

const persist = (ownerId, items) => {
  localStorage.setItem(getCartKey(ownerId), JSON.stringify(items));
};

// Determine whose cart to load on first app boot (e.g. page refresh while logged in)
const getStoredUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id || null;
  } catch {
    return null;
  }
};

const initialOwner = getStoredUserId() || 'guest';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    owner: initialOwner,
    items: loadCartFor(initialOwner),
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.productId === product._id);
      const maxQty = product.stock;

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, maxQty);
      } else {
        state.items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
          stock: product.stock,
          quantity: Math.min(quantity, maxQty),
        });
      }
      persist(state.owner, state.items);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock));
      }
      persist(state.owner, state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      persist(state.owner, state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist(state.owner, state.items);
    },
  },
  extraReducers: (builder) => {
    // Switch to this user's own cart the moment they log in or register
    builder.addCase(login.fulfilled, (state, action) => {
      const userId = action.payload.user.id;
      state.owner = userId;
      state.items = loadCartFor(userId);
    });
    builder.addCase(register.fulfilled, (state, action) => {
      const userId = action.payload.user.id;
      state.owner = userId;
      state.items = loadCartFor(userId);
    });
    // On logout, fall back to a separate guest cart (their own cart stays saved for next login)
    builder.addCase(logout, (state) => {
      state.owner = 'guest';
      state.items = loadCartFor('guest');
    });
  },
});

export const selectCartTotals = (state) => {
  const items = state.cart.items;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = Number((subtotal + tax + shippingFee).toFixed(2));
  return { subtotal, tax, shippingFee, total, itemCount: items.reduce((n, i) => n + i.quantity, 0) };
};

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;