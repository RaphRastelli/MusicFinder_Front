import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMusicianProfile } from '../api/musicianApi.js';
import { formatEmail } from '../utils/formatEmail.js';
import style from './ProfilePage.module.css';

export default function ProfilePage() {
  const { id } = useParams();   // récupère l'id depuis l'URL /musicien/:id
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect se déclenche au chargement de la page
  // et à chaque fois que l'id change dans l'URL
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMusicianProfile(id);
        setProfile(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Ce profil est introuvable.');
        } else {
          setError('Une erreur est survenue.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // ── États de chargement et d'erreur ───────────────────────────────
  if (loading) {
    return <div className={style.container}><p>Chargement...</p></div>;
  }

  if (error) {
    return (
      <div className={style.container}>
        <p className={style.error}>{error}</p>
        <button onClick={() => navigate(-1)} className={style.backBtn}>
          ← Retour
        </button>
      </div>
    );
  }

  return (
    <div className={style.container}>

      {/* ── Nom ─────────────────────────────────────────────────── */}
      <h2 className={style.username}>{profile.username}</h2>

      {/* ── Instrument principal ─────────────────────────────────── */}
      {profile.instrumentPrincipal && (
        <div className={style.field}>
          <p className={style.label}>Instrument principal :</p>
          <p className={style.value}>{profile.instrumentPrincipal}</p>
        </div>
      )}

      {/* ── Niveau ───────────────────────────────────────────────── */}
      {profile.ability && (
        <div className={style.field}>
          <p className={style.label}>Niveau de maîtrise de l'instrument :</p>
          <p className={style.value}>{profile.ability}</p>
        </div>
      )}

      {/* ── Instruments secondaires — affiché seulement si au moins un */}
      {profile.instrumentsSecondaires.length > 0 && (
        <div className={style.field}>
          <p className={style.label}>Instrument(s) secondaire(s) :</p>
          <ul className={style.list}>
            {profile.instrumentsSecondaires.map((inst, index) => (
              <li key={index}>{inst}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Style principal ──────────────────────────────────────── */}
      {profile.stylePrincipal && (
        <div className={style.field}>
          <p className={style.label}>Style musical principal :</p>
          <p className={style.value}>{profile.stylePrincipal}</p>
        </div>
      )}

      {/* ── Styles secondaires — affiché seulement si au moins un */}
      {profile.stylesSecondaires.length > 0 && (
        <div className={style.field}>
          <p className={style.label}>Style(s) secondaire(s) :</p>
          <ul className={style.list}>
            {profile.stylesSecondaires.map((s, index) => (
              <li key={index}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Disponible pour ──────────────────────────────────────── */}
      <div className={style.field}>
  <p className={style.label}>Disponible pour :</p>

  {/* Locations — sans préfixe */}
  {profile.locations.length > 0 && (
    <ul className={style.disponibleList}>
      {profile.locations.map((loc, index) => (
        <li key={index} className={style.disponibleItem}>
          {loc}
        </li>
      ))}
    </ul>
  )}

  {/* Filet séparateur entre Locations et ProjectTypes */}
  {profile.locations.length > 0 && profile.projectTypes.length > 0 && (
    <hr className={style.divider} />
  )}

  {/* ProjectTypes — avec préfixe * */}
  {profile.projectTypes.length > 0 && (
    <ul className={style.disponibleList}>
      {profile.projectTypes.map((pt, index) => (
        <li key={index} className={style.disponibleItem}>
          {pt}
        </li>
      ))}
    </ul>
  )}

  {/* Filet séparateur entre ProjectTypes et Availability */}
  {profile.projectTypes.length > 0 && profile.availability && (
    <hr className={style.divider} />
  )}

  {/* Availability — sans préfixe */}
  {profile.availability && (
    <p className={style.disponibleItem}>{profile.availability}</p>
  )}
</div>

      {/* ── Description ──────────────────────────────────────────── */}
      {profile.description && (
        <div className={style.field}>
          <p className={style.label}>Infos :</p>
          {/* whitespace: pre-line respecte les sauts de ligne du texte saisi */}
          <p className={style.description}>{profile.description}</p>
        </div>
      )}

      {/* ── Contact ──────────────────────────────────────────────── */}
      {profile.email && (
        <div className={style.field}>
          <p className={style.label}>Contact :</p>
          {/* formatEmail remplace '@' par '(a)' */}
          <p className={style.value}>{formatEmail(profile.email)}</p>
        </div>
      )}

      <button onClick={() => navigate(-1)} className={style.backBtn}>
        ← Retour
      </button>

    </div>
  );
}