import aulas from "@/mocks/aulas.json"
import { somarDias } from "@/lib/datas"
import { simularRequisicao } from "@/lib/mockUtils"

export function encontrarAula(id) {
  return simularRequisicao(() => aulas.find((aula) => aula.id === id) ?? null)
}

export function listarAulasDoDia(professorId, data) {
  return simularRequisicao(() =>
    aulas
      .filter(
        (aula) => aula.professorId === professorId && aula.data === data,
      )
      .sort((a, b) => a.horario.localeCompare(b.horario)),
  )
}

export function listarAulasDaSemana(professorId, segunda) {
  const sabado = somarDias(segunda, 5)

  return simularRequisicao(() =>
    aulas
      .filter(
        (aula) =>
          aula.professorId === professorId &&
          aula.data >= segunda &&
          aula.data <= sabado,
      )
      .sort(
        (a, b) =>
          a.data.localeCompare(b.data) ||
          a.horario.localeCompare(b.horario),
      ),
  )
}
