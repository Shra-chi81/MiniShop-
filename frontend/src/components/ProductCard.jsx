import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition p-4 flex flex-col">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.images?.[0] || 'https://placehold.co/300x300?text=No+Image'}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://placehold.co/300x300?text=No+Image';
          }}
          className="w-full h-40 object-cover rounded-md mb-3"
        />
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">{product.name}</h3>
      </Link>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{product.category}</p>
      <p className="text-brand-700 dark:text-brand-500 font-bold mb-2">${product.price.toFixed(2)}</p>
      <p className={`text-xs mb-3 ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </p>
      <button
        disabled={product.stock === 0}
        onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
        className="mt-auto bg-brand-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white py-1.5 rounded-md hover:bg-brand-700"
      >
        Add to Cart
      </button>
    </div>
  );
}