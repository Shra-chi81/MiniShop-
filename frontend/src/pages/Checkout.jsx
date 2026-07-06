import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { clearCart, selectCartTotals } from '../store/slices/cartSlice';

export default function Checkout() {
  const { items } = useSelector((s) => s.cart);
  const totals = useSelector(selectCartTotals);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: '' });
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: address,
      };
      const { data } = await api.post('/orders', payload);
      dispatch(clearCart());
      navigate(`/dashboard`, { state: { orderId: data.order._id } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {error && <p className="bg-red-50 text-red-600 text-sm p-2 rounded mb-4">{error}</p>}
      <form onSubmit={handlePlaceOrder} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <input
          placeholder="Street Address"
          required
          className="w-full border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="City"
            required
            className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <input
            placeholder="State"
            className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          />
          <input
            placeholder="ZIP Code"
            required
            className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={address.zip}
            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
          />
          <input
            placeholder="Country"
            required
            className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
          />
        </div>

        <div className="border-t dark:border-gray-700 pt-4 space-y-1">
          <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Tax</span><span>${totals.tax.toFixed(2)}</span></div>
          <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Shipping</span><span>${totals.shippingFee.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
        </div>

        <button
          disabled={placing}
          className="w-full bg-brand-600 text-white py-2 rounded-md hover:bg-brand-700 disabled:opacity-50"
        >
          {placing ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}