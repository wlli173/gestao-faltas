import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  User,
  X,
  BarChart3,
  BookOpen,
  CalendarDays,
} from 'lucide-react';
import data from '../../data/faltas.json';
import { calcularMetricasAluno, getDiaMaisCritico } from '../../utils/analytics';
import FaltasAlunoMaterias from '../Charts/FaltasAlunoMaterias';
import FaltasPorDia from '../Charts/FaltasPorDia';
import HistoricoFaltasAluno from '../Charts/HistoricoFaltasAluno';
import '../Charts/Charts.css';
import './GestaoAlunos.css';

const GestaoAlunos = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('2024.1');
  const [busca, setBusca] = useState('');
  const [alunoId, setAlunoId] = useState(null);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const buscaRef = useRef(null);
  const dropdownRef = useRef(null);

  const alunosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return data.alunos;

    return data.alunos.filter(
      (aluno) =>
        aluno.nome.toLowerCase().includes(termo) ||
        aluno.matricula.includes(termo)
    );
  }, [busca]);

  const metricas = useMemo(() => {
    if (!alunoId) return null;
    return calcularMetricasAluno(data, alunoId, periodoSelecionado);
  }, [alunoId, periodoSelecionado]);

  const diaCritico = metricas
    ? getDiaMaisCritico(metricas.porDiaSemana)
    : null;

  const selecionarAluno = (id) => {
    setAlunoId(id);
    setBusca('');
    setDropdownAberto(false);
  };

  const limparSelecao = () => {
    setAlunoId(null);
    setBusca('');
    buscaRef.current?.focus();
  };

  useEffect(() => {
    const handleClickFora = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownAberto(false);
      }
    };

    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  const alunoSelecionado = metricas?.aluno;

  return (
    <div className="gestao-alunos page-enter">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Gestão de Alunos</h1>
          <p>Consulte o histórico de faltas individual por matéria e dia da semana</p>
        </div>
        <div className="page-header-controls">
          <div className="control-group">
            <label htmlFor="aluno-periodo-select">Período</label>
            <select
              id="aluno-periodo-select"
              value={periodoSelecionado}
              onChange={(e) => setPeriodoSelecionado(e.target.value)}
              className="control-select"
            >
              {data.periodos.map((periodo) => (
                <option key={periodo.id} value={periodo.id}>
                  {periodo.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!alunoId && (
      <section className="aluno-search-section" ref={dropdownRef}>
        <label htmlFor="aluno-search" className="aluno-search-label">
          Buscar aluno
        </label>
        <div className={`aluno-search-wrapper ${dropdownAberto ? 'focused' : ''}`}>
          <Search size={18} className="aluno-search-icon" />
          <input
            id="aluno-search"
            ref={buscaRef}
            type="search"
            className="aluno-search-input"
            placeholder="Nome ou matrícula..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setDropdownAberto(true);
            }}
            onFocus={() => setDropdownAberto(true)}
            autoComplete="off"
          />
          {busca && (
            <button
              type="button"
              className="aluno-search-clear"
              onClick={() => setBusca('')}
              aria-label="Limpar busca"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {dropdownAberto && !alunoId && (
          <ul className="aluno-search-results" role="listbox">
            {alunosFiltrados.length === 0 ? (
              <li className="aluno-search-empty">Nenhum aluno encontrado</li>
            ) : (
              alunosFiltrados.map((aluno) => (
                <li key={aluno.id} role="option">
                  <button
                    type="button"
                    className="aluno-search-item"
                    onClick={() => selecionarAluno(aluno.id)}
                  >
                    <span className="aluno-search-avatar">
                      {aluno.nome.charAt(0)}
                    </span>
                    <span className="aluno-search-info">
                      <span className="aluno-search-nome">{aluno.nome}</span>
                      <span className="aluno-search-meta">
                        {aluno.matricula} · {aluno.curso}
                      </span>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </section>
      )}

      {alunoSelecionado ? (
        <>
          <div className="aluno-selecionado-card">
            <div className="aluno-selecionado-info">
              <div className="aluno-selecionado-avatar">
                {alunoSelecionado.nome.charAt(0)}
              </div>
              <div>
                <h2>{alunoSelecionado.nome}</h2>
                <p>
                  {alunoSelecionado.matricula} · {alunoSelecionado.curso}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="aluno-selecionado-clear"
              onClick={limparSelecao}
            >
              <X size={16} />
              Trocar aluno
            </button>
          </div>

          <div className="aluno-resumo-grid">
            <div className="aluno-resumo-card">
              <div className="aluno-resumo-icon" style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                <BarChart3 size={20} />
              </div>
              <div>
                <span className="aluno-resumo-label">Total de faltas</span>
                <span className="aluno-resumo-valor">{metricas.totalFaltas}</span>
                <span className="aluno-resumo-sub">aulas no período</span>
              </div>
            </div>
            <div className="aluno-resumo-card">
              <div className="aluno-resumo-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                <BookOpen size={20} />
              </div>
              <div>
                <span className="aluno-resumo-label">Matérias com falta</span>
                <span className="aluno-resumo-valor">{metricas.materiasComFalta}</span>
                <span className="aluno-resumo-sub">disciplinas afetadas</span>
              </div>
            </div>
            <div className="aluno-resumo-card">
              <div className="aluno-resumo-icon" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                <CalendarDays size={20} />
              </div>
              <div>
                <span className="aluno-resumo-label">Dia mais crítico</span>
                <span className="aluno-resumo-valor">
                  {diaCritico?.total > 0 ? diaCritico.dia : '—'}
                </span>
                <span className="aluno-resumo-sub">
                  {diaCritico?.total > 0
                    ? `${diaCritico.total} aula(s) · ${diaCritico.percentual}%`
                    : 'sem ocorrências'}
                </span>
              </div>
            </div>
          </div>

          <div className="aluno-charts-grid">
            <FaltasAlunoMaterias
              dados={metricas.porMateriaCompleto}
              alunoNome={alunoSelecionado.nome}
            />
            <FaltasPorDia
              dados={metricas.porDiaSemana}
              subtitulo={`Dias em que ${alunoSelecionado.nome.split(' ')[0]} mais falta`}
            />
          </div>

          <HistoricoFaltasAluno
            registros={metricas.registros}
            alunoNome={alunoSelecionado.nome}
          />
        </>
      ) : (
        <div className="aluno-empty-state">
          <div className="aluno-empty-icon">
            <User size={32} />
          </div>
          <h3>Selecione um aluno</h3>
          <p>
            Use a barra de pesquisa acima para encontrar um aluno pelo nome ou
            matrícula e visualizar os gráficos de faltas.
          </p>
        </div>
      )}
    </div>
  );
};

export default GestaoAlunos;
