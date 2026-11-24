import aulas from "@/mocks/aulas.json"

// Ordem alfabética estável de todas as turmas do mock.
// Usar a lista completa (e não as turmas de um dia só) garante que a mesma
// turma receba sempre a mesma cor — aqui e em Aulas da Semana.
const TURMAS_ORDENADAS = [...new Set(aulas.map((a) => a.turma))].sort((a, b) =>
  a.localeCompare(b, "pt-BR"),
)

// Nome do token CSS da cor da turma: "turma-1" | "turma-2" | "turma-3"...
export function tokenCorTurma(turma) {
  const indice = TURMAS_ORDENADAS.indexOf(turma)
  return `turma-${indice + 1}`
}
