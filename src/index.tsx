import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { injectSpeedInsights } from "@vercel/speed-insights";

injectSpeedInsights();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
