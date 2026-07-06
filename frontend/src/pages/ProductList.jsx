import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ q: '', category: '', sort: 'newest', page: 1 });
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/categories/list').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { ...filters };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    api
      .get('/products', { params })
      .then(({ data }) => {
        setProducts(data.products);
        setPages(data.pages || 1);
      })
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          placeholder="Search products..."
          className="border dark:border-gray-600 rounded-md px-3 py-2 flex-1 min-w-[200px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value, page: 1 })}
        />
        <select
          className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className="border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
        >
          <option value="newest">Newest</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setFilters({ ...filters, page: p })}
              className={`px-3 py-1 rounded-md ${
                filters.page === p
                  ? 'bg-brand-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border dark:border-gray-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}