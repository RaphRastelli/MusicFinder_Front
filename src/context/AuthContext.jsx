import { createContext, useContext, useState } from 'react';

// 1. Création du contexte
const AuthContext = createContext(null);

// 2. Provider — enveloppe l'application et rend les données auth accessibles partout
export function AuthProvider({ children }) {
  const [token,    setToken]    = useState(localStorage.getItem('token')    ?? null);
  const [username, setUsername] = useState(localStorage.getItem('username') ?? null);
  const [role,     setRole]     = useState(localStorage.getItem('role')     ?? null);

  // Appelé après un login ou register réussi
  const login = (data) => {
    localStorage.setItem('token',    data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role',     data.role);
    setToken(data.token);
    setUsername(data.username);
    setRole(data.role);
  };

  // Appelé lors de la déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setToken(null);
    setUsername(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook personnalisé — permet d'utiliser le contexte en une ligne dans n'importe quel composant
export function useAuth() {
  return useContext(AuthContext);
}