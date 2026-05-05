// src/components/Charts/FaltasPorDia.jsx
import React from 'react';
import { getDiaMaisCritico } from '../../utils/analytics';

const FaltasPorDia = ({ dados }) => {
  const diaCritico = getDiaMaisCritico(dados);
  const maxFaltas = Math.max(...dados.map(d => d.total));

  return (
    <div className="chart-container">
      <h2>📅 Faltas por Dia da Semana</h2>
      <div className="dias-chart">
        {dados.map((item, index) => (
          <div key={index} className="dia-item">
            <div className="dia-label">{item.dia}</div>
            <div className="bar-chart">
              <div
                className={`bar-fill ${item.dia === diaCritico.dia ? 'danger' : 'normal'}`}
                style={{
                  height: maxFaltas > 0 ? `${(item.total / maxFaltas) * 100}%` : '0%'
                }}
              >
                {item.total > 0 && (
                  <span className="bar-value">{item.total}</span>
                )}
              </div>
            </div>
            <div className="dia-percentual">{item.percentual}%</div>
          </div>
        ))}
      </div>
      {diaCritico.total > 0 && (
        <div className="alerta-dia-critico">
          ⚠️ <strong>{diaCritico.dia}</strong> é o dia com maior número de faltas 
          ({diaCritico.total} faltas - {diaCritico.percentual}% do total)
        </div>
      )}
    </div>
  );
};