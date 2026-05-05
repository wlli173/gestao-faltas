import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import RelatorioFaltas from './components/Relatorios/RelatorioFaltas';
import './App.css';

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
        return (
          <div className="placeholder-view">
            <h2>👥 Gestão de Alunos</h2>
            <p>Em desenvolvimento...</p>
          </div>
        );
      case 'configuracoes':
        return (
          <div className="placeholder-view">
            <h2>⚙️ Configurações</h2>
            <p>Em desenvolvimento...</p>
          </div>
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
        <main className="content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;