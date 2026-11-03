import alunos from "@/mocks/alunos.json"
import { normalizarTexto, somenteDigitos } from "@/lib/texto"
import { simularRequisicao } from "@/services/mockUtils"

export function pesquisarAlunos(termo) {
  return simularRequisicao(() => {
    const digitos = somenteDigitos(termo)
    if (digitos.length === 11) {
      return alunos.filter((aluno) => aluno.cpf === digitos)
    }

    const busca = normalizarTexto(termo)
    if (!busca) return []

    return alunos
      .filter((aluno) => normalizarTexto(aluno.nome).includes(busca))
      .sort((alunoA, alunoB) => alunoA.nome.localeCompare(alunoB.nome))
  })
}
