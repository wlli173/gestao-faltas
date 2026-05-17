export const DIAS_SEMANA = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

export const parseDataLocal = (dataString) => {
  const [ano, mes, dia] = dataString.split('T')[0].split('-').map(Number);
  return new Date(ano, mes - 1, dia);
};

export const calcularMetricasAluno = (data, alunoId, periodoSelecionado) => {
  const { registrosFalta, materias, alunos } = data;
  const aluno = alunos.find((a) => a.id === alunoId);

  if (!aluno) return null;

  const registros = registrosFalta.filter(
    (r) => r.alunoId === alunoId && r.periodoId === periodoSelecionado
  );

  const totalFaltas = registros.reduce((sum, r) => sum + r.aulasFaltadas, 0);

  const porMateria = materias.map((materia) => {
    const faltasMateria = registros
      .filter((r) => r.materiaId === materia.id)
      .reduce((sum, r) => sum + r.aulasFaltadas, 0);

    return {
      ...materia,
      totalFaltas: faltasMateria,
      percentualLimite:
        materia.limiteFaltas > 0
          ? ((faltasMateria / materia.limiteFaltas) * 100).toFixed(1)
          : 0,
      status:
        faltasMateria > materia.limiteFaltas * 0.7 ? 'critico' : 'normal',
    };
  });

  const faltasPorDia = new Array(7).fill(0);
  registros.forEach((registro) => {
    const diaSemana = parseDataLocal(registro.data).getDay();
    faltasPorDia[diaSemana] += registro.aulasFaltadas;
  });

  const porDiaSemana = DIAS_SEMANA.map((dia, index) => ({
    dia,
    total: faltasPorDia[index],
    percentual:
      totalFaltas > 0
        ? ((faltasPorDia[index] / totalFaltas) * 100).toFixed(1)
        : 0,
  }));

  const registrosDetalhados = registros
    .map((registro) => {
      const materia = materias.find((m) => m.id === registro.materiaId);
      return {
        ...registro,
        materiaNome: materia?.nome || '—',
        materiaCodigo: materia?.codigo || '—',
      };
    })
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  return {
    aluno,
    totalFaltas,
    materiasComFalta: porMateria.filter((m) => m.totalFaltas > 0).length,
    porMateria: porMateria.filter((m) => m.totalFaltas > 0),
    porMateriaCompleto: porMateria,
    porDiaSemana,
    registros: registrosDetalhados,
  };
};

export const calcularMetricas = (data, periodoSelecionado, filtroMateria = 'todas') => {
  const { registrosFalta, materias, alunos } = data;

  let registrosPeriodo = registrosFalta.filter(
    (r) => r.periodoId === periodoSelecionado
  );

  if (filtroMateria !== 'todas') {
    const materiaId = parseInt(filtroMateria, 10);
    registrosPeriodo = registrosPeriodo.filter((r) => r.materiaId === materiaId);
  }

  const totalFaltas = registrosPeriodo.reduce(
    (sum, reg) => sum + reg.aulasFaltadas,
    0
  );
  const alunosComFaltas = new Set(registrosPeriodo.map((r) => r.alunoId)).size;
  const mediaFaltasPorAluno =
    alunosComFaltas > 0 ? (totalFaltas / alunosComFaltas).toFixed(1) : 0;
  const diasComFalta = new Set(registrosPeriodo.map((r) => r.data)).size;

  const faltasPorMateria = materias.map((materia) => {
    const faltas = registrosPeriodo
      .filter((r) => r.materiaId === materia.id)
      .reduce((sum, r) => sum + r.aulasFaltadas, 0);

    return {
      ...materia,
      totalFaltas: faltas,
      percentualLimite: ((faltas / materia.limiteFaltas) * 100).toFixed(1),
      status: faltas > materia.limiteFaltas * 0.7 ? 'critico' : 'normal',
    };
  });

  const materiasCriticas = faltasPorMateria
    .filter((m) => m.status === 'critico')
    .sort((a, b) => b.percentualLimite - a.percentualLimite);

  const faltasPorDia = new Array(7).fill(0);

  registrosPeriodo.forEach((registro) => {
    const diaSemana = parseDataLocal(registro.data).getDay();
    faltasPorDia[diaSemana] += registro.aulasFaltadas;
  });

  const porDiaSemana = DIAS_SEMANA.map((dia, index) => ({
    dia,
    total: faltasPorDia[index],
    percentual:
      totalFaltas > 0
        ? ((faltasPorDia[index] / totalFaltas) * 100).toFixed(1)
        : 0,
  }));

  const registros = registrosPeriodo
    .map((registro) => {
      const aluno = alunos.find((a) => a.id === registro.alunoId);
      const materia = materias.find((m) => m.id === registro.materiaId);
      return {
        ...registro,
        alunoNome: aluno?.nome || '—',
        alunoMatricula: aluno?.matricula || '—',
        materiaNome: materia?.nome || '—',
        materiaCodigo: materia?.codigo || '—',
      };
    })
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  return {
    geral: {
      totalFaltas,
      alunosComFaltas,
      mediaFaltasPorAluno,
      diasComFalta,
      totalAlunos: alunos.length,
    },
    porPeriodo: faltasPorMateria.filter((m) => m.totalFaltas > 0),
    materiasCriticas,
    porDiaSemana,
    registros,
  };
};

export const getDiaMaisCritico = (dadosPorDia) => {
  return dadosPorDia.reduce((max, atual) =>
    atual.total > max.total ? atual : max
  );
};
