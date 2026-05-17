import React from 'react';
import { ClipboardList } from 'lucide-react';
import { formatarData } from '../../utils/formatters';
import './Common.css';

const TabelaFaltas = ({ dados }) => {
  const registros = dados.slice(0, 10);

  return (
    <div className="table-card">
      <div className="table-card-header">
        <div className="table-card-title">
          <ClipboardList size={20} className="chart-card-icon" />
          <div>
            <h3>Registros Recentes</h3>
            <p className="chart-card-subtitle">Últimas ocorrências no período</p>
          </div>
        </div>
        <span className="registros-count">{dados.length} registro(s)</span>
      </div>

      <div className="table-card-body">
        {registros.length === 0 ? (
          <div className="chart-empty">
            <p>Nenhum registro de falta para exibir.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Aluno</th>
                <th>Matéria</th>
                <th>Aulas</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => (
                <tr key={registro.id}>
                  <td>{formatarData(registro.data)}</td>
                  <td>
                    <div className="aluno-cell">
                      <span className="aluno-avatar-sm">
                        {registro.alunoNome.charAt(0)}
                      </span>
                      <span>{registro.alunoNome}</span>
                    </div>
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TabelaFaltas;
