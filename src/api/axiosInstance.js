import axios from 'axios';

// ─── 1. CRÉATION DE L'INSTANCE ────────────────────────────────────────────
// Plutôt que d'utiliser axios directement avec l'URL complète à chaque fois,
// on crée une instance pré-configurée.
// Tous les appels faits via axiosInstance utiliseront automatiquement
// cette baseURL — vous n'écrivez plus que le chemin relatif.
// Exemple : axiosInstance.post('/api/auth/login') au lieu de 
// axios.post('https://localhost:7274/api/auth/login')
const axiosInstance = axios.create({
  baseURL: 'https://localhost:7274',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── 2. L'INTERCEPTEUR DE REQUÊTE ─────────────────────────────────────────
// Un intercepteur est une fonction qui s'exécute automatiquement
// AVANT chaque requête envoyée via axiosInstance.
// C'est le même principe qu'un middleware en ASP.NET Core.
//
// Ici on lit le token dans localStorage et on l'ajoute dans le header
// Authorization de chaque requête — sans avoir à le faire manuellement
// dans chaque appel API.
//
// Le backend lit ce header pour savoir qui fait la requête et vérifier
// que le token est valide avant d'autoriser l'accès.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;