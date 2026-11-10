import alunos from "@/mocks/alunos.json"
import { normalizarTexto, somenteDigitos } from "@/lib/texto"
import { simularRequisicao } from "@/services/mockUtils"

export function pesquisarAlunos(termo) {
  return simularRequisicao(() => {
    const digitos = somenteDigitos(termo)
    const busca = termo.trim()
    const buscaPorMatricula = alunos.filter(
      (aluno) => aluno.matricula === busca || aluno.matricula === digitos,
    )

    if (buscaPorMatricula.length > 0) return buscaPorMatricula

    if (digitos.length === 11) {
      return alunos.filter((aluno) => aluno.cpf === digitos)
    }

    const buscaPorNome = normalizarTexto(termo)
    if (!buscaPorNome) return []

    return alunos
      .filter((aluno) => normalizarTexto(aluno.nome).includes(buscaPorNome))
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
