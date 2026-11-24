import alunos from "@/mocks/alunos.json"
import { normalizarTexto } from "@/lib/texto"
import { registrarAlteracoesAluno } from "@/services/historicoService"
import { simularRequisicao } from "@/services/mockUtils"

export function buscarTurmasDisponiveis() {
  return simularRequisicao(() => {
    const turmas = new Map()

    alunos.forEach((aluno) => {
      if (!aluno.serie || !aluno.turno || !aluno.modalidade) return

      const chave = `${aluno.serie} - ${aluno.turno}`
      if (!turmas.has(chave)) {
        turmas.set(chave, {
          chave,
          serie: aluno.serie,
          turno: aluno.turno,
          modalidades: new Set(),
        })
      }
      turmas.get(chave).modalidades.add(aluno.modalidade)
    })

    return [...turmas.values()].map((turma) => ({
      ...turma,
      modalidades: [...turma.modalidades],
    }))
  })
}

export function buscarAlunosDaTurma(serie, turno, modalidade) {
  return simularRequisicao(() =>
    alunos
      .filter(
        (aluno) =>
          aluno.turma &&
          aluno.serie === serie &&
          aluno.turno === turno &&
          aluno.modalidade === modalidade
      )
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
  )
}

export function buscarCandidatosParaTurma(serie, turno, modalidade, termo = "") {
  return simularRequisicao(() => {
    const busca = normalizarTexto(termo.trim())
    return alunos
      .filter((aluno) => {
        const jaNaTurma =
          aluno.turma &&
          aluno.serie === serie &&
          aluno.turno === turno &&
          aluno.modalidade === modalidade
        const correspondeBusca =
          !busca ||
          normalizarTexto(aluno.nome).includes(busca) ||
          aluno.matricula.includes(termo.trim())

        return !jaNaTurma && aluno.modalidade === modalidade && correspondeBusca
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
  })
}

export function removerAlunoDaTurma(alunoId) {
  return simularRequisicao(() => {
    const aluno = alunos.find((item) => item.id === alunoId)
    if (!aluno) throw new Error("Aluno não encontrado")
    if (!aluno.turma) throw new Error("Aluno não está vinculado a uma turma")

    registrarAlteracoesAluno(aluno, { ...aluno, turma: "" })
    aluno.turma = ""
    return aluno
  })
}

export function adicionarAlunoNaTurma(alunoId, serie, turno, modalidade) {
  return simularRequisicao(() => {
    const aluno = alunos.find((item) => item.id === alunoId)
    if (!aluno) throw new Error("Aluno não encontrado")

    const jaNaTurma = alunos.some(
      (item) =>
        item.id === alunoId &&
        item.turma &&
        item.serie === serie &&
        item.turno === turno &&
        item.modalidade === modalidade
    )
    if (jaNaTurma) throw new Error("Aluno já está nesta turma")

    const novosDados = { ...aluno, serie, turno, modalidade, turma: aluno.turma || "A" }
    registrarAlteracoesAluno(aluno, novosDados)
    Object.assign(aluno, novosDados)
    return aluno
  })
}
