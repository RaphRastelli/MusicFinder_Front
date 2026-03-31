import { useEffect } from 'react';
import style from './Toast.module.css';

// ─── PROPS ────────────────────────────────────────────────────────────────
// message : le texte à afficher
// type    : 'success' | 'error' | 'info' — détermine la couleur
// onClose : fonction appelée quand le toast doit disparaître
//           c'est le parent qui décide quoi faire (en général : setToast(null))
export default function Toast({ message, type = 'success', onClose }) {

  // ─── useEffect ────────────────────────────────────────────────────────
  // useEffect exécute du code après le rendu du composant.
  // Ici on crée un timer qui appellera onClose après 3 secondes.
  //
  // Le tableau de dépendances [onClose] signifie :
  // "ré-exécute cet effet si onClose change"
  //
  // La fonction retournée (return () => clearTimeout) est le "cleanup" :
  // elle s'exécute quand le composant est démonté (retiré du DOM)
  // pour éviter d'appeler onClose sur un composant qui n'existe plus
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // 3000ms = 3 secondes
    return () => clearTimeout(timer);        // nettoyage si le composant disparaît avant
  }, [onClose]);


  // ─── Les classes CSS ──────────────────────────────────────────────────
  // style.toast donne le style de base
  // style[type] ajoute la classe correspondant au type :
  //   type='success' → ajoute la classe .success (fond vert)
  //   type='error'   → ajoute la classe .error (fond rouge)
  //   type='info'    → ajoute la classe .info (fond bleu)
  return (
    <div className={`${style.toast} ${style[type]}`}>
      {message}
    </div>
  );
}