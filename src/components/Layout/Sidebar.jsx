import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap
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
        {!collapsed && (
          <div className="logo-container fade-in">
            <GraduationCap size={32} className="logo-icon" />
            <div className="logo-text">
              <h1 className="logo-title">GestFaltas</h1>
              <span className="logo-subtitle">Coordenação</span>
            </div>
          </div>
        )}
        <button 
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <button
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveView(item.id)}
                  title={collapsed ? item.label : ''}
                >
                  <Icon size={20} className="nav-icon" />
                  {!collapsed && (
                    <span className="nav-label">{item.label}</span>
                  )}
                  {isActive && !collapsed && (
                    <div className="active-indicator" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="sidebar-footer fade-in">
          <div className="footer-info">
            <div className="version-badge">v1.0.0</div>
            <p className="footer-text">Protótipo para Demonstração</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;