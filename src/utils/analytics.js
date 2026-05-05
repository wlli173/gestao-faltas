// src/utils/analytics.js
export const calcularMetricas = (data, periodoSelecionado) => {
  const { registrosFalta, materias, alunos } = data;
  
  // Filtrar registros do período selecionado
  const registrosPeriodo = registrosFalta.filter(
    r => r.periodoId === periodoSelecionado
  );

  // Métricas gerais
  const totalFaltas = registrosPeriodo.reduce(
    (sum, reg) => sum + reg.aulasFaltadas, 0
  );
  const alunosComFaltas = new Set(registrosPeriodo.map(r => r.alunoId)).size;
  const mediaFaltasPorAluno = alunosComFaltas > 0 
    ? (totalFaltas / alunosComFaltas).toFixed(1)
    : 0;
  const diasComFalta = new Set(registrosPeriodo.map(r => r.data)).size;

  // Faltas por matéria
  const faltasPorMateria = materias.map(materia => {
    const faltas = registrosPeriodo
      .filter(r => r.materiaId === materia.id)
      .reduce((sum, r) => sum + r.aulasFaltadas, 0);
    
    return {
      ...materia,
      totalFaltas: faltas,
      percentualLimite: ((faltas / materia.limiteFaltas) * 100).toFixed(1),
      status: faltas > materia.limiteFaltas * 0.7 ? 'critico' : 'normal'
    };
  });

  // Matérias com alto índice de falta (acima de 70% do limite)
  const materiasCriticas = faltasPorMateria
    .filter(m => m.status === 'critico')
    .sort((a, b) => b.percentualLimite - a.percentualLimite);

  // Faltas por dia da semana
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const faltasPorDia = new Array(7).fill(0);
  
  registrosPeriodo.forEach(registro => {
    const data = new Date(registro.data);
    const diaSemana = data.getDay();
    faltasPorDia[diaSemana] += registro.aulasFaltadas;
  });

  const porDiaSemana = diasSemana.map((dia, index) => ({
    dia,
    total: faltasPorDia[index],
    percentual: registrosPeriodo.length > 0 
      ? ((faltasPorDia[index] / totalFaltas) * 100).toFixed(1)
      : 0
  }));

  return {
    geral: {
      totalFaltas,
      alunosComFaltas,
      mediaFaltasPorAluno,
      diasComFalta,
      totalAlunos: alunos.length
    },
    porPeriodo: faltasPorMateria.filter(m => m.totalFaltas > 0),
    materiasCriticas,
    porDiaSemana
  };
};

export const getDiaMaisCritico = (dadosPorDia) => {
  return dadosPorDia.reduce((max, atual) => 
    atual.total > max.total ? atual : max
  );
};