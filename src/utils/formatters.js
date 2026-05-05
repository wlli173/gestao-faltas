// Utilitários de formatação

export const formatarData = (dataString) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatarDataExtenso = (dataString) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export const formatarPercentual = (valor) => {
  return `${valor}%`;
};

export const formatarHora = (dataString) => {
  const data = new Date(dataString);
  return data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatarDataHora = (dataString) => {
  const data = new Date(dataString);
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const limitarTexto = (texto, limite = 50) => {
  if (texto.length <= limite) return texto;
  return texto.substring(0, limite) + '...';
};

export const capitalizar = (texto) => {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};