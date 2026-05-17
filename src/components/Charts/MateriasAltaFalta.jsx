import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const MateriasAltaFalta = ({ dados }) => {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <AlertTriangle size={20} className="chart-card-icon" />
        <div>
          <h3>Matérias em Alerta</h3>
          <p className="chart-card-subtitle">Acima de 70% do limite de faltas</p>
        </div>
      </div>

      {dados.length === 0 ? (
        <div className="chart-success">
          <CheckCircle2 size={20} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Nenhuma matéria em estado crítico no período.
        </div>
      ) : (
        <div className="materias-lista">
          {dados.map((materia) => (
            <div key={materia.id} className="materia-item critico">
              <div className="materia-info">
                <h4>{materia.nome}</h4>
                <div className="materia-meta">
                  <span className="materia-codigo-tag">{materia.codigo}</span>
                  <span className="materia-professor">{materia.professor}</span>
                </div>
              </div>
              <div className="materia-metricas">
                <div className="progress-bar">
                  <div
                    className="progress-fill danger"
                    style={{ width: `${Math.min(materia.percentualLimite, 100)}%` }}
                  />
                </div>
                <span className="metricas-texto">
                  {materia.totalFaltas} de {materia.limiteFaltas} faltas (
                  {materia.percentualLimite}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MateriasAltaFalta;
