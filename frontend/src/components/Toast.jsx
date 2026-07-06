// src/components/Toast.jsx
import { useEffect, useState } from 'react';

// Individual Toast item
function ToastItem({ id, message, type, onRemove }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(id), 300); // wait for fade-out
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const colors = {
    success: 'bg-green-600',
    error:   'bg-red-600',
    info:    'bg-blue-600',
  };

  const icons = {
    success: '✓',
    error:   '✕',
    info:    'i',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg text-sm font-medium
        transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        ${colors[type] || colors.info}`}
    >
      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
        {icons[type]}
      </span>
      {message}
    </div>
  );
}

// Toast container — place once in your app
let _addToast = null;
export const toast = {
  success: (msg) => _addToast?.(msg, 'success'),
  error:   (msg) => _addToast?.(msg, 'error'),
  info:    (msg) => _addToast?.(msg, 'info'),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  _addToast = (message, type) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onRemove={remove} />
      ))}
    </div>
  );
}
