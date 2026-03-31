import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import style from './HomePage.module.css';

export default function HomePage() {
  const { token } = useAuth();

  return (
    <div className={style.container}>

      <h2>
        Bienvenue sur <strong>MusicianFinder</strong>, le site fait pour
        trouver des musiciens et musiciennes.
      </h2>

      <div className={style.intro}>
        <p>
          Vous êtes musicien.ne et vous cherchez une ou un musicien.ne pour
          un projet ponctuel, pour votre groupe… Vous êtes au bon endroit.
        </p>
        <p>
          Vous n'êtes pas musicien.ne mais vous voulez en trouver pour une
          collaboration sur votre projet, pour trouver des cours… Vous êtes
          aussi au bon endroit.
        </p>
        <p>
          MusicianFinder permet aux musiciens et musiciennes de s'inscrire
          et de se créer un profil en lien avec leur pratique musicale :
          instrument(s) joué(s), disponibilité, type(s) de projet(s),
          localisation…
        </p>
        <p>
          MusicianFinder vous permet, que vous soyez inscrit.e ou non, de
          rechercher des musiciennes et musiciens en fonction de ces
          différents critères et, ensuite, de pouvoir leur envoyer des
          messages.
        </p>
      </div>

      <div className={style.actions}>

        {!token && (
          // Boutons visibles uniquement si non connecté
          <Link to="/inscription" className={style.btn}>
            Je veux m'inscrire comme musicien.ne
          </Link>
        )}

        <Link to="/recherche" className={style.btn}>
          Je ne suis pas inscrit.e mais cherche un ou une musicien.ne
        </Link>

        {token ? (
          // Connecté — accès direct au profil
          <Link to="/profil" className={style.btn}>
            Je veux modifier mon profil ou effectuer une recherche
          </Link>
        ) : (
          // Non connecté — invitation à se connecter
          <Link to="/connexion" className={style.btn}>
            Je suis déjà inscrit.e et veux modifier mon profil ou
            effectuer une recherche
          </Link>
        )}

      </div>

    </div>
  );
}