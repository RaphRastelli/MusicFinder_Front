import { useState, useEffect } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import InstrumentPrincipalForm    from '../components/ProfilForm/InstrumentPrincipalForm.jsx';
import InstrumentsSecondairesForm from '../components/ProfilForm/InstrumentsSecondairesForm.jsx';
import NiveauForm                 from '../components/ProfilForm/NiveauForm.jsx';
import LocalisationForm           from '../components/ProfilForm/LocalisationForm.jsx';
import DisponibiliteForm          from '../components/ProfilForm/DisponibiliteForm.jsx';
import StylePrincipalForm         from '../components/ProfilForm/StylePrincipalForm.jsx';
import StylesSecondairesForm      from '../components/ProfilForm/StylesSecondairesForm.jsx';
import DescriptionForm            from '../components/ProfilForm/DescriptionForm.jsx';
import style from './ProfilFormPage.module.css';
import ProjectTypeForm from '../components/ProfilForm/ProjectTypeForm.jsx';
import {
  getMyProfile,
  saveInstrumentPrincipal,
  saveInstrumentsSecondaires,
  saveNiveau,
  saveProjectTypes,
  saveDisponibilite,
  saveLocations,
  saveStylePrincipal,
  saveStylesSecondaires,
  saveDescription,
} from '../api/musicianApi.js';
import { INSTRUMENTS, LOCATIONS, ABILITY_LEVELS,
         AVAILABILITY_LEVELS, MUSIC_STYLES, PROJECT_TYPES } from '../data/referentiels.js';


export default function ProfilFormPage() {
  /* const { token } = useAuth(); */   // on récupère le token pour vérifier la connexion
  /* const navigate = useNavigate(); */ // hook pour naviguer vers une autre page
  // supprimés car guards/ProtectedRoute.jsx mis en place

  const { musicianId } = useAuth();

  const [profileLoaded, setProfileLoaded] = useState(false);


  // ─── États pour les dépendances entre formulaires ─────────────────────
  // Ces deux valeurs sont partagées entre formulaires :
  // - instrumentPrincipalId est passé à InstrumentsSecondairesForm
  //   pour qu'il exclue l'instrument principal de sa liste
  // - stylePrincipalId est passé à StylesSecondairesForm
  //   pour la même raison
  // États initiaux pour chaque formulaire
  const [initialInstrumentPrincipal, setInitialInstrumentPrincipal] = useState(null);
  const [initialInstrumentsSecondaires, setInitialInstrumentsSecondaires] = useState([]);
  const [initialNiveau, setInitialNiveau] = useState(null);
  const [initialLocations, setInitialLocations] = useState([]);
  const [initialProjectTypes, setInitialProjectTypes] = useState([]);
  const [initialDisponibilite, setInitialDisponibilite] = useState(null);
  const [initialStylePrincipal, setInitialStylePrincipal] = useState(null);
  const [initialStylesSecondaires, setInitialStylesSecondaires] = useState([]);
  const [initialDescription, setInitialDescription] = useState('');

  // États pour les dépendances entre formulaires
  const [instrumentPrincipalId, setInstrumentPrincipalId] = useState(null);
  const [stylePrincipalId, setStylePrincipalId] = useState(null)

  // Chargement du profil existant au montage du composant
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        const profile  = response.data;

        // Conversion des libellés en ids pour pré-sélectionner les bonnes options
        const instrPrincipal = INSTRUMENTS.find(
          i => i.label === profile.instrumentPrincipal)?.id ?? null;
        const instrsSecondaires = INSTRUMENTS
          .filter(i => profile.instrumentsSecondaires.includes(i.label))
          .map(i => i.id);
        const niveau = ABILITY_LEVELS.find(
          a => a.label === profile.ability)?.id ?? null;
        const locs = LOCATIONS
          .filter(l => profile.locations.includes(l.label))
          .map(l => l.id);
        const projTypes = PROJECT_TYPES
          .filter(pt => profile.projectTypes.includes(pt.label))
          .map(pt => pt.id);
        const dispo = AVAILABILITY_LEVELS.find(
          a => a.label === profile.availability)?.id ?? null;
        const stylePrinc = MUSIC_STYLES.find(
          s => s.label === profile.stylePrincipal)?.id ?? null;
        const stylesSecond = MUSIC_STYLES
          .filter(s => profile.stylesSecondaires.includes(s.label))
          .map(s => s.id);

        // Logs de diagnostic
      console.log('instrumentsSecondaires reçus :', profile.instrumentsSecondaires);
      console.log('instrsSecondaires convertis :', instrsSecondaires);
      console.log('projectTypes reçus :', profile.projectTypes);
      console.log('projTypes convertis :', projTypes);
      console.log('PROJECT_TYPES labels :', PROJECT_TYPES.map(pt => pt.label));

        setInitialInstrumentPrincipal(instrPrincipal);
        setInitialInstrumentsSecondaires(instrsSecondaires);
        setInitialNiveau(niveau);
        setInitialLocations(locs);
        setInitialProjectTypes(projTypes);
        setInitialDisponibilite(dispo);
        setInitialStylePrincipal(stylePrinc);
        setInitialStylesSecondaires(stylesSecond);
        setInitialDescription(profile.description ?? '');

        // Mise à jour des états de dépendance
        setInstrumentPrincipalId(instrPrincipal);
        setStylePrincipalId(stylePrinc);

      } catch {
        // Profil pas encore rempli — on laisse les formulaires vides
      } finally {
        setProfileLoaded(true);
      }
    };

    fetchProfile();
  }, []);

  // On attend que le profil soit chargé avant d'afficher les formulaires
  if (!profileLoaded) {
    return <div className={style.container}><p>Chargement...</p></div>;
  }


  // ─── Protection de la route ───────────────────────────────────────────
  // Si l'utilisateur n'est pas connecté (pas de token), on le redirige
  // vers la page de connexion avant de rendre quoi que ce soit.
  // return null empêche le rendu du reste du composant.
  /* if (!token) {
    navigate('/connexion');
    return null;
  } */
 // supprimé car guards/ProtectedRoute.jsx mis en place


  // ─── Handlers ─────────────────────────────────────────────────────────
  // Chaque handler reçoit la valeur sélectionnée depuis le sous-formulaire
  // et sera responsable de l'appel API vers le backend.
  // Pour l'instant on log — les vrais appels API viennent à l'étape suivante.
  //
  // Ce pattern s'appelle "lift state up" (remonter l'état) :
  // les sous-formulaires ne connaissent pas l'API, ils délèguent
  // au parent via la prop onSave.

  const handleInstrumentPrincipal = async (id) => {
    await saveInstrumentPrincipal(id);
    // On mémorise l'id pour le passer à InstrumentsSecondairesForm
    // qui doit exclure cet instrument de sa propre liste
    setInstrumentPrincipalId(id);
  };

  const handleInstrumentsSecondaires = async (ids) => {
    // ids est un tableau — ex: [3, 7, 12]
    await saveInstrumentsSecondaires(ids);
  };

  const handleNiveau = async (id) => {
  await saveNiveau(id);
  };

  const handleLocalisation = async (ids) => {
    // ids est un tableau — ex: [1, 5]
    await saveLocations(ids);
  };

  const handleProjectTypes = async (ids) => {
  await saveProjectTypes(ids);
  };

  const handleDisponibilite = async (id) => {
    await saveDisponibilite(id);
  };

  const handleStylePrincipal = async (id) => {
    await saveStylePrincipal(id);
    // On mémorise l'id pour le passer à StylesSecondairesForm
    setStylePrincipalId(id);
  };

  const handleStylesSecondaires = async (ids) => {
    await saveStylesSecondaires(ids);
  };

  const handleDescription = async (text) => {
  await saveDescription(text);
};


  return (
    <div className={style.container}>
      <h2>Mon profil</h2>

      {/* Chaque sous-formulaire reçoit son handler via la prop onSave.
          Quand l'utilisateur clique Valider dans un sous-formulaire,
          celui-ci appelle onSave(valeurSelectionnee) — ce qui exécute
          le handler correspondant ici dans ProfilFormPage. */}

      <InstrumentPrincipalForm
        onSave={handleInstrumentPrincipal}
        initialValue={initialInstrumentPrincipal}  // ← Affiche valeur existante
      />

      {/* instrumentPrincipalId est passé en prop pour que ce formulaire
          puisse exclure l'instrument principal de ses options */}
      <InstrumentsSecondairesForm
        onSave={handleInstrumentsSecondaires}
        instrumentPrincipalId={instrumentPrincipalId}
        initialValue={initialInstrumentsSecondaires}
      />

      <NiveauForm
        onSave={handleNiveau}
        initialValue={initialNiveau}
      />

      <LocalisationForm
        onSave={handleLocalisation}
        initialValues={initialLocations}
      />

      <ProjectTypeForm
       onSave={handleProjectTypes}
       initialValues={initialProjectTypes}
      />

      <DisponibiliteForm
        onSave={handleDisponibilite}
        initialValue={initialDisponibilite}
      />

      <StylePrincipalForm
        onSave={handleStylePrincipal}y
        initialValue={initialStylePrincipal}
      />

      {/* stylePrincipalId est passé en prop pour la même raison */}
      <StylesSecondairesForm
        onSave={handleStylesSecondaires}
        stylePrincipalId={stylePrincipalId}
        initialValues={initialStylesSecondaires}
      />

      {/* Dernier formulaire — description libre */}
      <DescriptionForm
        onSave={handleDescription}
        initialValue={initialDescription}
      />

      {/* Bouton "Voir mon profil" — en bas de page */}
      <div className={style.profileLink}>
        <Link to={`/musicien/${musicianId}`} className={style.profileBtn}>
          Voir mon profil
        </Link>
      </div>

    </div>
  );
}