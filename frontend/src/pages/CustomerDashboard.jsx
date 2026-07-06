import { useEffect, useState } from 'react';
import api from '../api/axios';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api.get('/orders/my').then(({ data }) => setOrders(data.orders)).finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) => setExpandedId((current) => (current === id ? null : id));

  if (loading) return <p className="text-center py-10 text-gray-500 dark:text-gray-400">Loading orders...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const isOpen = expandedId === o._id;
            return (
              <div key={o._id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <button
                  onClick={() => toggleExpand(o._id)}
                  className="w-full text-left p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-sm text-gray-500 dark:text-gray-400">#{o._id.slice(-8)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[o.status]}`}>{o.status}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {o.items.length} item(s) • {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                      <p className="font-bold">${o.total.toFixed(2)}</p>
                    </div>
                    <span
                      className={`text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t dark:border-gray-700 px-4 py-4 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Items</p>
                      <div className="space-y-2">
                        {o.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <img
                              src={item.image || 'https://placehold.co/48x48?text=No+Image'}
                              alt={item.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = 'https://placehold.co/48x48?text=No+Image';
                              }}
                              className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Shipping Address</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {o.shippingAddress.street}, {o.shippingAddress.city}
                        {o.shippingAddress.state ? `, ${o.shippingAddress.state}` : ''} {o.shippingAddress.zip}
                        <br />
                        {o.shippingAddress.country}
                      </p>
                    </div>

                    <div className="border-t dark:border-gray-700 pt-3 space-y-1 text-sm">
                      <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>Subtotal</span><span>${o.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>Tax</span><span>${o.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>Shipping</span>
                        <span>{o.shippingFee === 0 ? 'Free' : `$${o.shippingFee.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 dark:text-gray-100">
                        <span>Total</span><span>${o.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}