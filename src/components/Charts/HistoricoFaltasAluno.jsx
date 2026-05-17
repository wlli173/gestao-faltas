import React, { useMemo } from 'react';
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
import { ClipboardList } from 'lucide-react';
import { formatarData } from '../../utils/formatters';
import '../common/Common.css';

const HistoricoFaltasAluno = ({ registros, alunoNome }) => {
  const resumo = useMemo(() => {
    const justificadas = registros.filter((r) => r.justificativa).length;
    const pendentes = registros.length - justificadas;
    const totalAulas = registros.reduce((sum, r) => sum + r.aulasFaltadas, 0);

    return { justificadas, pendentes, totalAulas };
  }, [registros]);

  const chartData = [
    { nome: 'Justificadas', valor: resumo.justificadas, cor: 'var(--success)' },
    { nome: 'Pendentes', valor: resumo.pendentes, cor: 'var(--warning)' },
  ];

  const temRegistros = registros.length > 0;

  return (
    <div className="historico-aluno chart-card historico-aluno-full">
      <div className="chart-card-header historico-aluno-header">
        <ClipboardList size={20} className="chart-card-icon" />
        <div className="historico-aluno-header-text">
          <h3>Histórico de Faltas</h3>
          <p className="chart-card-subtitle">
            Todas as ocorrências de {alunoNome} no período — matéria e justificativa
          </p>
        </div>
        {temRegistros && (
          <span className="registros-count">{registros.length} registro(s)</span>
        )}
      </div>

      {!temRegistros ? (
        <div className="chart-empty">
          <p>Nenhuma falta registrada para este aluno no período.</p>
        </div>
      ) : (
        <>
          <div className="historico-aluno-resumo">
            <div className="historico-aluno-stats">
              <div className="historico-stat">
                <span className="historico-stat-valor">{registros.length}</span>
                <span className="historico-stat-label">Registros</span>
              </div>
              <div className="historico-stat">
                <span className="historico-stat-valor">{resumo.totalAulas}</span>
                <span className="historico-stat-label">Aulas perdidas</span>
              </div>
              <div className="historico-stat historico-stat-success">
                <span className="historico-stat-valor">{resumo.justificadas}</span>
                <span className="historico-stat-label">Justificadas</span>
              </div>
              <div className="historico-stat historico-stat-warning">
                <span className="historico-stat-valor">{resumo.pendentes}</span>
                <span className="historico-stat-label">Pendentes</span>
              </div>
            </div>

            <div className="historico-aluno-chart-mini">
              <p className="historico-chart-label">Por status de justificativa</p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis
                    type="category"
                    dataKey="nome"
                    width={90}
                    tick={{ fontSize: 12, fill: 'var(--gray-600)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid var(--gray-200)',
                      fontSize: '0.875rem',
                    }}
                    formatter={(value) => [`${value} registro(s)`, 'Quantidade']}
                  />
                  <Bar dataKey="valor" radius={[0, 6, 6, 0]} maxBarSize={28}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.cor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="historico-aluno-tabela">
            <table className="data-table historico-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Matéria</th>
                  <th>Aulas</th>
                  <th>Status</th>
                  <th>Justificativa</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro) => (
                  <tr key={registro.id}>
                    <td className="historico-data">{formatarData(registro.data)}</td>
                    <td>
                      <span className="materia-tag">{registro.materiaCodigo}</span>
                      <span className="materia-nome-inline">{registro.materiaNome}</span>
                    </td>
                    <td>
                      <span className="aulas-badge">{registro.aulasFaltadas}</span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          registro.justificativa ? 'status-justificada' : 'status-pendente'
                        }`}
                      >
                        {registro.justificativa ? 'Justificada' : 'Pendente'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`historico-justificativa ${
                          registro.justificativa ? 'justificada' : 'pendente'
                        }`}
                        title={registro.justificativa || 'Sem justificativa informada'}
                      >
                        {registro.justificativa || 'Não justificada'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="historico-aluno-footer">
            <span>
              {resumo.justificadas} de {registros.length} registro(s) justificado(s)
            </span>
            <span>
              Total: <strong>{resumo.totalAulas}</strong> aula(s) perdida(s)
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default HistoricoFaltasAluno;
