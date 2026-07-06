import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../api/axios';
import { addToCart } from '../store/slices/cartSlice';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data.product));
  }, [id]);

  if (!product) return <p className="text-center py-10 text-gray-500 dark:text-gray-400">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <img
        src={product.images?.[0] || 'https://placehold.co/500x500?text=No+Image'}
        alt={product.name}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = 'https://placehold.co/500x500?text=No+Image';
        }}
        className="w-full rounded-lg shadow"
      />
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{product.category} • {product.brand}</p>
        <p className="text-2xl text-brand-700 dark:text-brand-500 font-bold mb-4">${product.price.toFixed(2)}</p>
        <p className="text-gray-700 dark:text-gray-200 mb-6">{product.description}</p>
        <p className={`mb-4 text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
        {product.stock > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
              className="border dark:border-gray-600 rounded-md px-3 py-2 w-20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={() => dispatch(addToCart({ product, quantity: qty }))}
              className="bg-brand-600 text-white px-6 py-2 rounded-md hover:bg-brand-700"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}