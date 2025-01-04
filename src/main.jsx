import React from 'react';
import ReactDOM from 'react-dom/client'; // import from 'react-dom/client' instead of 'react-dom'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Use ReactDOM.createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
