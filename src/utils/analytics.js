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

  const diasSemana = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];
  const faltasPorDia = new Array(7).fill(0);

  registrosPeriodo.forEach((registro) => {
    const dataRegistro = new Date(registro.data);
    const diaSemana = dataRegistro.getDay();
    faltasPorDia[diaSemana] += registro.aulasFaltadas;
  });

  const porDiaSemana = diasSemana.map((dia, index) => ({
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
