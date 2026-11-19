export function paraDate(data) {
  const [ano, mes, dia] = data.split('-').map(Number)
  return new Date(ano, mes - 1, dia, 12)
}
export function formatarDataExtensa(data) {
  const d = paraDate(data)
  const dia = d.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0]
  const resto = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  return `${dia.charAt(0).toUpperCase() + dia.slice(1)}, ${resto}`
}
export function formatarDataCurta(data) {
  return paraDate(data).toLocaleDateString('pt-BR')
}

export function formatarDataAula(data, horario) {
  const dataObj = data ? paraDate(data) : new Date()
  const horarioAtual =
    horario ??
    dataObj.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  const diaSemana = dataObj
    .toLocaleDateString('pt-BR', { weekday: 'long' })
    .split('-')[0]

  return `${diaSemana.toUpperCase()} · ${dataObj.toLocaleDateString('pt-BR')} · ${horarioAtual}`
}

function paraTexto(d) {
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
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
  const nome = paraDate(data).toLocaleDateString('pt-BR', { weekday: 'long' })
  return nome.charAt(0).toUpperCase() + nome.slice(1)
}

// "2026-09-14" → "SEG"
export function siglaDiaSemana(data) {
  return paraDate(data)
    .toLocaleDateString('pt-BR', { weekday: 'short' })
    .replace('.', '')
    .toUpperCase()
}

// "2026-09-14" → "14 de setembro"
export function formatarDiaMes(data) {
  return paraDate(data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
}
