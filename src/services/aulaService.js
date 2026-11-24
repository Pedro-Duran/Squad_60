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
        presente: presencas.get(aluno.id) ?? true,
      }))

    return { aula, alunos }
  })
}

// Mock: só simula o envio. Os dados voltam ao original quando a página recarrega.
// ?estado=erro-envio força o erro só no envio (sem derrubar o carregamento).
// Valida como o back-end validaria: lista vazia ou aluno sem nome não passam.
export function salvarPresencas(aulaId, presencas, observacao = '') {
  return simularRequisicao(
    () => {
      if (!aulas.some((aula) => aula.id === aulaId)) {
        throw new Error('Aula não encontrada.')
      }
      if (presencas.length === 0) {
        throw new Error('A lista de presença está vazia.')
      }
      if (presencas.some((presenca) => !presenca.nome?.trim())) {
        throw new Error('Há aluno sem nome na lista.')
      }

      return {
        aulaId,
        presencas,
        observacao: observacao.trim(),
        salvoEm: new Date().toISOString(),
      }
    },
    { erroEm: 'erro-envio', mensagemErro: 'Não foi possível enviar a presença.' },
  )
}

// Aulas de um professor num dia, em ordem de horário.
export function listarAulasDoDia(professorId, data) {
  return simularRequisicao(() =>
    aulas
      .filter((aula) => aula.professorId === professorId && aula.data === data)
      .sort((a, b) => a.horario.localeCompare(b.horario)),
  )
}
