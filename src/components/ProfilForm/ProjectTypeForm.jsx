import { useState } from 'react';
import { PROJECT_TYPES } from '../../data/referentiels.js';
import Toast from '../Toast/Toast.jsx';
import style from './ProfilForm.module.css';

export default function ProjectTypeForm({ onSave, initialValue }) {
  const [selected, setSelected] = useState(initialValue ?? []);
  const [toast,    setToast]    = useState(null);
  const [loading,  setLoading]  = useState(false);

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
      setToast({
        message: 'Vous devez choisir au moins un type de projet !',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      await onSave(selected);
      setToast({ message: 'Type(s) de projet enregistré(s)', type: 'success' });
    } catch {
      setToast({ message: 'Une erreur est survenue.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={style.section}>
      <h3>Le type de projet recherché <small>(min. 1 choix)</small></h3>

      <form onSubmit={handleSubmit}>
        <div className={style.optionList}>
          {PROJECT_TYPES.map((pt) => (
            <label key={pt.id} className={style.option}>
              <input
                type="checkbox"
                value={pt.id}
                checked={selected.includes(pt.id)}
                onChange={() => handleChange(pt.id)}
              />
              {pt.label}
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