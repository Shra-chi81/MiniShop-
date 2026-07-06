import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { selectCartTotals } from '../store/slices/cartSlice';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const { itemCount } = useSelector(selectCartTotals);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-20 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-700 dark:text-brand-500" onClick={closeMenu}>
          MineShop❤️
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-700 dark:text-gray-200">
          <Link to="/" className="hover:text-brand-600">Products</Link>
          <Link to="/cart" className="hover:text-brand-600 relative">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-600 text-white text-xs rounded-full px-1.5">
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="hover:text-brand-600">Admin</Link>
              ) : (
                <Link to="/dashboard" className="hover:text-brand-600">My Orders</Link>
              )}
              <span className="text-gray-500 dark:text-gray-400">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="text-red-600 hover:text-red-700">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-brand-600">Login</Link>
              <Link to="/register" className="bg-brand-600 text-white px-3 py-1.5 rounded-md hover:bg-brand-700">
                Sign Up
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile: cart icon + theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/cart" className="relative text-sm font-medium text-gray-700 dark:text-gray-200" onClick={closeMenu}>
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-600 text-white text-xs rounded-full px-1.5">
                {itemCount}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="w-8 h-8 flex flex-col justify-center items-center gap-1.5"
          >
            <span className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-200" />
            <span className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-200" />
            <span className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-200" />
          </button>
        </div>
      </div>

      {/* Mobile slide-out drawer */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div className="fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white dark:bg-gray-900 z-40 shadow-xl md:hidden flex flex-col">
            <div className="bg-brand-600 text-white px-5 pt-6 pb-5 flex items-start justify-between">
              <div>
                {user ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold mb-2">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-semibold leading-tight">{user.name}</p>
                    <p className="text-xs text-brand-50">{user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
                  </>
                ) : (
                  <p className="font-semibold text-lg">MineShop❤️</p>
                )}
              </div>
              <button aria-label="Close menu" onClick={closeMenu} className="text-white text-2xl leading-none">
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-3">
              <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">General</p>
              <Link
                to="/"
                onClick={closeMenu}
                className="block px-3 py-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
              >
                Products
              </Link>
              <Link
                to="/cart"
                onClick={closeMenu}
                className="block px-3 py-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
              >
                Cart {itemCount > 0 && `(${itemCount})`}
              </Link>

              {user && (
                <>
                  <p className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Account</p>
                  {user.role === 'admin' ? (
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      className="block px-3 py-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      onClick={closeMenu}
                      className="block px-3 py-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
                    >
                      My Orders
                    </Link>
                  )}
                </>
              )}
            </div>

            <div className="px-2 py-4 border-t dark:border-gray-700">
              <ThemeToggle variant="drawer" />
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-3 rounded-md text-red-600 hover:bg-red-50 font-medium"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-center border border-brand-600 text-brand-600 py-2 rounded-md font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="text-center bg-brand-600 text-white py-2 rounded-md font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}