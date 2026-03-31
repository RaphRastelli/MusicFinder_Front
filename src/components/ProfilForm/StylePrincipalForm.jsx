import { useState } from 'react';
import { MUSIC_STYLES } from '../../data/referentiels.js';
import Toast from '../Toast/Toast.jsx';
import style from './ProfilForm.module.css';

export default function StylePrincipalForm({ onSave }) {
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selected === null) {
      setToast({ message: 'Vous devez choisir un style !', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await onSave(selected);
      setToast({ message: 'Votre style principal est enregistré', type: 'success' });
    } catch {
      setToast({ message: 'Une erreur est survenue.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={style.section}>
      <h3>Style musical principal</h3>

      <form onSubmit={handleSubmit}>
        <div className={style.optionList}>
          {MUSIC_STYLES.map((s) => (
            <label key={s.id} className={style.option}>
              <input
                type="radio"
                name="stylePrincipal"
                value={s.id}
                checked={selected === s.id}
                onChange={() => setSelected(s.id)}
              />
              {s.label}
            </label>
          ))}
        </div>

        <button type="submit" disabled={loading} className={style.btn}>
          {loading ? 'Enregistrement...' : 'Valider'}
        </button>
      </form>

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