// Import React, ReactDOM, and required modules from react-router-dom and msal-browser
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication, EventType } from '@azure/msal-browser';

// Create a new PublicClientApplication instance with configuration
const pca = new PublicClientApplication({
  auth: {
    clientId: 'c1c55ec8-2ddf-4f4b-bab0-d11a1d54be82',
    authority: 'https://login.microsoftonline.com/63ea54b8-c60c-4d02-afba-441f22cd7bbe',
    knownAuthorities: ['https://login.microsoftonline.com/63ea54b8-c60c-4d02-afba-441f22cd7bbe'],
    redirectUri: '/',
  }
})

// Add an event callback to the PublicClientApplication instance
pca.addEventCallback(event => {
  // If the event type is LOGIN_SUCCESS, log the event and set the active account
  if (event.eventType === EventType.LOGIN_SUCCESS){
    console.log(event); 
    pca.setActiveAccount(event.payload.accessToken);
  }
});

// Render the App component within a BrowserRouter, passing the msalInstance as a prop
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App msalInstance={pca}/>
    </BrowserRouter>
  </React.StrictMode>
);

// This section of code is for HTTPS redirection and not required in a React app. It can be ignored.
// const express = require('express');
// const app = express();

// Redirect HTTP to HTTPS
// app.use((req, res, next) => {
//     if (req.secure) {
//         next();
//     } else {
//         res.redirect(`https://${req.headers.host}${req.url}`);
//     }
// });

// app.listen(80);
