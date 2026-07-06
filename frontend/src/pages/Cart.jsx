import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateQuantity, removeFromCart, selectCartTotals } from '../store/slices/cartSlice';

export default function Cart() {
  const { items } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const { subtotal, tax, shippingFee, total } = useSelector(selectCartTotals);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty.</p>
        <Link to="/" className="text-brand-600 font-medium">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <img
              src={item.image || 'https://placehold.co/80x80'}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">${item.price.toFixed(2)} each</p>
            </div>
            <input
              type="number"
              min={1}
              max={item.stock}
              value={item.quantity}
              onChange={(e) =>
                dispatch(updateQuantity({ productId: item.productId, quantity: Number(e.target.value) }))
              }
              className="border dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-16 text-center"
            />
            <p className="w-20 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            <button
              onClick={() => dispatch(removeFromCart(item.productId))}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow max-w-sm ml-auto space-y-2">
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Shipping</span><span>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t dark:border-gray-700 pt-2">
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => navigate(user ? '/checkout' : '/login')}
          className="w-full bg-brand-600 text-white py-2 rounded-md hover:bg-brand-700 mt-3"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}