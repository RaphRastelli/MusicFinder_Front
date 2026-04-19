import { useState } from 'react';
import { ABILITY_LEVELS } from '../../data/referentiels.js';
import Toast from '../Toast/Toast.jsx';
import style from './ProfilForm.module.css';

export default function NiveauForm({ onSave, initialValues }) {
  const [selected, setSelected] = useState(initialValues ?? null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selected === null) {
      setToast({ message: 'Vous devez choisir un niveau !', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await onSave(selected);
      setToast({ message: 'Votre niveau est enregistré', type: 'success' });
    } catch {
      setToast({ message: 'Une erreur est survenue.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={style.section}>
      <h3>Mon niveau</h3>

      <form onSubmit={handleSubmit}>
        <div className={style.optionList}>
          {ABILITY_LEVELS.map((level) => (
            <label key={level.id} className={style.option}>
              <input
                type="radio"
                name="niveau"
                value={level.id}
                checked={selected === level.id}
                onChange={() => setSelected(level.id)}
              />
              {level.label}
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