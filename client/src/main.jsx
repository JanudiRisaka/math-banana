// Serves as the entry point for the React application, setting up rendering and context providers.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import { GameProvider } from './context/GameContext';
import { UserProvider } from './context/UserContext';

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <GameProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </GameProvider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>

);