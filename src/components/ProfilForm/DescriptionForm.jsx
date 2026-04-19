import { useState } from 'react';
import Toast from '../Toast/Toast.jsx';
import style from './ProfilForm.module.css';

const MAX_LENGTH = 5000;

export default function DescriptionForm({ onSave, initialValues }) {
  const [description, setDescription] = useState(initialValues ?? '');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(description.trim());
      setToast({ message: 'Votre présentation est enregistrée', type: 'success' });
    } catch {
      setToast({ message: 'Une erreur est survenue.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={style.section}>
      <h3>Présentation</h3>
      <p className={style.hint}>
        Quel est votre parcours, vos envies… Décrivez-vous librement et apportez des précisions à votre profil.
      </p>

      <form onSubmit={handleSubmit}>
        <div className={style.textareaWrapper}>
          <textarea
            className={style.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={MAX_LENGTH}
            rows={6}
            placeholder="Décrivez-vous librement..."
          />
          {/* Compteur de caractères */}
          <p className={style.counter}>
            {description.length} / {MAX_LENGTH} caractères
          </p>
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