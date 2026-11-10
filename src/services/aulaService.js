import alunos from "@/mocks/alunos.json"
import aulas from "@/mocks/aulas.json"
import { simularRequisicao } from "@/services/mockUtils"

export function encontrarAula(id) {
  const aula = aulas.find((item) => item.id === id)
  if (!aula) throw new Error("Aula não encontrada")
  return aula
}

export function buscarChamada(aulaId) {
  return simularRequisicao(() => {
    const aula = encontrarAula(aulaId)
    const alunosDaTurma = alunos
      .filter((aluno) => aluno.turma === aula.turma)
      .map((aluno) => ({
        ...aluno,
        presente: aula.presencas.find((presenca) => presenca.alunoId === aluno.id)?.presente ?? true,
      }))

    return { aula, alunos: alunosDaTurma }
  })
}

export function salvarPresencas(aulaId, presencas) {
  return simularRequisicao(() => ({
    aulaId,
    presencas,
    salvoEm: new Date().toISOString(),
  }))
}

export function buscarAula(aulaId) {
  return simularRequisicao(() => encontrarAula(aulaId))
}
