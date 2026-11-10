import aulas from "@/mocks/aulas.json"
import alunos from "@/mocks/chamadaAlunos.json"
import { simularRequisicao } from "@/services/mockUtils"
import { somarDias } from "@/lib/datas"

const ERRO_AULAS = { mensagemErro: "Não foi possível carregar as aulas." }

// Uma aula pelo id (usado por Lista de presença e Diário).
export function encontrarAula(id) {
  return simularRequisicao(() => aulas.find((a) => a.id === id) ?? null, ERRO_AULAS)
}

// Aulas de um professor num dia, em ordem de horário.
export function listarAulasDoDia(professorId, data) {
  return simularRequisicao(() =>
    aulas
      .filter((a) => a.professorId === professorId && a.data === data)
      .sort((a, b) => a.horario.localeCompare(b.horario)),
    ERRO_AULAS,
  )
}

// Aulas de segunda a sábado da semana que começa em "segunda" (AAAA-MM-DD)
export function listarAulasDaSemana(professorId, segunda) {
  const sabado = somarDias(segunda, 5)
  return simularRequisicao(() =>
    aulas.filter(
      (a) => a.professorId === professorId && a.data >= segunda && a.data <= sabado,
    ),
    ERRO_AULAS,
  )
}

// Junta a aula com os alunos da turma e a presença de cada um nessa aula.
export function buscarChamada(aulaId) {
  return simularRequisicao(() => {
    const aula = aulas.find((a) => a.id === aulaId)
    if (!aula) throw new Error("Aula não encontrada")
    const alunosDaTurma = alunos
      .filter((aluno) => aluno.turma === aula.turma)
      .map((aluno) => ({
        ...aluno,
        presente: aula.presencas.find((p) => p.alunoId === aluno.id)?.presente ?? true,
      }))
    return { aula, alunos: alunosDaTurma }
  }, { mensagemErro: "Não foi possível carregar a lista de presença." })
}

// Mock: só simula o envio. Os dados voltam ao original quando a página recarrega.
// ?estado=erro-envio força o erro só no envio (sem derrubar o carregamento).
// Valida como o back-end validaria: lista vazia ou aluno sem nome não passam.
export function salvarPresencas(aulaId, presencas, observacao = "") {
  return simularRequisicao(
    () => {
      if (presencas.length === 0) {
        throw new Error("A lista de presença está vazia.")
      }
      if (presencas.some((p) => !p.nome?.trim())) {
        throw new Error("Há aluno sem nome na lista.")
      }
      return {
        aulaId,
        presencas,
        observacao: observacao.trim(),
        salvoEm: new Date().toISOString(),
      }
    },
    { erroEm: "erro-envio", mensagemErro: "Não foi possível enviar a presença." },
  )
}
