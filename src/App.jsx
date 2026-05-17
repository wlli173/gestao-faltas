import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/dashboard';
import RelatorioFaltas from './components/Relatorios/RelatorioFaltas';
import GestaoAlunos from './components/Alunos/GestaoAlunos';
import './App.css';

const PlaceholderView = ({ icon: Icon, title, description }) => (
  <div className="placeholder-view page-enter">
    <div className="placeholder-icon">
      <Icon size={28} />
    </div>
    <h2>{title}</h2>
    <p>{description}</p>
    <span className="placeholder-badge">Em desenvolvimento</span>
  </div>
);

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'relatorios':
        return <RelatorioFaltas />;
      case 'alunos':
        return <GestaoAlunos />;
      case 'configuracoes':
        return (
          <PlaceholderView
            icon={Settings}
            title="Configurações"
            description="Parâmetros do curso, limites de faltas e preferências do sistema serão configuráveis aqui."
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Header
          activeView={activeView}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="content-area">{renderContent()}</main>
      </div>
    </div>
  );
}

export default App;
