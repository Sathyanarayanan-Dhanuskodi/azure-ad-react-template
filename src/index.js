import React from 'react';
import ReactDOM from 'react-dom/client';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import App from './App';

const pca = new PublicClientApplication({
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
    authority: process.env.REACT_APP_AZURE_AUTHORITY,
    redirectUri: '/',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MsalProvider instance={pca}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </MsalProvider>
);
