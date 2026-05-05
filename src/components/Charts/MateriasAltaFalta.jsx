// src/components/Charts/MateriasAltaFalta.jsx
import React from 'react';

const MateriasAltaFalta = ({ dados }) => {
  if (dados.length === 0) {
    return (
      <div className="chart-container">
        <h2>📚 Matérias com Alto Índice de Falta</h2>
        <div className="alert-success">
          Nenhuma matéria em estado crítico! 🎉
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h2>📚 Matérias com Alto Índice de Falta</h2>
      <div className="materias-lista">
        {dados.map(materia => (
          <div key={materia.id} className="materia-item critico">
            <div className="materia-info">
              <h3>{materia.nome}</h3>
              <span className="materia-codigo">{materia.codigo}</span>
              <span className="materia-professor">{materia.professor}</span>
            </div>
            <div className="materia-metricas">
              <div className="progress-bar">
                <div 
                  className="progress-fill danger"
                  style={{ width: `${materia.percentualLimite}%` }}
                />
              </div>
              <span className="metricas-texto">
                {materia.totalFaltas} de {materia.limiteFaltas} faltas ({materia.percentualLimite}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};