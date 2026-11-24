import usuarios from "@/mocks/usuarios.json"
import { simularRequisicao } from "@/services/mockUtils"

export function login(usuario, senha) {
  return simularRequisicao(() => {
    const encontrado = usuarios.find(
      (item) =>
        item.usuario === usuario.trim().toLowerCase() && item.senha === senha,
    )

    if (!encontrado) {
      throw new Error("Usuário ou senha inválidos.")
    }

    const sessao = { ...encontrado }
    delete sessao.senha
    return sessao
  })
}