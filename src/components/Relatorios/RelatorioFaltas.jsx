import React, { useState, useMemo } from 'react';
import { Download, Filter, Printer, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import data from '../../data/faltas.json';
import { calcularMetricas } from '../../utils/analytics';
import { formatarData, formatarPercentual } from '../../utils/formatters';
import './RelatorioFaltas.css';

const RelatorioFaltas = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('2024.1');
  const [tipoRelatorio, setTipoRelatorio] = useState('geral');
  const [filtrosAvancados, setFiltrosAvancados] = useState({
    materia: 'todas',
    statusFalta: 'todas',
    ordenarPor: 'data',
    ordem: 'desc'
  });

  const metricas = useMemo(() => 
    calcularMetricas(data, periodoSelecionado), 
    [periodoSelecionado]
  );

  // Preparar dados para a tabela
  const registrosFiltrados = useMemo(() => {
    let registros = [...data.registrosFalta].filter(
      r => r.periodoId === periodoSelecionado
    );

    // Filtrar por matéria
    if (filtrosAvancados.materia !== 'todas') {
      registros = registros.filter(
        r => r.materiaId === parseInt(filtrosAvancados.materia)
      );
    }

    // Filtrar por status (com/sem justificativa)
    if (filtrosAvancados.statusFalta === 'justificadas') {
      registros = registros.filter(r => r.justificativa);
    } else if (filtrosAvancados.statusFalta === 'naoJustificadas') {
      registros = registros.filter(r => !r.justificativa);
    }

    // Enriquecer dados
    registros = registros.map(registro => {
      const aluno = data.alunos.find(a => a.id === registro.alunoId);
      const materia = data.materias.find(m => m.id === registro.materiaId);
      return {
        ...registro,
        alunoNome: aluno?.nome || 'Aluno não encontrado',
        alunoMatricula: aluno?.matricula || 'N/A',
        materiaNome: materia?.nome || 'Matéria não encontrada',
        materiaCodigo: materia?.codigo || 'N/A',
        professor: materia?.professor || 'N/A'
      };
    });

    // Ordenar
    registros.sort((a, b) => {
      let comparacao = 0;
      switch (filtrosAvancados.ordenarPor) {
        case 'data':
          comparacao = new Date(a.data) - new Date(b.data);
          break;
        case 'aluno':
          comparacao = a.alunoNome.localeCompare(b.alunoNome);
          break;
        case 'materia':
          comparacao = a.materiaNome.localeCompare(b.materiaNome);
          break;
        case 'faltas':
          comparacao = a.aulasFaltadas - b.aulasFaltadas;
          break;
        default:
          comparacao = 0;
      }
      return filtrosAvancados.ordem === 'desc' ? -comparacao : comparacao;
    });

    return registros;
  }, [periodoSelecionado, filtrosAvancados]);

  // Estatísticas para o relatório
  const estatisticas = useMemo(() => {
    const total = registrosFiltrados.length;
    const justificadas = registrosFiltrados.filter(r => r.justificativa).length;
    const naoJustificadas = total - justificadas;
    const totalAulas = registrosFiltrados.reduce((sum, r) => sum + r.aulasFaltadas, 0);
    
    return {
      total,
      justificadas,
      naoJustificadas,
      totalAulas,
      percentualJustificadas: total > 0 ? (justificadas / total * 100).toFixed(1) : 0
    };
  }, [registrosFiltrados]);

  // Função para exportar relatório
  const exportarRelatorio = (formato) => {
    const dadosExportacao = {
      cabecalho: {
        titulo: 'Relatório de Faltas',
        periodo: data.periodos.find(p => p.id === periodoSelecionado)?.nome,
        dataGeracao: new Date().toLocaleString('pt-BR'),
        totalRegistros: registrosFiltrados.length
      },
      estatisticas,
      registros: registrosFiltrados
    };

    if (formato === 'json') {
      // Exportar como JSON
      const blob = new Blob(
        [JSON.stringify(dadosExportacao, null, 2)], 
        { type: 'application/json' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-faltas-${periodoSelecionado}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (formato === 'csv') {
      // Exportar como CSV
      const headers = ['Data', 'Aluno', 'Matrícula', 'Matéria', 'Código', 'Professor', 'Faltas', 'Justificativa'];
      const rows = registrosFiltrados.map(r => [
        formatarData(r.data),
        r.alunoNome,
        r.alunoMatricula,
        r.materiaNome,
        r.materiaCodigo,
        r.professor,
        r.aulasFaltadas,
        r.justificativa || 'Não justificada'
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-faltas-${periodoSelecionado}-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Função para imprimir
  const imprimirRelatorio = () => {
    window.print();
  };

  return (
    <div className="relatorio-faltas">
      {/* Cabeçalho do Relatório */}
      <div className="relatorio-header">
        <div className="relatorio-title-section">
          <h1>Relatórios de Faltas</h1>
          <p className="relatorio-subtitle">
            Gere relatórios detalhados sobre as faltas dos alunos
          </p>
        </div>
        
        <div className="relatorio-actions">
          <button 
            className="btn-action btn-export"
            onClick={() => exportarRelatorio('json')}
            title="Exportar como JSON"
          >
            <Download size={18} />
            <span>Exportar JSON</span>
          </button>
          <button 
            className="btn-action btn-export"
            onClick={() => exportarRelatorio('csv')}
            title="Exportar como CSV"
          >
            <FileText size={18} />
            <span>Exportar CSV</span>
          </button>
          <button 
            className="btn-action btn-print"
            onClick={imprimirRelatorio}
            title="Imprimir relatório"
          >
            <Printer size={18} />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="estatisticas-grid">
        <div className="estatistica-card">
          <div className="estatistica-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <FileText size={24} />
          </div>
          <div className="estatistica-info">
            <span className="estatistica-label">Total de Registros</span>
            <span className="estatistica-valor">{estatisticas.total}</span>
          </div>
        </div>

        <div className="estatistica-card">
          <div className="estatistica-icon" style={{ background: '#10b98115', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
          <div className="estatistica-info">
            <span className="estatistica-label">Total de Aulas Perdidas</span>
            <span className="estatistica-valor">{estatisticas.totalAulas}</span>
          </div>
        </div>

        <div className="estatistica-card">
          <div className="estatistica-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="estatistica-info">
            <span className="estatistica-label">Não Justificadas</span>
            <span className="estatistica-valor">{estatisticas.naoJustificadas}</span>
            <span className="estatistica-percentual">
              {estatisticas.total > 0 ? 
                ((estatisticas.naoJustificadas / estatisticas.total) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        <div className="estatistica-card">
          <div className="estatistica-icon" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
            <Filter size={24} />
          </div>
          <div className="estatistica-info">
            <span className="estatistica-label">Justificadas</span>
            <span className="estatistica-valor">{estatisticas.justificadas}</span>
            <span className="estatistica-percentual">{estatisticas.percentualJustificadas}%</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-section">
        <h3>Filtros Avançados</h3>
        <div className="filtros-grid">
          <div className="filtro-group">
            <label>Período</label>
            <select 
              value={periodoSelecionado}
              onChange={(e) => setPeriodoSelecionado(e.target.value)}
              className="filtro-select"
            >
              {data.periodos.map(periodo => (
                <option key={periodo.id} value={periodo.id}>
                  {periodo.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="filtro-group">
            <label>Matéria</label>
            <select 
              value={filtrosAvancados.materia}
              onChange={(e) => setFiltrosAvancados({
                ...filtrosAvancados, 
                materia: e.target.value
              })}
              className="filtro-select"
            >
              <option value="todas">Todas as Matérias</option>
              {data.materias.map(materia => (
                <option key={materia.id} value={materia.id}>
                  {materia.codigo} - {materia.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="filtro-group">
            <label>Status da Falta</label>
            <select 
              value={filtrosAvancados.statusFalta}
              onChange={(e) => setFiltrosAvancados({
                ...filtrosAvancados, 
                statusFalta: e.target.value
              })}
              className="filtro-select"
            >
              <option value="todas">Todas</option>
              <option value="justificadas">Justificadas</option>
              <option value="naoJustificadas">Não Justificadas</option>
            </select>
          </div>

          <div className="filtro-group">
            <label>Ordenar por</label>
            <select 
              value={filtrosAvancados.ordenarPor}
              onChange={(e) => setFiltrosAvancados({
                ...filtrosAvancados, 
                ordenarPor: e.target.value
              })}
              className="filtro-select"
            >
              <option value="data">Data</option>
              <option value="aluno">Aluno</option>
              <option value="materia">Matéria</option>
              <option value="faltas">Quantidade de Faltas</option>
            </select>
          </div>

          <div className="filtro-group">
            <label>Ordem</label>
            <select 
              value={filtrosAvancados.ordem}
              onChange={(e) => setFiltrosAvancados({
                ...filtrosAvancados, 
                ordem: e.target.value
              })}
              className="filtro-select"
            >
              <option value="desc">Decrescente</option>
              <option value="asc">Crescente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Registros */}
      <div className="tabela-section">
        <div className="tabela-header">
          <h3>Registros de Faltas</h3>
          <span className="registros-count">
            {registrosFiltrados.length} registro(s) encontrado(s)
          </span>
        </div>

        <div className="tabela-container">
          <table className="tabela-faltas">
            <thead>
              <tr>
                <th>Data</th>
                <th>Aluno</th>
                <th>Matrícula</th>
                <th>Matéria</th>
                <th>Professor</th>
                <th>Aulas</th>
                <th>Justificativa</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="8" className="tabela-empty">
                    <div className="empty-state">
                      <AlertTriangle size={48} />
                      <p>Nenhum registro encontrado</p>
                      <span>Tente ajustar os filtros de busca</span>
                    </div>
                  </td>
                </tr>
              ) : (
                registrosFiltrados.map(registro => (
                  <tr key={registro.id} className="tabela-row">
                    <td className="data-cell">
                      {formatarData(registro.data)}
                    </td>
                    <td>
                      <div className="aluno-info">
                        <div className="aluno-avatar">
                          {registro.alunoNome.charAt(0)}
                        </div>
                        <span>{registro.alunoNome}</span>
                      </div>
                    </td>
                    <td>{registro.alunoMatricula}</td>
                    <td>
                      <div className="materia-cell">
                        <span className="materia-codigo">{registro.materiaCodigo}</span>
                        <span className="materia-nome">{registro.materiaNome}</span>
                      </div>
                    </td>
                    <td>{registro.professor}</td>
                    <td>
                      <span className="aulas-badge">
                        {registro.aulasFaltadas} aula(s)
                      </span>
                    </td>
                    <td>
                      <span className={`justificativa-text ${registro.justificativa ? 'justificada' : 'nao-justificada'}`}>
                        {registro.justificativa || 'Não justificada'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${registro.justificativa ? 'status-justificada' : 'status-pendente'}`}>
                        {registro.justificativa ? 'Justificada' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé da tabela */}
        {registrosFiltrados.length > 0 && (
          <div className="tabela-footer">
            <div className="footer-info">
              <span>Mostrando {registrosFiltrados.length} de {data.registrosFalta.filter(r => r.periodoId === periodoSelecionado).length} registros</span>
            </div>
            <div className="footer-summary">
              <span>Total de aulas perdidas: <strong>{estatisticas.totalAulas}</strong></span>
              <span>Justificadas: <strong>{estatisticas.percentualJustificadas}%</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Seção de Análise */}
      <div className="analise-section">
        <div className="analise-card">
          <h3>📊 Análise do Período</h3>
          <div className="analise-grid">
            <div className="analise-item">
              <span className="analise-label">Matéria com mais faltas</span>
              <span className="analise-valor">
                {metricas.materiasCriticas[0]?.nome || 'Nenhuma'}
              </span>
              {metricas.materiasCriticas[0] && (
                <span className="analise-detalhe">
                  {metricas.materiasCriticas[0].totalFaltas} faltas registradas
                </span>
              )}
            </div>
            <div className="analise-item">
              <span className="analise-label">Dia mais crítico</span>
              <span className="analise-valor">
                {metricas.porDiaSemana.reduce((max, dia) => 
                  dia.total > max.total ? dia : max
                ).dia}
              </span>
            </div>
            <div className="analise-item">
              <span className="analise-label">Taxa de justificativas</span>
              <span className="analise-valor">
                {estatisticas.percentualJustificadas}%
              </span>
            </div>
            <div className="analise-item">
              <span className="analise-label">Média de faltas por aluno</span>
              <span className="analise-valor">
                {metricas.geral.mediaFaltasPorAluno}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatorioFaltas;