import React from 'react';
import { Bell, User, Search, Menu, Calendar } from 'lucide-react';

const Header = ({ activeView, toggleSidebar }) => {
  const getTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Dashboard';
      case 'relatorios': return 'Relatórios de Faltas';
      case 'alunos': return 'Gestão de Alunos';
      case 'configuracoes': return 'Configurações';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="header-title">
          <h2>{getTitle()}</h2>
          <div className="header-breadcrumb">
            <span>Coordenação</span>
            <span className="breadcrumb-separator">/</span>
            <span>{getTitle()}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar aluno, matéria..." 
            className="search-input"
          />
        </div>

        <div className="header-actions">
          <button className="action-btn" title="Calendário Acadêmico">
            <Calendar size={20} />
          </button>
          
          <button className="action-btn notification-btn" title="Notificações">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          <div className="user-menu">
            <button className="user-btn">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <span className="user-name">Coord. Carlos</span>
                <span className="user-role">Coordenação CC</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;