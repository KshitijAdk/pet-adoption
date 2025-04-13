import React from 'react';
import ReactDOM from 'react-dom/client'; // import from 'react-dom/client' instead of 'react-dom'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AppContextProvider } from './context/AppContext';
import { PetProvider } from './context/PetContext';

// Use ReactDOM.createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <AppContextProvider>
      <PetProvider>
        <App />
      </PetProvider>
    </AppContextProvider>
  </BrowserRouter>
);
