import professores from "@/mocks/professores.json"
import { simularRequisicao } from "@/services/mockUtils"

export function buscarProfessor(id) {
  return simularRequisicao(() => {
    const professor = professores.find((item) => item.id === id)

    if (!professor) {
      throw new Error("Professor não encontrado")
    }

    return professor
  })
}
