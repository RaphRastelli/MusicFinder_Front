import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Props :
// - children   : le composant à afficher si l'accès est autorisé
// - requiredRole : rôle requis (optionnel — ex: "Admin")
//                  si non fourni, il suffit d'être connecté
export default function ProtectedRoute({ children, requiredRole }) {
  const { token, role } = useAuth();

  // Cas 1 — pas de token → pas connecté → redirection vers /connexion
  if (!token) {
    return <Navigate to="/connexion" replace />;
  }

  // Cas 2 — un rôle est requis et l'utilisateur ne l'a pas
  // → redirection vers l'accueil
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Cas 3 — tout est ok → on affiche le composant enfant
  return children;
}