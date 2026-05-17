import React from 'react';
import { CalendarRange, AlertCircle } from 'lucide-react';
import { getDiaMaisCritico } from '../../utils/analytics';

const FaltasPorDia = ({ dados, subtitulo }) => {
  const diaCritico = getDiaMaisCritico(dados);
  const maxFaltas = Math.max(...dados.map((d) => d.total), 1);

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <CalendarRange size={20} className="chart-card-icon" />
        <div>
          <h3>Faltas por Dia da Semana</h3>
          <p className="chart-card-subtitle">
            {subtitulo || 'Distribuição semanal das ocorrências'}
          </p>
        </div>
      </div>

      <div className="dias-chart">
        {dados.map((item, index) => (
          <div key={index} className="dia-item">
            <span className="dia-label">{item.dia.slice(0, 3)}</span>
            <div className="bar-chart">
              <div
                className={`bar-fill ${item.dia === diaCritico.dia ? 'danger' : 'normal'}`}
                style={{
                  height: maxFaltas > 0 ? `${(item.total / maxFaltas) * 100}%` : '0%',
                }}
              >
                {item.total > 0 && <span className="bar-value">{item.total}</span>}
              </div>
            </div>
            <span className="dia-percentual">{item.percentual}%</span>
          </div>
        ))}
      </div>

      {diaCritico.total > 0 && (
        <div className="alerta-dia-critico">
          <AlertCircle size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          <strong>{diaCritico.dia}</strong> concentra o maior volume de faltas (
          {diaCritico.total} aulas — {diaCritico.percentual}% do total)
        </div>
      )}
    </div>
  );
};

export default FaltasPorDia;
