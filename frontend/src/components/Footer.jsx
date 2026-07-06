

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t dark:border-gray-700 bg-white dark:bg-gray-900 mt-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} MineShop❤️. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-500">Products</Link>
          <Link to="/cart" className="hover:text-brand-600 dark:hover:text-brand-500">Cart</Link>
          <a href="mailto:support@mineshop.test" className="hover:text-brand-600 dark:hover:text-brand-500">Contact</a>
        </div>
      </div>
    </footer>
  );
}