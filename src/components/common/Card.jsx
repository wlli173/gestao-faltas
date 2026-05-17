import React from 'react';
import './Common.css';

const Card = ({ titulo, valor, icone, cor, tendencia, subtexto }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-icon" style={{ background: `${cor}14`, color: cor }}>
          {icone}
        </div>
        {tendencia && (
          <div className={`tendencia-badge ${tendencia.tipo}`}>
            {tendencia.tipo === 'up' ? '↑' : '↓'} {tendencia.valor}%
          </div>
        )}
      </div>
      <div className="stat-card-body">
        <p className="stat-label">{titulo}</p>
        <h3 className="stat-value">{valor}</h3>
        {subtexto && <p className="stat-subtext">{subtexto}</p>}
      </div>
    </div>
  );
};

export default Card;
