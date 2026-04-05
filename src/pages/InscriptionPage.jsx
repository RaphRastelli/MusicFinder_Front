import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { register } from '../api/authApi.js';
import style from './InscriptionPage.module.css';

export default function InscriptionPage() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  // État du formulaire
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // État des messages
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validation du mot de passe — correspond aux règles de votre DTO backend
  const validatePassword = (pwd) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation côté frontend avant d'envoyer au backend
    if (username.length < 3) {
      setError("Le nom doit contenir au moins 3 caractères.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        'Le mot de passe doit contenir au moins 8 caractères, ' +
        'une majuscule, une minuscule, un chiffre et un caractère spécial.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const response = await register(username, email, password);

      // Connexion automatique après inscription
      authLogin({
        id: response.data.id,
        token: response.data.token,
        username: response.data.username,
        role: response.data.role,
      });

      setSuccess('Vous êtes bien inscrit•e !');

      // Redirection vers le profil après 1.5 secondes
      setTimeout(() => navigate('/profil'), 1500);

    } catch (err) {
      if (err.response?.status === 400) {
        // Le backend retourne des détails de validation
        const detail = err.response.data?.message
                    || err.response.data?.title
                    || "Données invalides. Vérifiez vos informations.";
        setError(detail);
      } else if (err.response?.status === 409) {
        setError("Cet e-mail ou ce nom d'utilisateur est déjà utilisé.");
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      <h2>S'inscrire</h2>

      <form onSubmit={handleSubmit} className={style.form}>

        <div className={style.field}>
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={3}
            maxLength={50}
            required
          />
        </div>

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
          <small className={style.hint}>
            8 caractères minimum, avec au moins une majuscule,
            une minuscule, un chiffre et un caractère spécial.
          </small>
        </div>

        <div className={style.field}>
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Messages de retour */}
        {error   && <p className={style.error}>{error}</p>}
        {success && <p className={style.success}>{success}</p>}

        <button type="submit" disabled={loading} className={style.btn}>
          {loading ? 'Inscription...' : 'Inscription'}
        </button>

      </form>

      <div className={style.links}>
        <Link to="/profil">Remplir mon profil</Link>
        <Link to="/connexion">Connexion</Link>
      </div>
    </div>
  );
}