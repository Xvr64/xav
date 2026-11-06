import React from 'react';
import ReactDOM from 'react-dom/client';
import './tailwind.css';
import './terminal.css';
import App from './xavier_h_ry_editorial_portfolio';
import { JourneyArrival } from './JourneyArrival';
import { installArrivalGate } from './journeyEntry';

// Before anything renders: while the arrival is open its gate holds input ahead of every
// controller the site mounts (journeyEntry.ts)
installArrivalGate();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <JourneyArrival />
  </React.StrictMode>
);
