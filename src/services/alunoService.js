import alunos from "@/mocks/alunos.json"
import { normalizarTexto, somenteDigitos } from "@/lib/texto"
import { simularRequisicao } from "@/services/mockUtils"

export function pesquisarAlunos(termo) {
  return simularRequisicao(() => {
    const busca = normalizarTexto(termo)
    const buscaNumerica = /^\d[\d\s()./-]*$/.test(termo.trim())
    const digitos = buscaNumerica ? somenteDigitos(termo) : ""
    if (!busca && !digitos) return []

    return alunos
      .filter((aluno) => {
        const nomeCorresponde = busca && normalizarTexto(aluno.nome).includes(busca)
        const identificadorCorresponde =
          digitos &&
          (aluno.matricula.includes(digitos) || somenteDigitos(aluno.cpf).includes(digitos))

        return nomeCorresponde || identificadorCorresponde
      })
      .sort((alunoA, alunoB) => alunoA.nome.localeCompare(alunoB.nome))
  })
}

export function buscarAlunoPorId(id) {
  return simularRequisicao(() => {
    const aluno = alunos.find((item) => item.id === id)
    if (!aluno) throw new Error("Aluno não encontrado")
    return aluno
  })
}
