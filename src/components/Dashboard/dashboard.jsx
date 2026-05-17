import React, { useState, useMemo } from 'react';
import VisaoGeral from '../Charts/VisaoGeral';
import FaltasPorPeriodo from '../Charts/FaltasPorPeriodo';
import MateriasAltaFalta from '../Charts/MateriasAltaFalta';
import FaltasPorDia from '../Charts/FaltasPorDia';
import TabelaFaltas from '../common/TabelaFaltas';
import data from '../../data/faltas.json';
import { calcularMetricas } from '../../utils/analytics';
import '../Charts/Charts.css';
import './Dashboard.css';

const Dashboard = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('2024.1');
  const [filtroMateria, setFiltroMateria] = useState('todas');

  const metricas = useMemo(
    () => calcularMetricas(data, periodoSelecionado, filtroMateria),
    [periodoSelecionado, filtroMateria]
  );

  const materiasOptions = [
    { value: 'todas', label: 'Todas as Matérias' },
    ...data.materias.map((m) => ({
      value: m.id,
      label: `${m.codigo} - ${m.nome}`,
    })),
  ];

  return (
    <div className="dashboard page-enter">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Dashboard de Faltas</h1>
          <p>Visão consolidada das ocorrências no período selecionado</p>
        </div>
        <div className="page-header-controls">
          <div className="control-group">
            <label htmlFor="periodo-select">Período</label>
            <select
              id="periodo-select"
              value={periodoSelecionado}
              onChange={(e) => setPeriodoSelecionado(e.target.value)}
              className="control-select"
            >
              {data.periodos.map((periodo) => (
                <option key={periodo.id} value={periodo.id}>
                  {periodo.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="control-group">
            <label htmlFor="materia-select">Matéria</label>
            <select
              id="materia-select"
              value={filtroMateria}
              onChange={(e) => setFiltroMateria(e.target.value)}
              className="control-select"
            >
              {materiasOptions.map((opcao) => (
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
        <FaltasPorPeriodo dados={metricas.porPeriodo} />
        <MateriasAltaFalta dados={metricas.materiasCriticas} />
      </div>

      <div className="dashboard-grid-full">
        <FaltasPorDia dados={metricas.porDiaSemana} />
      </div>

      <TabelaFaltas dados={metricas.registros} />
    </div>
  );
};

export default Dashboard;
