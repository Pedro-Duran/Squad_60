import gestores from "@/mocks/gestores.json"
import { simularRequisicao } from "@/services/mockUtils"

export function buscarGestor(id) {
  return simularRequisicao(() => {
    const gestor = gestores.find((item) => item.id === id)
    if (!gestor) throw new Error("Gestor não encontrado")
    return gestor
  })
}
