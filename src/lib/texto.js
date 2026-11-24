export function normalizarTexto(texto) {
  if (!texto) return ""
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
}

export function somenteDigitos(texto) {
  if (!texto) return ""
  return texto.replace(/\D/g, "")
}

export function formatarCpf(cpf) {
  if (!cpf) return ""
  const digitos = somenteDigitos(cpf)
  return digitos.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
}

export function iniciaisDoNome(nome) {
  const partes = nome.trim().split(/\s+/)
  const primeira = partes[0]?.[0] || ""
  const segunda = partes.length > 1 ? partes[1][0] : ""
  return (primeira + segunda).toUpperCase()
}

const SITUACOES_FEMININAS = {
  Matriculado: "Matriculada",
  Transferido: "Transferida",
  Evadido: "Evadida",
  Concluído: "Concluída",
}

export function formatarSituacao(situacao, genero) {
  return genero === "F" ? SITUACOES_FEMININAS[situacao] || situacao : situacao
}
