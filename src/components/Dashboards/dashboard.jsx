// src/components/Dashboard/Dashboard.jsx
import React, { useState, useMemo } from 'react';
import VisaoGeral from '../Charts/VisaoGeral';
import FaltasPorPeriodo from '../Charts/FaltasPorPeriodo';
import MateriasAltaFalta from '../Charts/MateriasAltaFalta';
import FaltasPorDia from '../Charts/FaltasPorDia';
import data from '../../data/faltas.json';
import { calcularMetricas } from '../../utils/analytics';
import './Dashboard.css';

const Dashboard = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('2024.1');
  
  const metricas = useMemo(() => 
    calcularMetricas(data, periodoSelecionado), 
    [periodoSelecionado]
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Gestão de Faltas - Coordenação</h1>
        <select 
          value={periodoSelecionado}
          onChange={(e) => setPeriodoSelecionado(e.target.value)}
          className="periodo-selector"
        >
          {data.periodos.map(periodo => (
            <option key={periodo.id} value={periodo.id}>
              {periodo.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="dashboard-grid">
        <VisaoGeral metricas={metricas.geral} />
        <FaltasPorPeriodo 
          dados={metricas.porPeriodo} 
          periodo={periodoSelecionado}
        />
        <MateriasAltaFalta dados={metricas.materiasCriticas} />
        <FaltasPorDia dados={metricas.porDiaSemana} />
      </div>
    </div>
  );
};

export default Dashboard;