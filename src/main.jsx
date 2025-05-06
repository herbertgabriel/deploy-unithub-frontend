import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './App.css';
import MainRouter from './routes.jsx';
import { AuthProvider } from './context/AuthContext'; // Importa o AuthProvider

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  </AuthProvider>,
);