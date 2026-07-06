import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../store/slices/authSlice';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
      {error && <p className="bg-red-50 text-red-600 text-sm p-2 rounded mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Full Name"
          required
          className="w-full border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          required
          minLength={6}
          className="w-full border dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          disabled={loading}
          className="w-full bg-brand-600 text-white py-2 rounded-md hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account? <Link to="/login" className="text-brand-600">Login</Link>
      </p>
    </div>
  );
}