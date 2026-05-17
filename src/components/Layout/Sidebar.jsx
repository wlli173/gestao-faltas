import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import './Layout.css';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
  { id: 'alunos', label: 'Alunos', icon: Users },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

const Sidebar = ({ activeView, setActiveView, collapsed, setCollapsed }) => {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed ? (
          <div className="logo-container">
            <div className="logo-icon-wrap">
              <GraduationCap size={22} />
            </div>
            <div className="logo-text">
              <h1 className="logo-title">GestFaltas</h1>
              <span className="logo-subtitle">Coordenação de Curso</span>
            </div>
          </div>
        ) : (
          <div className="logo-icon-wrap" style={{ margin: '0 auto' }}>
            <GraduationCap size={22} />
          </div>
        )}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Menu principal">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <button
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveView(item.id)}
                  title={collapsed ? item.label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && <span className="active-indicator" />}
                  <Icon size={20} className="nav-icon" />
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <span className="version-badge">v1.0.0</span>
          <p className="footer-text">Protótipo de demonstração</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
