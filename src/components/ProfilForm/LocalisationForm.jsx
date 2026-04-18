import { useState } from 'react';
import { LOCATIONS } from '../../data/referentiels.js';
import Toast from '../Toast/Toast.jsx';
import style from './ProfilForm.module.css';

export default function LocalisationForm({ onSave, initialValue }) {
  const [selected, setSelected] = useState(initialValue ?? []);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selected.length === 0) {
      setToast({ message: 'Vous devez choisir au moins une localisation !', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await onSave(selected);
      setToast({ message: 'Localisation(s) enregistrée(s)', type: 'success' });
    } catch {
      setToast({ message: 'Une erreur est survenue.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={style.section}>
      <h3>Vous pouvez vous déplacer <small>(min. 1 choix)</small></h3>

      <form onSubmit={handleSubmit}>
        <div className={style.optionList}>
          {LOCATIONS.map((loc) => (
            <label key={loc.id} className={style.option}>
              <input
                type="checkbox"
                value={loc.id}
                checked={selected.includes(loc.id)}
                onChange={() => handleChange(loc.id)}
              />
              {loc.label}
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