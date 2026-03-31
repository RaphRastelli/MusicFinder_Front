import { useState } from 'react';
import { INSTRUMENTS } from '../../data/referentiels.js';
import Toast from '../Toast/Toast.jsx';
import style from './ProfilForm.module.css';

// ─── PROPS ────────────────────────────────────────────────────────────────
// onSave : fonction reçue depuis ProfilFormPage.
// Ce composant ne sait PAS ce que fait onSave — il délègue.
// Ça permet de garder la logique API dans ProfilFormPage
// et de réutiliser ce composant si besoin.
export default function InstrumentPrincipalForm({ onSave }) {

  // selected : l'id de l'instrument choisi (null = rien sélectionné)
  // On stocke l'id (un nombre) et non le label (le texte)
  // car c'est l'id qu'on envoie au backend
  const [selected, setSelected] = useState(null);

  // toast : objet { message, type } ou null si aucun toast à afficher
  // type peut être 'success', 'error' ou 'info'
  const [toast,    setToast]    = useState(null);

  // loading : true pendant l'appel API pour désactiver le bouton
  // et éviter les doubles soumissions
  const [loading,  setLoading]  = useState(false);


  // ── Soumission du formulaire ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    // e.preventDefault() empêche le comportement par défaut du navigateur
    // qui rechargerait la page à la soumission d'un formulaire HTML
    e.preventDefault();

    // ── Validation AVANT l'appel API ─────────────────────────────────
    // Si rien n'est sélectionné, on affiche un toast d'erreur
    // et on sort de la fonction — pas d'appel API inutile
    if (selected === null) {
      setToast({ message: 'Vous devez choisir un instrument !', type: 'error' });
      return; // <- sortie anticipée, la suite ne s'exécute pas
    }

    setLoading(true); // désactive le bouton pendant l'appel

    try {
      // On délègue l'appel API au parent (ProfilFormPage)
      // via la prop onSave — ce composant ne connaît pas l'URL de l'API
      await onSave(selected);

      // Si onSave ne lève pas d'exception → succès
      setToast({ message: 'Votre instrument principal est enregistré', type: 'success' });

    } catch {
      // Si onSave lève une exception (erreur réseau, erreur serveur...)
      // le catch l'intercepte et affiche un toast d'erreur générique
      setToast({ message: 'Une erreur est survenue.', type: 'error' });

    } finally {
      // finally s'exécute TOUJOURS — succès ou erreur
      // On réactive le bouton dans tous les cas
      setLoading(false);
    }
  };


  return (
    <section className={style.section}>
      <h3>Mon instrument principal</h3>

      <form onSubmit={handleSubmit}>
        <div className={style.optionList}>

          {/* On parcourt le tableau INSTRUMENTS avec .map()
              Chaque instrument devient un <label> avec un <input type="radio">
              key={inst.id} est obligatoire pour que React puisse identifier
              chaque élément de la liste de manière unique */}
          {INSTRUMENTS.map((inst) => (
            <label key={inst.id} className={style.option}>
              <input
                type="radio"
                name="instrumentPrincipal" // tous les radios du même name forment un groupe
                value={inst.id}
                // checked compare l'id stocké dans selected avec l'id de cet input
                // Si égaux → cet input est coché
                checked={selected === inst.id}
                // onChange met à jour selected avec l'id de l'instrument cliqué
                onChange={() => setSelected(inst.id)}
              />
              {inst.label}
            </label>
          ))}

        </div>

        {/* disabled={loading} grise le bouton pendant l'appel API */}
        <button type="submit" disabled={loading} className={style.btn}>
          {/* Affichage conditionnel du texte selon l'état loading */}
          {loading ? 'Enregistrement...' : 'Valider'}
        </button>
      </form>

      {/* Affichage conditionnel du Toast :
          Si toast est null → rien n'est rendu
          Si toast contient un objet → le composant Toast s'affiche
          onClose remet toast à null → le Toast disparaît */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}