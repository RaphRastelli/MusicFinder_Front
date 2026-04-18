import { useState } from 'react';
import { INSTRUMENTS } from '../../data/referentiels.js';
import Toast from '../Toast/Toast.jsx';
import style from './ProfilForm.module.css';

export default function InstrumentsSecondairesForm({ onSave, instrumentPrincipalId, initialValues }) {
  const [selected, setSelected] = useState(initialValues ?? []);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        // Déjà sélectionné → on le retire
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 3) {
        // Déjà 3 sélectionnés → on bloque et on avertit
        setToast({ message: 'Vous devez choisir max. 3 instruments !', type: 'error' });
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(selected);
      const message = selected.length === 0
        ? 'Pas d\'instrument secondaire enregistré'
        : 'Instrument(s) secondaire(s) enregistré(s)';
      setToast({ message, type: 'success' });
    } catch {
      setToast({ message: 'Une erreur est survenue.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // On exclut l'instrument principal de la liste des secondaires
  const instrumentsFiltres = INSTRUMENTS.filter(
    (inst) => inst.id !== instrumentPrincipalId
  );

  return (
    <section className={style.section}>
      <h3>Instrument(s) secondaire(s) <small>(facultatif — max. 3)</small></h3>

      <form onSubmit={handleSubmit}>
        <div className={style.optionList}>
          {instrumentsFiltres.map((inst) => (
            <label key={inst.id} className={style.option}>
              <input
                type="checkbox"
                value={inst.id}
                checked={selected.includes(inst.id)}
                onChange={() => handleChange(inst.id)}
              />
              {inst.label}
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