import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { login } from '../api/authApi.js';
import style from './ConnexionPage.module.css';

export default function ConnexionPage() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  // État du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // État des messages
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await login(email, password);

      // Stockage du token et des infos dans le contexte
      authLogin({
        token:    response.data.token,
        username: response.data.username,
        role:     response.data.role,
      });

      setSuccess('Vous êtes bien connecté !');

      // Redirection vers le homepage après 1.5 secondes
      setTimeout(() => navigate('/'), 1500);

    } catch (err) {
      if (err.response?.status === 401) {
        setError('E-mail ou mot de passe invalide.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      <h2>Se connecter</h2>

      <form onSubmit={handleSubmit} className={style.form}>

        <div className={style.field}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={style.field}>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Messages de retour */}
        {error && <p className={style.error}>{error}</p>}
        {success && <p className={style.success}>{success}</p>}

        <button type="submit" disabled={loading} className={style.btn}>
          {loading ? 'Connexion...' : 'Connexion'}
        </button>

      </form>

      <div className={style.links}>
        <Link to="/profil">Remplir mon profil</Link>
        <Link to="/inscription">Créer un compte</Link>
      </div>
    </div>
  );
}