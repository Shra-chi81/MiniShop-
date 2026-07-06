import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store/store';
import { ThemeProvider } from './store/ThemeContext';
import './index.css';
import { ToastContainer } from './components/Toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
          <ToastContainer />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
