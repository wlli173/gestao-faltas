import React, { useState, useMemo } from 'react';
import VisaoGeral from '../Charts/VisaoGeral';
import FaltasPorPeriodo from '../Charts/FaltasPorPeriodo';
import MateriasAltaFalta from '../Charts/MateriasAltaFalta';
import FaltasPorDia from '../Charts/FaltasPorDia';
import TabelaFaltas from '../common/TabelaFaltas';
import data from '../../data/faltas.json';
import { calcularMetricas } from '../../utils/analytics';
import { formatarData, formatarPercentual } from '../../utils/formatters';
import './Dashboard.css';

const Dashboard = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('2024.1');
  const [filtroMateria, setFiltroMateria] = useState('todas');
  
  const metricas = useMemo(() => 
    calcularMetricas(data, periodoSelecionado, filtroMateria), 
    [periodoSelecionado, filtroMateria]
  );

  const materiasOptions = [
    { value: 'todas', label: 'Todas as Matérias' },
    ...data.materias.map(m => ({
      value: m.id,
      label: `${m.codigo} - ${m.nome}`
    }))
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-info">
          <h1>Dashboard de Faltas</h1>
          <p className="header-description">
            Visão geral das faltas no período selecionado
          </p>
        </div>
        <div className="header-controls">
          <div className="control-group">
            <label>Período</label>
            <select 
              value={periodoSelecionado}
              onChange={(e) => setPeriodoSelecionado(e.target.value)}
              className="control-select"
            >
              {data.periodos.map(periodo => (
                <option key={periodo.id} value={periodo.id}>
                  {periodo.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="control-group">
            <label>Matéria</label>
            <select 
              value={filtroMateria}
              onChange={(e) => setFiltroMateria(e.target.value)}
              className="control-select"
            >
              {materiasOptions.map(opcao => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <VisaoGeral metricas={metricas.geral} />

      <div className="dashboard-grid">
        <FaltasPorPeriodo 
          dados={metricas.porPeriodo} 
          periodo={periodoSelecionado}
        />
        <MateriasAltaFalta dados={metricas.materiasCriticas} />
      </div>

      <div className="dashboard-grid-full">
        <FaltasPorDia dados={metricas.porDiaSemana} />
      </div>

      <div className="dashboard-table">
        <TabelaFaltas 
          dados={metricas.registros}
          materias={data.materias}
          alunos={data.alunos}
        />
      </div>
    </div>
  );
};

export default Dashboard;