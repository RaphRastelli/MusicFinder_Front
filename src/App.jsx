import { Routes, Route } from 'react-router-dom';
import Header from './UI/Header/Header.jsx';
import NavBar from './UI/NavBar/NavBar.jsx';
import ProtectedRoute from './guards/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import InscriptionPage from './pages/InscriptionPage.jsx';
import ConnexionPage from './pages/ConnexionPage.jsx';
import ProfilFormPage from './pages/ProfilFormPage.jsx';
import SearchPage  from './pages/SearchPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';

function App() {
  return (
    <>
      <Header />
      <NavBar />
      <main>
        <Routes>
          {/* Routes publiques — accessibles à tous */}
          <Route path="/"            element={<HomePage />} />
          <Route path="/inscription" element={<InscriptionPage />} />
          <Route path="/connexion"   element={<ConnexionPage />} />
          <Route path="/recherche" element={<SearchPage />} />
          <Route path="/resultats" element={<ResultsPage />} />
          <Route path="/musicien/:id" element={<div>Profil public — à créer</div>} />

          {/* Route protégée — nécessite d'être connecté */}
          <Route path="/profil" element={
            <ProtectedRoute>
              <ProfilFormPage />
            </ProtectedRoute>
          } />

        </Routes>
      </main>
    </>
  );
}

export default App;