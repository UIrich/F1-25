import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas de autenticação
import Login from './pages/auth/Login';

// Páginas públicas principais
import Home from './pages/public/Home';
import Regulamento from './pages/public/Regulamento';
import NotFound from './pages/public/NotFound';
import Temporadas from './pages/public/Temporadas';

// Páginas de visualização
import VisualizacaoEquipe from './pages/public/VisualizacaoEquipe';
import VisualizacaoPiloto from './pages/public/VisualizacaoPiloto';
import VisualizacaoCorrida from './pages/public/VisualizacaoCorrida';
import VisualizacaoResultado from './pages/public/VisualizacaoResultado';
import VisualizacaoCampeao from './pages/public/VisualizacaoCampeao';
import VisualizacaoTemporada from './pages/public/VisualizacaoTemporada';

// Layout
import AdminLayout from './components/global/layout/AdminLayout';

// Páginas de administração
import Dashboard from './pages/admin/Dashboard';

// Componentes Admin
import AdminCampeoes from './components/app/admin/AdminCampeoes';
import AdminCorridas from './components/app/admin/AdminCorridas';
import AdminEquipes from './components/app/admin/AdminEquipes';
import AdminEquipesTemporadas from './components/app/admin/AdminEquipesTemporadas';
import AdminPilotos from './components/app/admin/AdminPilotos';
import AdminPilotosEquipesTemporadas from './components/app/admin/AdminPilotosEquipesTemporadas';
import AdminResultados from './components/app/admin/AdminResultados';
import AdminTemporadas from './components/app/admin/AdminTemporadas';
import AdminUsuarios from './components/app/admin/AdminUsuarios';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas principais */}
        <Route path="/" element={<Home />} />
        <Route path="/regulamento" element={<Regulamento />} />
        
        {/* Rotas de autenticação */}
        <Route path="/admin/login" element={<Login />} />

        {/* Rotas de temporadas */}
        <Route path="/temporadas" element={<Temporadas />} />
        <Route path="/temporadas/:id_temporada" element={<VisualizacaoTemporada />} />
        
        {/* Sub-rotas da temporada específica */}
        <Route path="/temporadas/:id_temporada/equipes" element={<VisualizacaoEquipe />} />
        <Route path="/temporadas/:id_temporada/pilotos" element={<VisualizacaoPiloto />} />
        <Route path="/temporadas/:id_temporada/corridas" element={<VisualizacaoCorrida />} />
        <Route path="/temporadas/:id_temporada/resultados" element={<VisualizacaoResultado />} />
        <Route path="/temporadas/:id_temporada/campeoes" element={<VisualizacaoCampeao />} />
        
        {/* Rotas administrativas */}
        <Route path="/admin" element={<AdminLayout />}>          
          <Route path="campeoes" element={<AdminCampeoes />} />
          <Route path="corridas" element={<AdminCorridas />} />
          <Route path="equipes" element={<AdminEquipes />} />
          <Route path="equipes-temporadas" element={<AdminEquipesTemporadas />} />
          <Route path="pilotos" element={<AdminPilotos />} />
          <Route path="pilotos-equipes" element={<AdminPilotosEquipesTemporadas />} />
          <Route path="resultados" element={<AdminResultados />} />
          <Route path="temporadas" element={<AdminTemporadas />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
        </Route>
        
        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;