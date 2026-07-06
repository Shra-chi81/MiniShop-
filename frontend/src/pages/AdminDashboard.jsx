import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyProduct = { name: '', description: '', price: '', category: '', brand: '', stock: '', images: [] };

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const loadProducts = () => api.get('/products', { params: { limit: 100 } }).then(({ data }) => setProducts(data.products));
  const loadOrders = () => api.get('/orders').then(({ data }) => setOrders(data.orders));

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  // Uploads all selected files in a single request; backend expects field name 'images'
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setUploadError('');
    try {
      const fd = new FormData();
      files.forEach((file) => fd.append('images', file));
      const { data } = await api.post('/upload', fd);
      setForm((f) => ({ ...f, images: [...f.images, ...data.urls] }));
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = ''; // allow re-selecting the same file
    }
  };

  const addUrlManually = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setForm((f) => ({ ...f, images: [...f.images, trimmed] }));
    setUrlInput('');
  };

  const removeImage = (idx) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage('Product updated');
      } else {
        await api.post('/products', payload);
        setMessage('Product created');
      }
      setForm(emptyProduct);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      brand: p.brand,
      stock: p.stock,
      images: p.images || [],
    });
    setTab('products');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const handleStatusChange = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    loadOrders();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-4 mb-6 border-b dark:border-gray-700">
        {['products', 'orders'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 px-2 capitalize ${tab === t ? 'border-b-2 border-brand-600 text-brand-700 dark:text-brand-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-3 h-fit">
            <h2 className="font-semibold mb-2">{editingId ? 'Edit Product' : 'Add Product'}</h2>
            {message && <p className="text-sm text-brand-700 dark:text-brand-500">{message}</p>}
            <input placeholder="Name" required className="w-full border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <textarea placeholder="Description" required className="w-full border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" step="0.01" placeholder="Price" required className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <input type="number" placeholder="Stock" required className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              <input placeholder="Category" required className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <input placeholder="Brand" className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Product Images</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                multiple
                onChange={handleFileChange}
                disabled={uploading}
                className="w-full text-sm text-gray-700 dark:text-gray-200 border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-brand-600 file:text-white file:text-sm hover:file:bg-brand-700 file:cursor-pointer"
              />
              {uploading && <p className="text-xs text-brand-600 mt-1">Uploading...</p>}
              {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
            </div>

            {/* Optional: still allow pasting an external URL */}
            <div className="flex gap-2">
              <input
                placeholder="...or paste an image URL"
                className="flex-1 border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <button type="button" onClick={addUrlManually}
                className="px-3 py-2 rounded-md border dark:border-gray-600 text-gray-700 dark:text-gray-200">
                Add
              </button>
            </div>

            {/* Preview thumbnails */}
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.images.map((url, idx) => (
                  <div key={idx} className="relative w-16 h-16">
                    <img
                      src={url}
                      alt={`preview ${idx}`}
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/64x64?text=No+Image'; }}
                      className="w-16 h-16 object-cover rounded-md border dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      aria-label="Remove image"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700">
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm(emptyProduct); }}
                  className="px-4 py-2 rounded-md border dark:border-gray-600 text-gray-700 dark:text-gray-200">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {products.map((p) => (
              <div key={p._id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow flex items-center gap-3">
                <img
                  src={p.images?.[0] || 'https://placehold.co/60x60'}
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/60x60?text=No+Image'; }}
                  className="w-14 h-14 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">${p.price.toFixed(2)} • Stock: {p.stock}</p>
                </div>
                <button onClick={() => handleEdit(p)} className="text-brand-600 text-sm">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="text-red-500 text-sm">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center justify-between">
              <div>
                <p className="font-mono text-sm text-gray-500 dark:text-gray-400">#{o._id.slice(-8)}</p>
                <p className="text-sm">{o.user?.name} ({o.user?.email})</p>
                <p className="font-bold">${o.total.toFixed(2)}</p>
              </div>
              <select
                value={o.status}
                onChange={(e) => handleStatusChange(o._id, e.target.value)}
                className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}