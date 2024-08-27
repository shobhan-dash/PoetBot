import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // [TODO]: Find out why StrictMode causes multiple socket connections
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
