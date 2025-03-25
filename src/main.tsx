
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Make sure we're targeting the right element and add error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find the root element');
  throw new Error('Failed to find the root element');
}

// Enhanced error handling for router initialization
try {
  console.log('Initializing application...');
  console.log('Current location:', window.location.pathname);
  
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('Main entry point initialized successfully');
} catch (error) {
  console.error('Failed to initialize application:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Application Error</h1>
      <p>Sorry, there was a problem loading the application.</p>
      <pre style="background: #f5f5f5; padding: 10px; text-align: left; overflow: auto;">${error?.message || 'Unknown error'}</pre>
    </div>
  `;
}
