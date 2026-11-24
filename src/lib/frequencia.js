export const FREQUENCIA_MINIMA = 75 // abaixo disso, o aluno atingiu o limite de faltas
export const FREQUENCIA_ATENCAO = 85 // abaixo disso, o aluno está perto do limite

export function calcularFrequencia(aluno) {
  if (aluno.aulasDadas === 0) return 100
  return Math.round((aluno.presencas / aluno.aulasDadas) * 100)
}

// "normal" | "atencao" | "limite"
export function situacaoFrequencia(percentual) {
  if (percentual < FREQUENCIA_MINIMA) return "limite"
  if (percentual < FREQUENCIA_ATENCAO) return "atencao"
  return "normal"
}
