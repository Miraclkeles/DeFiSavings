// Importing necessary libraries and components
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // This is the main component of our application
import './index.css'; // Global styles for the entire application

// Identifying the root element from the HTML document where our React app will be mounted.
const appMountPoint = document.getElementById('root');

// Rendering our App component within the React.StrictMode wrapper for additional checks and warnings in development mode.
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  appMountPoint // Mounting the App component to the DOM.
);