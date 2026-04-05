import { useLocation, useNavigate, Link } from 'react-router-dom';
import style from './ResultsPage.module.css';

export default function ResultsPage() {
  const { state } = useLocation();
  // useLocation().state contient ce qu'on a passé via navigate('/resultats', { state: ... })
  // Si l'utilisateur arrive directement sur /resultats sans passer par la recherche,
  // state sera null — on le redirige vers le formulaire

  const navigate = useNavigate();

  if (!state?.result) {
    navigate('/recherche');
    return null;
  }

  const { musicians, totalCount, noInstrumentMatch } = state.result;

  // ── Cas : aucun musicien ne joue l'instrument recherché ────────────
  if (noInstrumentMatch) {
    return (
      <div className={style.container}>
        <p className={style.noResult}>
          Désolé, aucun•e musicien•ne ne joue de l'instrument recherché.
        </p>
        <button
          onClick={() => navigate('/recherche')}
          className={style.backBtn}
        >
          ← Retour à la recherche
        </button>
      </div>
    );
  }

  return (
    <div className={style.container}>

      {/* En-tête avec le nombre de résultats */}
      <div className={style.header}>
        <h2>Résultats de la recherche</h2>
        <p className={style.count}>
          {totalCount} musicien•ne{totalCount > 1 ? 's' : ''} trouvé•e{totalCount > 1 ? 's' : ''}
        </p>
      </div>

      {/* Liste des musiciens triés par score décroissant */}
      <ul className={style.list}>
        {musicians.map((musician) => (
          <li key={musician.id} className={style.card}>
            <span className={style.username}>{musician.username}</span>
            {/* "Voir plus" mène vers le profil public — page à créer */}
            <Link
              to={`/musicien/${musician.id}`}
              className={style.viewBtn}
            >
              Voir plus
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate('/recherche')}
        className={style.backBtn}
      >
        ← Retour à la recherche
      </button>

    </div>
  );
}