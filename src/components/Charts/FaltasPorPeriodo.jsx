import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BookOpen } from 'lucide-react';

const FaltasPorPeriodo = ({ dados }) => {
  const chartData = dados.map((m) => ({
    nome: m.codigo,
    faltas: m.totalFaltas,
    limite: m.limiteFaltas,
  }));

  if (chartData.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card-header">
          <BookOpen size={20} className="chart-card-icon" />
          <h3>Faltas por Matéria</h3>
        </div>
        <div className="chart-empty">
          <p>Nenhuma falta registrada no período selecionado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <BookOpen size={20} className="chart-card-icon" />
        <div>
          <h3>Faltas por Matéria</h3>
          <p className="chart-card-subtitle">Total de aulas perdidas por disciplina</p>
        </div>
      </div>
      <div className="chart-body">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" vertical={false} />
            <XAxis
              dataKey="nome"
              tick={{ fontSize: 12, fill: 'var(--gray-500)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--gray-500)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid var(--gray-200)',
                boxShadow: 'var(--shadow-md)',
                fontSize: '0.875rem',
              }}
              formatter={(value) => [`${value} aula(s)`, 'Faltas']}
            />
            <Bar dataKey="faltas" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FaltasPorPeriodo;
