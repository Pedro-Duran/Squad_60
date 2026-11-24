import professores from "@/mocks/professores.json"
import reposicoesIniciais from "@/mocks/reposicoes.json"
import { simularRequisicao } from "@/services/mockUtils"

const CHAVE_REPOSICOES = "squad60:reposicoes"
export const EVENTO_REPOSICOES_ATUALIZADAS = "squad60:reposicoes-atualizadas"
const SALAS = Array.from({ length: 8 }, (_, indice) => indice + 1)
const HORARIOS = [
  { inicio: "14:00", fim: "14:50" },
  { inicio: "14:50", fim: "15:40" },
  { inicio: "15:40", fim: "16:30" },
  { inicio: "17:00", fim: "17:50" },
  { inicio: "17:50", fim: "18:40" },
]

function dataLocalISO(data = new Date()) {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, "0")
  const dia = String(data.getDate()).padStart(2, "0")
  return `${ano}-${mes}-${dia}`
}

function dataDeISO(valor) {
  const [ano, mes, dia] = valor.split("-").map(Number)
  return new Date(ano, mes - 1, dia, 12)
}

function adicionarMeses(valor, quantidade) {
  const data = dataDeISO(valor)
  const diaOriginal = data.getDate()
  data.setDate(1)
  data.setMonth(data.getMonth() + quantidade)
  const ultimoDia = new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate()
  data.setDate(Math.min(diaOriginal, ultimoDia))
  return data
}

function normalizarStatus(status) {
  return status === "recusada" ? "rejeitada" : status
}

function normalizarSolicitacao(solicitacao) {
  const professor = professores.find((item) => item.id === solicitacao.professorId)

  return {
    ...solicitacao,
    professorNome: solicitacao.professorNome ?? professor?.nome ?? "Professor",
    professorNomeCurto:
      solicitacao.professorNomeCurto ?? professor?.nomeCurto ?? "Professor",
    disciplina: solicitacao.disciplina ?? professor?.disciplina ?? "Disciplina",
    dataSolicitacao: solicitacao.dataSolicitacao ?? dataLocalISO(),
    motivo: solicitacao.motivo ?? "Solicitação de reposição de aula.",
    sala: solicitacao.sala ?? null,
    status: normalizarStatus(solicitacao.status),
  }
}

function turmaValidaParaNivel(turma, nivelEnsino) {
  const serie = turma.match(/^(\d{1,2})º?\s*Ano\b/i)
  if (!serie) return false

  const ano = Number(serie[1])
  const atendeFundamental = nivelEnsino.includes("Fundamental")
  const atendeMedio = nivelEnsino.includes("Médio")

  return (
    (atendeFundamental && ano >= 6 && ano <= 9) ||
    (atendeMedio && ano >= 1 && ano <= 3)
  )
}

function lerSolicitacoes() {
  if (typeof window === "undefined") {
    return reposicoesIniciais.map(normalizarSolicitacao)
  }

  const salvas = window.localStorage.getItem(CHAVE_REPOSICOES)
  if (salvas === null) {
    return reposicoesIniciais.map(normalizarSolicitacao)
  }

  let solicitacoes
  try {
    solicitacoes = JSON.parse(salvas)
  } catch {
    throw new Error("Não foi possível ler as solicitações de reposição salvas.")
  }

  if (!Array.isArray(solicitacoes)) {
    throw new Error("Os dados salvos de reposição estão em formato inválido.")
  }

  return solicitacoes.map(normalizarSolicitacao)
}

function salvarSolicitacoes(solicitacoes) {
  window.localStorage.setItem(CHAVE_REPOSICOES, JSON.stringify(solicitacoes))
  window.dispatchEvent(new Event(EVENTO_REPOSICOES_ATUALIZADAS))
}

function encontrarSolicitacao(solicitacoes, id) {
  const solicitacao = solicitacoes.find((item) => item.id === id)
  if (!solicitacao) throw new Error("Solicitação de reposição não encontrada.")
  return solicitacao
}

function ordenarPorSolicitacao(solicitacoes) {
  return [...solicitacoes].sort((a, b) =>
    (b.dataSolicitacao ?? "").localeCompare(a.dataSolicitacao ?? ""),
  )
}

function gerarDatasDisponiveis(solicitacao) {
  const hoje = dataDeISO(dataLocalISO())
  const dataSolicitada = dataDeISO(solicitacao.dataSolicitacao)
  const inicio = new Date(
    Math.max(hoje.getTime(), dataSolicitada.getTime() + 24 * 60 * 60 * 1000),
  )
  const limite = adicionarMeses(solicitacao.dataSolicitacao, 2)

  const datas = []
  while (inicio <= limite) {
    if (inicio.getDay() !== 0) {
      datas.push(dataLocalISO(inicio))
    }
    inicio.setDate(inicio.getDate() + 1)
  }
  return datas
}

function horarioDisponivel(solicitacoes, solicitacaoId, data, horario, sala) {
  return !solicitacoes.some(
    (item) =>
      item.id !== solicitacaoId &&
      item.status === "aprovada" &&
      item.data === data &&
      item.inicio === horario.inicio &&
      Number(item.sala) === sala,
  )
}

function opcoesParaSolicitacao(solicitacoes, solicitacao) {
  const datas = gerarDatasDisponiveis(solicitacao)
  return datas
    .map((data) => ({
      data,
      horarios: HORARIOS.map((horario) => ({
        ...horario,
        salas: SALAS.filter((sala) =>
          horarioDisponivel(solicitacoes, solicitacao.id, data, horario, sala),
        ),
      })).filter((horario) => horario.salas.length > 0),
    }))
    .filter((dia) => dia.horarios.length > 0)
}

function contarHorariosDisponiveis(solicitacoes, hoje = dataLocalISO()) {
  const inicio = dataDeISO(hoje)
  const limite = adicionarMeses(hoje, 2)
  let total = 0

  while (inicio <= limite) {
    if (inicio.getDay() !== 0) {
      const data = dataLocalISO(inicio)
      for (const horario of HORARIOS) {
        total += SALAS.filter((sala) =>
          horarioDisponivel(solicitacoes, null, data, horario, sala),
        ).length
      }
    }
    inicio.setDate(inicio.getDate() + 1)
  }

  return total
}

export function listarSolicitacoesCalendario(status) {
  return simularRequisicao(() => {
    const solicitacoes = ordenarPorSolicitacao(lerSolicitacoes())
    if (!status || status === "todos") return solicitacoes
    if (status === "rejeitada") {
      return solicitacoes.filter((item) => item.status === "rejeitada")
    }
    return solicitacoes.filter((item) => item.status === status)
  })
}

export function buscarPainelCalendarioReposicao() {
  return simularRequisicao(() => {
    const solicitacoes = ordenarPorSolicitacao(lerSolicitacoes())
    const pendentes = solicitacoes.filter((item) => item.status === "pendente")
    const hoje = dataLocalISO()
    const proximas = solicitacoes
      .filter(
        (item) =>
          item.status === "aprovada" && item.data && item.data >= hoje,
      )
      .sort((a, b) => a.data.localeCompare(b.data))

    return {
      metricas: {
        aulasPendentes: solicitacoes.filter(
          (item) =>
            item.status === "aprovada" && item.data && item.data >= hoje,
        ).length,
        reposicoesAgendadas: solicitacoes.filter(
          (item) => item.status === "aprovada",
        ).length,
        horariosDisponiveis: contarHorariosDisponiveis(solicitacoes, hoje),
        solicitacoesPendentes: pendentes.length,
      },
      proximas: proximas.slice(0, 3),
    }
  })
}

export function buscarSolicitacaoReposicao(id) {
  return simularRequisicao(() =>
    encontrarSolicitacao(lerSolicitacoes(), id),
  )
}

export function buscarOpcoesReposicao(id) {
  return simularRequisicao(() => {
    const solicitacoes = lerSolicitacoes()
    const solicitacao = encontrarSolicitacao(solicitacoes, id)
    if (solicitacao.status !== "pendente") {
      throw new Error("Esta solicitação não está mais pendente.")
    }
    return {
      solicitacao,
      datas: opcoesParaSolicitacao(solicitacoes, solicitacao),
    }
  })
}

export function criarSolicitacaoReposicao({
  professorId,
  turma,
  turno,
  dataAula,
  motivo,
}) {
  return simularRequisicao(() => {
    const professor = professores.find((item) => item.id === professorId)
    if (!professor) throw new Error("Professor não encontrado.")
    const turmaInformada = turma?.trim() ?? ""
    if (!turmaInformada || !turno || !dataAula || !motivo?.trim()) {
      throw new Error("Preencha todos os dados da solicitação.")
    }
    if (turno !== "Tarde") {
      throw new Error("O único turno disponível para reposição é o da tarde.")
    }
    if (!turmaValidaParaNivel(turmaInformada, professor.nivelEnsino)) {
      const etapasAtendidas = []
      if (professor.nivelEnsino.includes("Fundamental")) {
        etapasAtendidas.push("do 6º ao 9º ano do Ensino Fundamental")
      }
      if (professor.nivelEnsino.includes("Médio")) {
        etapasAtendidas.push("do 1º ao 3º ano do Ensino Médio")
      }
      const mensagem = etapasAtendidas.length
        ? `Informe uma turma ${etapasAtendidas.join(" ou ")}.`
        : "Não foi possível determinar as etapas atendidas por este professor."
      throw new Error(mensagem)
    }

    const solicitacao = normalizarSolicitacao({
      id: `rep-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`,
      professorId,
      professorNome: professor.nome,
      professorNomeCurto: professor.nomeCurto,
      disciplina: professor.disciplina,
      turma: turmaInformada,
      turno,
      dataAula,
      dataSolicitacao: dataLocalISO(),
      motivo: motivo.trim(),
      status: "pendente",
    })

    salvarSolicitacoes([...lerSolicitacoes(), solicitacao])
    return solicitacao
  })
}

export function aprovarSolicitacaoReposicao(id, agendamento) {
  return simularRequisicao(() => {
    const solicitacoes = lerSolicitacoes()
    const solicitacao = encontrarSolicitacao(solicitacoes, id)
    if (solicitacao.status !== "pendente") {
      throw new Error("Esta solicitação não está mais pendente.")
    }

    const horario = HORARIOS.find(
      (item) =>
        item.inicio === agendamento.inicio && item.fim === agendamento.fim,
    )
    const sala = Number(agendamento.sala)
    const dataEscolhida = dataDeISO(agendamento.data)
    const dentroDoPrazo =
      dataEscolhida <= adicionarMeses(solicitacao.dataSolicitacao, 2)
    if (
      !horario ||
      !SALAS.includes(sala) ||
      dataEscolhida.getDay() === 0 ||
      !dentroDoPrazo ||
      !opcoesParaSolicitacao(solicitacoes, solicitacao).some(
        (dia) =>
          dia.data === agendamento.data &&
          dia.horarios.some(
            (opcao) =>
              opcao.inicio === horario.inicio &&
              opcao.fim === horario.fim &&
              opcao.salas.includes(sala),
          ),
      )
    ) {
      throw new Error("O horário selecionado não está mais disponível.")
    }

    const atualizada = {
      ...solicitacao,
      status: "aprovada",
      data: agendamento.data,
      inicio: horario.inicio,
      fim: horario.fim,
      sala,
    }
    salvarSolicitacoes(
      solicitacoes.map((item) => (item.id === id ? atualizada : item)),
    )
    return atualizada
  })
}

export function rejeitarSolicitacaoReposicao(id) {
  return simularRequisicao(() => {
    const solicitacoes = lerSolicitacoes()
    const solicitacao = encontrarSolicitacao(solicitacoes, id)
    if (solicitacao.status !== "pendente") {
      throw new Error("Esta solicitação não está mais pendente.")
    }

    const atualizada = { ...solicitacao, status: "rejeitada" }
    salvarSolicitacoes(
      solicitacoes.map((item) => (item.id === id ? atualizada : item)),
    )
    return atualizada
  })
}

export function calcularPainelReposicoes(professorId, hoje, lista) {
  const professor = professores.find((item) => item.id === professorId)
  if (!professor) throw new Error("Professor não encontrado")

  const todas = lista ?? lerSolicitacoes()
  const doProfessor = todas.filter((item) => item.professorId === professorId)
  const resumo = {
    aulasPendentes: doProfessor.filter(
      (item) =>
        item.status === "aprovada" && item.data && item.data >= hoje,
    ).length,
    reposicoesAgendadas: doProfessor.filter(
      (item) => item.status === "aprovada",
    ).length,
    horariosDisponiveis: contarHorariosDisponiveis(todas, hoje),
    solicitacoesPendentes: doProfessor.filter(
      (item) => item.status === "pendente",
    ).length,
  }
  const proximas = doProfessor
    .filter(
      (item) =>
        item.status === "pendente" ||
        (item.status === "aprovada" && item.data >= hoje),
    )
    .map((item) => ({
      ...item,
      data: item.data ?? item.dataAula ?? item.dataSolicitacao,
    }))
    .sort((a, b) => (a.data + (a.inicio ?? "")).localeCompare(b.data + (b.inicio ?? "")))
    .slice(0, 3)

  return { professor, resumo, proximas }
}

export function buscarPainelReposicoes(professorId, hoje) {
  return simularRequisicao(() =>
    calcularPainelReposicoes(professorId, hoje),
  )
}
