import React from 'react';
import { BarChart3, Users, TrendingUp, CalendarDays } from 'lucide-react';
import Card from '../common/Card';

const VisaoGeral = ({ metricas }) => {
  const cards = [
    {
      titulo: 'Total de Faltas',
      valor: metricas.totalFaltas,
      icone: <BarChart3 size={22} />,
      cor: '#4f46e5',
    },
    {
      titulo: 'Alunos com Faltas',
      valor: `${metricas.alunosComFaltas}/${metricas.totalAlunos}`,
      icone: <Users size={22} />,
      cor: '#dc2626',
      subtexto: 'alunos com ocorrências',
    },
    {
      titulo: 'Média por Aluno',
      valor: metricas.mediaFaltasPorAluno,
      icone: <TrendingUp size={22} />,
      cor: '#059669',
      subtexto: 'aulas por aluno',
    },
    {
      titulo: 'Dias com Ocorrências',
      valor: metricas.diasComFalta,
      icone: <CalendarDays size={22} />,
      cor: '#d97706',
    },
  ];

  return (
    <section className="visao-geral">
      <div className="visao-geral-header">
        <h2>Indicadores do período</h2>
      </div>
      <div className="cards-grid">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </section>
  );
};

export default VisaoGeral;
