import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import style from './NavBar.module.css';

export default function NavBar() {
  const { token, username, musicianId, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={style.navbar}>
      <ul className={style.navList}>

        <li><Link to="/">Home</Link></li>
        <li><Link to="/recherche">Nouvelle recherche</Link></li>

        {token ? (
          <>
            <li><Link to={`/musicien/${musicianId}`}>Mon profil</Link></li>
            {/* Nouveau lien vers le formulaire de modification */}
            <li>
              <Link to="/profil">Modifier mon profil</Link>
            </li>
            <li className={style.username}>Bonjour, {username}</li>
            <li>
              <button onClick={handleLogout} className={style.logoutBtn}>
                Se déconnecter
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/connexion">Se connecter</Link></li>
            <li><Link to="/inscription">S'inscrire</Link></li>
          </>
        )}

      </ul>
    </nav>
  );
}