import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import InstrumentPrincipalForm    from '../components/ProfilForm/InstrumentPrincipalForm.jsx';
import InstrumentsSecondairesForm from '../components/ProfilForm/InstrumentsSecondairesForm.jsx';
import NiveauForm                 from '../components/ProfilForm/NiveauForm.jsx';
import LocalisationForm           from '../components/ProfilForm/LocalisationForm.jsx';
import DisponibiliteForm          from '../components/ProfilForm/DisponibiliteForm.jsx';
import StylePrincipalForm         from '../components/ProfilForm/StylePrincipalForm.jsx';
import StylesSecondairesForm      from '../components/ProfilForm/StylesSecondairesForm.jsx';
import style from './ProfilFormPage.module.css';
import {
  saveInstrumentPrincipal,
  saveInstrumentsSecondaires,
  saveNiveau,
  saveDisponibilite,
  saveLocations,
  saveStylePrincipal,
  saveStylesSecondaires,
} from '../api/musicianApi.js';

export default function ProfilFormPage() {
  const { token } = useAuth();   // on récupère le token pour vérifier la connexion
  const navigate  = useNavigate(); // hook pour naviguer vers une autre page


  // ─── États pour les dépendances entre formulaires ─────────────────────
  // Ces deux valeurs sont partagées entre formulaires :
  // - instrumentPrincipalId est passé à InstrumentsSecondairesForm
  //   pour qu'il exclue l'instrument principal de sa liste
  // - stylePrincipalId est passé à StylesSecondairesForm
  //   pour la même raison
  const [instrumentPrincipalId, setInstrumentPrincipalId] = useState(null);
  const [stylePrincipalId, setStylePrincipalId] = useState(null);


  // ─── Protection de la route ───────────────────────────────────────────
  // Si l'utilisateur n'est pas connecté (pas de token), on le redirige
  // vers la page de connexion avant de rendre quoi que ce soit.
  // return null empêche le rendu du reste du composant.
  if (!token) {
    navigate('/connexion');
    return null;
  }


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


  return (
    <div className={style.container}>
      <h2>Mon profil</h2>

      {/* Chaque sous-formulaire reçoit son handler via la prop onSave.
          Quand l'utilisateur clique Valider dans un sous-formulaire,
          celui-ci appelle onSave(valeurSelectionnee) — ce qui exécute
          le handler correspondant ici dans ProfilFormPage. */}

      <InstrumentPrincipalForm
        onSave={handleInstrumentPrincipal}
      />

      {/* instrumentPrincipalId est passé en prop pour que ce formulaire
          puisse exclure l'instrument principal de ses options */}
      <InstrumentsSecondairesForm
        onSave={handleInstrumentsSecondaires}
        instrumentPrincipalId={instrumentPrincipalId}
      />

      <NiveauForm
        onSave={handleNiveau}
      />

      <LocalisationForm
        onSave={handleLocalisation}
      />

      <DisponibiliteForm
        onSave={handleDisponibilite}
      />

      <StylePrincipalForm
        onSave={handleStylePrincipal}
      />

      {/* stylePrincipalId est passé en prop pour la même raison */}
      <StylesSecondairesForm
        onSave={handleStylesSecondaires}
        stylePrincipalId={stylePrincipalId}
      />

    </div>
  );
}