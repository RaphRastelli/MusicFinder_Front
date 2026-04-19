import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMusicians } from '../api/searchApi.js';
import {
  INSTRUMENTS,
  LOCATIONS,
  ABILITY_LEVELS,
  PROJECT_TYPES,
  AVAILABILITY_LEVELS,
  MUSIC_STYLES,
} from '../data/referentiels.js';
import Toast from '../components/Toast/Toast.jsx';
import style from './SearchPage.module.css';

export default function SearchPage() {
  const navigate = useNavigate();

  // ── État du formulaire ─────────────────────────────────────────────
  // Chaque champ a son propre état — null = rien sélectionné
  // Pour Ability, on utilise un tableau car plusieurs choix sont possibles
  const [instrumentId,   setInstrumentId]   = useState(null);
  const [locationId,     setLocationId]     = useState(null);
  const [abilityIds,     setAbilityIds]     = useState([]);
  const [sansImportance, setSansImportance] = useState(false);
  const [projectTypeId,  setProjectTypeId]  = useState(null);
  const [availabilityId, setAvailabilityId] = useState(null);
  const [musicStyleId,   setMusicStyleId]   = useState(null);

  const [toast,   setToast]   = useState(null);
  const [loading, setLoading] = useState(false);

  // ── Gestion "Sans importance" pour Ability ─────────────────────────
  // Quand l'utilisateur coche "Sans importance", on sélectionne
  // automatiquement tous les niveaux — le backend recevra [1,2,3,4]
  // et donnera le score Ability à n'importe quel niveau
  const handleSansImportance = (checked) => {
    setSansImportance(checked);
    if (checked) {
      setAbilityIds(ABILITY_LEVELS.map((a) => a.id));
    } else {
      setAbilityIds([]);
    }
  };

  // Quand l'utilisateur coche/décoche un niveau individuel,
  // on désélectionne "Sans importance" car le choix n'est plus global
  const handleAbilityChange = (id) => {
    setSansImportance(false);
    setAbilityIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  // ── Validation et soumission ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tous les champs sont obligatoires — on vérifie avant l'appel API
    if (!instrumentId || !locationId || abilityIds.length === 0 ||
        !projectTypeId || !availabilityId || !musicStyleId) {
      setToast({
        message: 'Veuillez remplir tous les champs avant de valider.',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await searchMusicians({
        instrumentId,
        locationId,
        abilityIds,
        projectTypeId,
        availabilityId,
        musicStyleId,
      });

      setToast({ message: 'Recherche enregistrée', type: 'success' });

      // On attend 1 seconde pour que l'utilisateur voie le toast,
      // puis on navigue vers /resultats en passant les résultats
      // via le "state" de React Router — pas d'URL ni de localStorage nécessaire
      setTimeout(() => {
        navigate('/resultats', { state: { result: response.data } });
      }, 1000);

    } catch {
      setToast({ message: 'Une erreur est survenue.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      <h2>Rechercher un musicien ou une musicienne</h2>
      <p className={style.intro}>
        Pour trouver une musicienne ou un musicien, c'est par ici.
        Effectuez votre recherche en remplissant tous les champs.
      </p>

      <form onSubmit={handleSubmit}>

        {/* ── Instrument ────────────────────────────────────────────── */}
        <section className={style.section}>
          <h3>
            Sélectionnez l'instrument recherché
            <small> (un seul choix)</small>
          </h3>
          <div className={style.optionList}>
            {INSTRUMENTS.map((inst) => (
              <label key={inst.id} className={style.option}>
                <input
                  type="radio"
                  name="instrument"
                  value={inst.id}
                  checked={instrumentId === inst.id}
                  onChange={() => setInstrumentId(inst.id)}
                />
                {inst.label}
              </label>
            ))}
          </div>
        </section>

        {/* ── Location ──────────────────────────────────────────────── */}
        <section className={style.section}>
          <h3>
            Votre localisation
            <small> (un seul choix)</small>
          </h3>
          <div className={style.optionList}>
            {LOCATIONS.map((loc) => (
              <label key={loc.id} className={style.option}>
                <input
                  type="radio"
                  name="location"
                  value={loc.id}
                  checked={locationId === loc.id}
                  onChange={() => setLocationId(loc.id)}
                />
                {loc.label}
              </label>
            ))}
          </div>
        </section>

        {/* ── Ability ───────────────────────────────────────────────── */}
        <section className={style.section}>
          <h3>
            Le niveau requis
            <small> (plusieurs choix possibles)</small>
          </h3>
          <div className={style.optionList}>
            {ABILITY_LEVELS.map((level) => (
              <label key={level.id} className={style.option}>
                <input
                  type="checkbox"
                  value={level.id}
                  checked={abilityIds.includes(level.id)}
                  onChange={() => handleAbilityChange(level.id)}
                />
                {level.label}
              </label>
            ))}
            {/* "Sans importance" — option spéciale qui sélectionne tout */}
            <label className={style.option}>
              <input
                type="checkbox"
                checked={sansImportance}
                onChange={(e) => handleSansImportance(e.target.checked)}
              />
              Sans importance
            </label>
          </div>
        </section>

        {/* ── ProjectType ───────────────────────────────────────────── */}
        <section className={style.section}>
          <h3>
            Votre type de projet
            <small> (un seul choix)</small>
          </h3>
          <div className={style.optionList}>
            {PROJECT_TYPES.map((pt) => (
              <label key={pt.id} className={style.option}>
                <input
                  type="checkbox"
                  value={pt.id}
                  checked={selected.includes(pt.id)}
                  onChange={() => handleChange(pt.id)}
                />
                <span>
                  {pt.label}
                  {pt.example && (
                    <small className={style.example}> ({pt.example})</small>
                  )}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* ── Availability ──────────────────────────────────────────── */}
        {/* Les libellés sont adaptés par rapport au profil
            mais les ids correspondent exactement aux valeurs en base :
            1 = Occasionnellement, 2 = 1x/sem+, 3 = 2x/mois+, 4 = 1x/mois- */}
        <section className={style.section}>
          <h3>
            La disponibilité recherchée
            <small> (un seul choix)</small>
          </h3>
          <div className={style.optionList}>
            <label className={style.option}>
              <input
                type="radio"
                name="availability"
                checked={availabilityId === 2}
                onChange={() => setAvailabilityId(2)}
              />
              Une fois par semaine ou plus
            </label>
            <label className={style.option}>
              <input
                type="radio"
                name="availability"
                checked={availabilityId === 3}
                onChange={() => setAvailabilityId(3)}
              />
              Deux fois par mois ou plus
            </label>
            <label className={style.option}>
              <input
                type="radio"
                name="availability"
                checked={availabilityId === 4}
                onChange={() => setAvailabilityId(4)}
              />
              Une fois par mois ou moins
            </label>
            <label className={style.option}>
              <input
                type="radio"
                name="availability"
                checked={availabilityId === 1}
                onChange={() => setAvailabilityId(1)}
              />
              Engagement ponctuel
            </label>
          </div>
        </section>

        {/* ── MusicStyle ────────────────────────────────────────────── */}
        <section className={style.section}>
          <h3>
            Le style de musique visé
            <small> (un seul choix)</small>
          </h3>
          <div className={style.optionList}>
            {MUSIC_STYLES.map((s) => (
              <label key={s.id} className={style.option}>
                <input
                  type="radio"
                  name="musicStyle"
                  value={s.id}
                  checked={musicStyleId === s.id}
                  onChange={() => setMusicStyleId(s.id)}
                />
                {s.label}
              </label>
            ))}
          </div>
        </section>

        <button type="submit" disabled={loading} className={style.btn}>
          {loading ? 'Recherche en cours...' : 'Valider ma recherche'}
        </button>

      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}