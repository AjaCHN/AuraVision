
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './assets/styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
