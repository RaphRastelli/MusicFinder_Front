import { Routes, Route } from 'react-router-dom';
import Header from './UI/Header/Header.jsx';
import NavBar from './UI/NavBar/NavBar.jsx';
import HomePage from './pages/HomePage.jsx';
import InscriptionPage from './pages/InscriptionPage.jsx';
import ConnexionPage from './pages/ConnexionPage.jsx';
import ProfilFormPage from './pages/ProfilFormPage.jsx';

function App() {
  return (
    <>
      <Header />
      <NavBar />
      <main>
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/inscription" element={<InscriptionPage />} />
          <Route path="/connexion"   element={<ConnexionPage />} />
          <Route path="/profil"      element={<ProfilFormPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;