import { createContext, useContext, useState } from 'react';

// ─── 1. CRÉATION DU CONTEXTE ───────────────────────────────────────────────
// createContext crée un "espace de stockage global" accessible depuis
// n'importe quel composant de l'application, sans avoir à passer des
// props de parent en enfant à chaque niveau.
// La valeur null est la valeur par défaut — elle sera écrasée par le Provider.
const AuthContext = createContext(null);


// ─── 2. LE PROVIDER ───────────────────────────────────────────────────────
// C'est le composant qui "enveloppe" toute l'application (dans main.jsx).
// Il stocke les données d'authentification et les rend disponibles partout.
// { children } représente tout ce qui est à l'intérieur du Provider —
// c'est-à-dire toute l'application.
export function AuthProvider({ children }) {

  // useState initialise l'état avec ce qui est déjà dans localStorage.
  // Comme ça, si l'utilisateur recharge la page, il reste connecté.
  // - ?? null signifie : "si localStorage retourne undefined, utilise null"
  const [token, setToken] = useState(localStorage.getItem('token') ?? null);
  const [username, setUsername] = useState(localStorage.getItem('username') ?? null);
  const [role, setRole] = useState(localStorage.getItem('role') ?? null);
  const [musicianId, setMusicianId] = useState(localStorage.getItem('musicianId') ?? null);

  // ── Fonction login ────────────────────────────────────────────────────
  // Appelée après un register ou login réussi.
  // data contient : { token, username, role } — ce que retourne le backend.
  // On stocke dans localStorage (persistance entre rechargements de page)
  // ET dans le state React (pour que les composants se re-rendent immédiatement).
  const login = (data) => {
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
    localStorage.setItem('musicianId', data.id);

    // Ces setters déclenchent un re-rendu de tous les composants
    // qui utilisent useAuth() — la NavBar bascule immédiatement
    setToken(data.token);
    setUsername(data.username);
    setRole(data.role);
    setMusicianId(data.id);
  };

  // ── Fonction logout ───────────────────────────────────────────────────
  // Supprime tout — localStorage ET state React.
  // Les composants qui utilisent useAuth() se re-rendent automatiquement.
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('musicianId');
    setToken(null);
    setUsername(null);
    setRole(null);
    setMusicianId(null);
  };

  // ── Le rendu du Provider ──────────────────────────────────────────────
  // value={{ ... }} définit ce qui est accessible via useAuth() partout
  // dans l'application. On expose les données ET les fonctions.
  // {children} rend tout ce qui est à l'intérieur du Provider dans main.jsx.
  return (
    <AuthContext.Provider value={{ token, username, role, musicianId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── 3. LE HOOK PERSONNALISÉ ──────────────────────────────────────────────
// useAuth() est un raccourci pour ne pas écrire useContext(AuthContext)
// à chaque fois dans vos composants.
// Usage dans n'importe quel composant :
//   const { token, username, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}