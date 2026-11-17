import historico from "@/mocks/historico.json"
import { simularRequisicao } from "@/services/mockUtils"

const CAMPOS_TURMA = [
  ["serie", "Série/Ano"],
  ["turma", "Turma"],
  ["modalidade", "Modalidade"],
]

const CAMPOS_CADASTRO = [
  ["nome", "Nome"],
  ["dataNascimento", "Data de nascimento"],
]

const RESPONSAVEL_PADRAO = {
  nome: "Beatriz Vieira Machado",
  setor: "Gestão Escolar",
}

let proximoNumeroRegistro = historico.length

function formatarValor(campo, valor) {
  if (!valor) return "Não informado"

  if (campo === "dataNascimento") {
    const correspondencia = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (correspondencia) return `${correspondencia[3]}/${correspondencia[2]}/${correspondencia[1]}`
  }

  return valor
}

function encontrarAlteracoes(aluno, dados, campos) {
  return campos.flatMap(([campo, rotulo]) => {
    if (aluno[campo] === dados[campo]) return []

    return [
      {
        rotulo,
        anterior: formatarValor(campo, aluno[campo]),
        nova: formatarValor(campo, dados[campo]),
      },
    ]
  })
}

function criarDataLocal() {
  const agora = new Date()
  const preencher = (valor, tamanho = 2) => String(valor).padStart(tamanho, "0")

  return [
    `${agora.getFullYear()}-${preencher(agora.getMonth() + 1)}-${preencher(agora.getDate())}`,
    `T${preencher(agora.getHours())}:${preencher(agora.getMinutes())}:${preencher(agora.getSeconds())}`,
  ].join("")
}

function adicionarRegistro(alunoId, tipo, alteracoes, descricao) {
  const primeiroCampo = alteracoes[0]
  proximoNumeroRegistro += 1
  historico.push({
    id: `hist-${Date.now()}-${proximoNumeroRegistro}`,
    alunoId,
    tipo,
    data: criarDataLocal(),
    anterior: primeiroCampo.anterior,
    nova: primeiroCampo.nova,
    ...(descricao ? { descricao } : {}),
    responsavel: RESPONSAVEL_PADRAO,
  })
}

export function registrarAlteracoesAluno(aluno, dados) {
  const alteracoesTurma = encontrarAlteracoes(aluno, dados, CAMPOS_TURMA)
  const alteracoesCadastro = encontrarAlteracoes(aluno, dados, CAMPOS_CADASTRO)
  const alteracaoTurno = encontrarAlteracoes(aluno, dados, [["turno", "Turno"]])
  const alteracaoSituacao = encontrarAlteracoes(aluno, dados, [["situacao", "Situação"]])

  if (alteracoesTurma.length > 0) {
    const descricao = alteracoesTurma
      .map(({ rotulo, anterior, nova }) => `${rotulo}: de ${anterior} para ${nova}`)
      .join("; ")
    adicionarRegistro(aluno.id, "turma", alteracoesTurma, descricao)
  }

  if (alteracaoTurno.length > 0) {
    adicionarRegistro(aluno.id, "turno", alteracaoTurno)
  }

  if (alteracaoSituacao.length > 0) {
    adicionarRegistro(aluno.id, "situacao", alteracaoSituacao)
  }

  if (alteracoesCadastro.length > 0) {
    const descricao = alteracoesCadastro
      .map(({ rotulo, anterior, nova }) => `${rotulo}: de ${anterior} para ${nova}`)
      .join("; ")
    adicionarRegistro(aluno.id, "cadastro", alteracoesCadastro, descricao)
  }
}

export function buscarHistoricoAluno(alunoId) {
  return simularRequisicao(() =>
    historico
      .filter((registro) => registro.alunoId === alunoId)
      .sort((registroA, registroB) => registroB.data.localeCompare(registroA.data))
  )
}
