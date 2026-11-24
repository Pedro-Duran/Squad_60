import { simularRequisicao } from "@/services/mockUtils"

const disciplinasIniciais = [
  { id: "mat-101", nome: "Matemática", codigo: "MAT-101", modalidade: "Ensino Médio", ativa: true },
  { id: "lpo-102", nome: "Língua Portuguesa", codigo: "LPO-102", modalidade: "Ensino Médio", ativa: true },
  { id: "fis-103", nome: "Física", codigo: "FIS-103", modalidade: "Ensino Médio", ativa: true },
  { id: "qui-104", nome: "Química", codigo: "QUI-104", modalidade: "Ensino Médio", ativa: true },
  { id: "fil-110", nome: "Filosofia", codigo: "FIL-110", modalidade: "Ensino Médio", ativa: false },
  { id: "soc-111", nome: "Sociologia", codigo: "SOC-111", modalidade: "Ensino Médio", ativa: true },
  { id: "bio-105", nome: "Biologia", codigo: "BIO-105", modalidade: "Ensino Médio", ativa: true },
  { id: "his-106", nome: "História", codigo: "HIS-106", modalidade: "Ensino Médio", ativa: true },
  { id: "geo-107", nome: "Geografia", codigo: "GEO-107", modalidade: "Ensino Médio", ativa: true },
  { id: "ing-108", nome: "Língua Inglesa", codigo: "ING-108", modalidade: "Ensino Médio", ativa: true },
  { id: "esp-109", nome: "Língua Espanhola", codigo: "ESP-109", modalidade: "Ensino Médio", ativa: true },
  { id: "art-112", nome: "Arte", codigo: "ART-112", modalidade: "Ensino Médio", ativa: true },
  { id: "edf-113", nome: "Educação Física", codigo: "EDF-113", modalidade: "Ensino Médio", ativa: true },
  { id: "lit-114", nome: "Literatura", codigo: "LIT-114", modalidade: "Ensino Médio", ativa: true },
  { id: "red-115", nome: "Redação", codigo: "RED-115", modalidade: "Ensino Médio", ativa: true },
  { id: "pro-116", nome: "Projeto de Vida", codigo: "PRO-116", modalidade: "Ensino Médio", ativa: true },
  { id: "emp-117", nome: "Empreendedorismo", codigo: "EMP-117", modalidade: "Ensino Médio", ativa: true },
  { id: "rob-118", nome: "Robótica", codigo: "ROB-118", modalidade: "Ensino Médio", ativa: true },
  { id: "tec-119", nome: "Tecnologia", codigo: "TEC-119", modalidade: "Ensino Médio", ativa: true },
  { id: "mus-120", nome: "Música", codigo: "MUS-120", modalidade: "Ensino Médio", ativa: true },
  { id: "tea-121", nome: "Teatro", codigo: "TEA-121", modalidade: "Ensino Médio", ativa: true },
  { id: "dan-122", nome: "Dança", codigo: "DAN-122", modalidade: "Ensino Médio", ativa: true },
  { id: "amb-123", nome: "Educação Ambiental", codigo: "AMB-123", modalidade: "Ensino Médio", ativa: true },
  { id: "cid-124", nome: "Cidadania", codigo: "CID-124", modalidade: "Ensino Médio", ativa: true },
]

let disciplinasDb = disciplinasIniciais.map((d) => ({ ...d }))

const turmas = [
  { id: "3a-integral", nome: "3º Ano A — Integral" },
  { id: "2b-integral", nome: "2º Ano B — Integral" },
  { id: "1c-integral", nome: "1º Ano C — Integral" },
]

const professores = [
  "Ana Souza",
  "Carlos Lima",
  "Fernanda Alves",
  "João Pereira",
  "Marina Costa",
  "Paulo Henrique",
  "Rafaela Nunes",
]

const salas = ["Sala 101", "Sala 102", "Sala 203", "Laboratório 1", "Laboratório 2", "Auditório"]

const diasSemana = [
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
]

const cargaEsperadaMin = 9 * 60

const gradeInicial = {
  "3a-integral": {
    seg: {
      atividades: [
        { id: "a1", disciplina: "Matemática", professor: "Ana Souza", sala: "Sala 101", inicio: "07:30", fim: "08:20" },
        { id: "a2", disciplina: "Língua Portuguesa", professor: "Carlos Lima", sala: "Sala 101", inicio: "08:20", fim: "09:10" },
        { id: "a3", disciplina: "Física", professor: "Fernanda Alves", sala: "Laboratório 1", inicio: "09:30", fim: "10:20" },
        { id: "a4", disciplina: "Química", professor: "João Pereira", sala: "Laboratório 2", inicio: "10:20", fim: "11:10" },
        { id: "a5", disciplina: "História", professor: "Marina Costa", sala: "Sala 203", inicio: "11:10", fim: "12:00" },
        { id: "a6", disciplina: "Projeto de Vida", professor: "Paulo Henrique", sala: "Sala 101", inicio: "13:00", fim: "14:30" },
        { id: "a7", disciplina: "Robótica", professor: "Rafaela Nunes", sala: "Laboratório 1", inicio: "14:30", fim: "15:30" },
      ],
      intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" },
    },
    ter: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
    qua: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
    qui: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
    sex: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
  },
  "2b-integral": {
    seg: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
    ter: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
    qua: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
    qui: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
    sex: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
  },
  "1c-integral": {
    seg: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
    ter: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
    qua: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
    qui: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
    sex: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
  },
}

let gradeDb = JSON.parse(JSON.stringify(gradeInicial))

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function listarDisciplinas() {
  return simularRequisicao(() => clone(disciplinasDb), 600)
}

export function atualizarStatusDisciplina(id, ativa) {
  return simularRequisicao(() => {
    disciplinasDb = disciplinasDb.map((d) => (d.id === id ? { ...d, ativa } : d))
    const atualizada = disciplinasDb.find((d) => d.id === id)
    return clone(atualizada)
  }, 500)
}

export function obterOpcoesGrade() {
  return simularRequisicao(() => ({
    turmas: clone(turmas),
    diasSemana: clone(diasSemana),
    disciplinas: clone(disciplinasDb.filter((d) => d.ativa)),
    professores: [...professores],
    salas: [...salas],
    cargaEsperadaMin,
  }), 400)
}

export function obterGradeIntegral({ turmaId, dia }) {
  return simularRequisicao(() => {
    const turma = gradeDb[turmaId]
    const diaGrade = turma?.[dia]
    if (!diaGrade) {
      throw new Error("Grade não encontrada.")
    }
    return clone({
      turmaId,
      dia,
      ...diaGrade,
      cargaEsperadaMin,
    })
  }, 700)
}

export function salvarGradeIntegral({ turmaId, dia, atividades, intervalo }) {
  return simularRequisicao(() => {
    if (!gradeDb[turmaId]) {
      gradeDb[turmaId] = {}
    }
    gradeDb[turmaId][dia] = {
      atividades: clone(atividades),
      intervalo: clone(intervalo || { label: "Almoço", inicio: "12:00", fim: "13:00" }),
    }
    return clone({ turmaId, dia, ...gradeDb[turmaId][dia], cargaEsperadaMin })
  }, 600)
}

export function removerAtividade({ turmaId, dia, atividadeId }) {
  return simularRequisicao(() => {
    const diaGrade = gradeDb[turmaId]?.[dia]
    if (!diaGrade) throw new Error("Grade não encontrada.")
    diaGrade.atividades = diaGrade.atividades.filter((a) => a.id !== atividadeId)
    return clone(diaGrade)
  }, 400)
}
