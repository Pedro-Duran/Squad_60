import disponibilidade from '@/mocks/disponibilidade.json'
import professores from '@/mocks/professores.json'
import reposicoes from '@/mocks/reposicoes.json'
import { simularRequisicao } from '@/services/mockUtils'
export function calcularPainelReposicoes(professorId, hoje, lista = reposicoes) {
  const professor = professores.find((p) => p.id === professorId)
  if (!professor) throw new Error('Professor não encontrado')
  const doProfessor = lista.filter((r) => r.professorId === professorId)
  const disp = disponibilidade.find((d) => d.professorId === professorId)
  const resumo = {
    aulasPendentes: disp?.aulasPendentes ?? 0,
    reposicoesAgendadas: doProfessor.filter((r) => r.status === 'aprovada' && r.data >= hoje).length,
    horariosDisponiveis: disp?.horariosDisponiveis ?? 0,
    solicitacoesPendentes: doProfessor.filter((r) => r.status === 'pendente').length,
  }
  const proximas = doProfessor
    .filter((r) => r.data >= hoje && r.status !== 'recusada')
    .sort((a, b) => (a.data + a.inicio).localeCompare(b.data + b.inicio))
    .slice(0, 3)
  return { professor, resumo, proximas }
}
export function buscarPainelReposicoes(professorId, hoje) {
  return simularRequisicao(() => calcularPainelReposicoes(professorId, hoje))
}
