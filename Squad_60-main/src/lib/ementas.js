export const STATUS_EMENTA = {
  pendente: { texto: 'Pendente', classe: 'status-ementa-pendente' },
  deferida: { texto: 'Deferida', classe: 'status-ementa-deferida' },
  indeferida: { texto: 'Indeferida', classe: 'status-ementa-indeferida' },
}

export function normalizarTexto(texto = '') {
  return String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

// Mais recente primeiro; em caso de empate, mantém ordem estável pelo id.
export function ordenarPorEnvioDesc(lista) {
  return lista.slice().sort((a, b) => b.dataEnvio.localeCompare(a.dataEnvio) || a.id.localeCompare(b.id))
}

// Filtra por título da ementa, disciplina ou nome do coordenador (sem diferenciar acentos/maiúsculas).
export function filtrarEmentas(lista, termo) {
  const busca = normalizarTexto(termo)
  if (!busca) return lista
  return lista.filter((e) => [e.titulo, e.disciplina, e.coordenador].some((campo) => normalizarTexto(campo).includes(busca)))
}
