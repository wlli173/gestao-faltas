import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BookOpen } from 'lucide-react';

const getBarColor = (entry) => {
  if (entry.faltas === 0) return 'var(--gray-200)';
  return entry.critico ? 'var(--danger)' : 'var(--primary)';
};

const FaltasAlunoMaterias = ({ dados, alunoNome }) => {
  const chartData = dados.map((m) => ({
    nome: m.codigo,
    nomeCompleto: m.nome,
    faltas: m.totalFaltas,
    limite: m.limiteFaltas,
    critico: m.status === 'critico',
  }));

  const temFaltas = chartData.some((d) => d.faltas > 0);

  if (!temFaltas) {
    return (
      <div className="chart-card">
        <div className="chart-card-header">
          <BookOpen size={20} className="chart-card-icon" />
          <div>
            <h3>Faltas por Matéria</h3>
            <p className="chart-card-subtitle">Disciplinas do período — {alunoNome}</p>
          </div>
        </div>
        <div className="chart-empty">
          <p>Nenhuma falta registrada para este aluno no período.</p>
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
          <p className="chart-card-subtitle">Aulas perdidas por disciplina — {alunoNome}</p>
        </div>
      </div>
      <div className="chart-body">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" vertical={false} />
            <XAxis
              dataKey="nome"
              tick={{ fontSize: 12, fill: 'var(--gray-500)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
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
              formatter={(value, _name, props) => [
                `${value} de ${props.payload.limite} aula(s)`,
                props.payload.nomeCompleto,
              ]}
            />
            <Bar dataKey="faltas" radius={[6, 6, 0, 0]} maxBarSize={52}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`${entry.nome}-${index}`}
                  fill={getBarColor(entry)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FaltasAlunoMaterias;
