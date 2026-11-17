import gestores from "@/mocks/gestores.json"
import { simularRequisicao } from "@/services/mockUtils"

const CHAVE_GESTOR_ATIVO = "squad60:gestor-ativo"
let gestorAtivoId = "ges-001"

export function buscarGestor(id) {
  return simularRequisicao(() => {
    const gestor = gestores.find((item) => item.id === id)
    if (!gestor) throw new Error("Gestor não encontrado")
    return gestor
  })
}

export function definirGestorAtivo(id) {
  const gestor = gestores.find((item) => item.id === id)
  if (!gestor) throw new Error("Gestor não encontrado")
  gestorAtivoId = id
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(CHAVE_GESTOR_ATIVO, id)
  }
}

export function obterGestorAtivo() {
  const idSalvo =
    typeof window !== "undefined" ? window.sessionStorage.getItem(CHAVE_GESTOR_ATIVO) : null
  const gestor = gestores.find((item) => item.id === (idSalvo || gestorAtivoId))
  if (!gestor) throw new Error("Gestor ativo não encontrado")
  return gestor
}
