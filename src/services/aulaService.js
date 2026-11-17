import aulas from '@/mocks/aulas.json'
import chamadaAlunos from '@/mocks/chamadaAlunos.json'
import { simularRequisicao } from '@/services/mockUtils'

export function buscarAula(aulaId) {
  return simularRequisicao(() => {
    const aula = aulas.find((item) => item.id === aulaId)
    if (!aula) throw new Error('Aula não encontrada.')
    return aula
  })
}

export function buscarChamada(aulaId) {
  return simularRequisicao(() => {
    const aula = aulas.find((item) => item.id === aulaId)
    if (!aula) throw new Error('Aula não encontrada.')

    const presencas = new Map(
      aula.presencas.map(({ alunoId, presente }) => [alunoId, presente]),
    )
    const alunos = chamadaAlunos
      .filter((aluno) => aluno.turma === aula.turma)
      .map((aluno) => ({
        ...aluno,
        presente: presencas.get(aluno.id) ?? false,
      }))

    return { aula, alunos }
  })
}

export function salvarPresencas(aulaId, presencas, observacao) {
  return simularRequisicao(() => {
    if (!aulas.some((aula) => aula.id === aulaId)) {
      throw new Error('Aula não encontrada.')
    }

    return { aulaId, presencas, observacao }
  })
}
