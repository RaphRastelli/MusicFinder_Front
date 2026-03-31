import { useState } from 'react';
import { MUSIC_STYLES } from '../../data/referentiels.js';
import Toast from '../Toast/Toast.jsx';
import style from './ProfilForm.module.css';

export default function StylesSecondairesForm({ onSave, stylePrincipalId }) {
  const [selected, setSelected] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading,  setLoading] = useState(false);

  const handleChange = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(selected);
      const message = selected.length === 0
        ? 'Pas de style secondaire enregistré'
        : 'Style(s) secondaire(s) enregistré(s)';
      setToast({ message, type: 'success' });
    } catch {
      setToast({ message: 'Une erreur est survenue.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // On exclut le style principal de la liste des secondaires
  const stylesFiltres = MUSIC_STYLES.filter(
    (s) => s.id !== stylePrincipalId
  );

  return (
    <section className={style.section}>
      <h3>Style(s) secondaire(s) <small>(facultatif)</small></h3>

      <form onSubmit={handleSubmit}>
        <div className={style.optionList}>
          {stylesFiltres.map((s) => (
            <label key={s.id} className={style.option}>
              <input
                type="checkbox"
                value={s.id}
                checked={selected.includes(s.id)}
                onChange={() => handleChange(s.id)}
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