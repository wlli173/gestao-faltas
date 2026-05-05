// src/components/Charts/VisaoGeral.jsx
import React from 'react';
import Card from '../common/Card';

const VisaoGeral = ({ metricas }) => {
  const cards = [
    {
      titulo: 'Total de Faltas',
      valor: metricas.totalFaltas,
      icone: '📊',
      cor: '#3b82f6'
    },
    {
      titulo: 'Alunos com Faltas',
      valor: `${metricas.alunosComFaltas}/${metricas.totalAlunos}`,
      icone: '👥', 
      cor: '#ef4444'
    },
    {
      titulo: 'Média por Aluno',
      valor: metricas.mediaFaltasPorAluno,
      icone: '📈',
      cor: '#10b981'
    },
    {
      titulo: 'Dias com Ocorrências',
      valor: metricas.diasComFalta,
      icone: '📅',
      cor: '#f59e0b'
    }
  ];

  return (
    <div className="visao-geral">
      <h2>Visão Geral do Período</h2>
      <div className="cards-grid">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};