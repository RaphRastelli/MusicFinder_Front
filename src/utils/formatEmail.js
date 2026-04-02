// Remplace '@' par '(a)' pour masquer l'e-mail des robots de spam
// Exemple : bombom200@yopmail.com → bombom200(a)yopmail.com
export function formatEmail(email) {
  if (!email) return '';
  return email.replace('@', '(a)');
}