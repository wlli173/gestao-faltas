import React from 'react';
import { Bell, User, Search, Menu, Calendar } from 'lucide-react';
import './Layout.css';

const viewTitles = {
  dashboard: 'Dashboard',
  relatorios: 'Relatórios de Faltas',
  alunos: 'Gestão de Alunos',
  configuracoes: 'Configurações',
};

const Header = ({ activeView, toggleSidebar }) => {
  const title = viewTitles[activeView] || 'Dashboard';
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="menu-toggle"
          onClick={toggleSidebar}
          aria-label="Alternar menu"
        >
          <Menu size={22} />
        </button>
        <div className="header-title">
          <h2>{title}</h2>
          <div className="header-breadcrumb">
            <span>Coordenação</span>
            <span className="breadcrumb-separator">/</span>
            <span>{title}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="search-bar">
          <Search size={17} className="search-icon" />
          <input
            type="search"
            placeholder="Buscar aluno ou matéria..."
            className="search-input"
            aria-label="Buscar"
          />
        </div>

        <div className="header-actions">
          <button className="action-btn" title={today} aria-label="Calendário acadêmico">
            <Calendar size={19} />
          </button>

          <button className="action-btn notification-btn" aria-label="3 notificações">
            <Bell size={19} />
            <span className="notification-badge">3</span>
          </button>

          <button className="user-btn" type="button">
            <div className="user-avatar">
              <User size={18} />
            </div>
            <div className="user-info">
              <span className="user-name">Coord. Carlos</span>
              <span className="user-role">Ciência da Computação</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
