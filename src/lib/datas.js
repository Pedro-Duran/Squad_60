// Todas as datas do projeto são strings "AAAA-MM-DD".
// Sempre converta com paraDate(), nunca com new Date("AAAA-MM-DD") (o fuso muda o dia).

export function paraDate(data) {
  const [ano, mes, dia] = data.split("-").map(Number)
  return new Date(ano, mes - 1, dia)
}

function paraTexto(d) {
  const mes = String(d.getMonth() + 1).padStart(2, "0")
  const dia = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${mes}-${dia}`
}

// "2026-09-14", 1 → "2026-09-15"
export function somarDias(data, dias) {
  const d = paraDate(data)
  d.setDate(d.getDate() + dias)
  return paraTexto(d)
}

// segunda-feira da semana da data
export function inicioDaSemana(data) {
  const diaDaSemana = paraDate(data).getDay() // 0 = domingo, 1 = segunda...
  const recuo = diaDaSemana === 0 ? 6 : diaDaSemana - 1
  return somarDias(data, -recuo)
}

// "2026-09-14" → "Segunda-feira"
export function nomeDiaSemana(data) {
  const nome = paraDate(data).toLocaleDateString("pt-BR", { weekday: "long" })
  return nome.charAt(0).toUpperCase() + nome.slice(1)
}

// "2026-09-14" → "SEG"
export function siglaDiaSemana(data) {
  return paraDate(data)
    .toLocaleDateString("pt-BR", { weekday: "short" })
    .replace(".", "")
    .toUpperCase()
}

// "2026-09-14" → "14 de setembro"
export function formatarDiaMes(data) {
  return paraDate(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })
}

// "2026-09-14" + "07:00" → "SEGUNDA · 14/09/2026 · 07:00"
export function formatarDataAula(data, horario) {
  const d = paraDate(data)
  const diaSemana = d.toLocaleDateString("pt-BR", { weekday: "long" }).split("-")[0]
  return `${diaSemana.toUpperCase()} · ${d.toLocaleDateString("pt-BR")} · ${horario}`
}

// "2026-09-14" → "Segunda, 14 de setembro de 2026"
export function formatarDataExtensa(data) {
  const d = paraDate(data)
  const dia = d.toLocaleDateString("pt-BR", { weekday: "long" }).split("-")[0]
  const resto = d.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })
  return `${dia.charAt(0).toUpperCase() + dia.slice(1)}, ${resto}`
}

// "2026-09-14" → "14/09/2026"
export function formatarDataCurta(data) {
  return paraDate(data).toLocaleDateString("pt-BR")
}
