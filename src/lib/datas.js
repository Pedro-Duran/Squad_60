function paraDate(data) {
  const [ano, mes, dia] = data.split("-").map(Number)
  return new Date(ano, mes - 1, dia)
}

function paraTexto(data) {
  const mes = String(data.getMonth() + 1).padStart(2, "0")
  const dia = String(data.getDate()).padStart(2, "0")
  return `${data.getFullYear()}-${mes}-${dia}`
}

export function somarDias(data, dias) {
  const resultado = paraDate(data)
  resultado.setDate(resultado.getDate() + dias)
  return paraTexto(resultado)
}

export function inicioDaSemana(data) {
  const diaDaSemana = paraDate(data).getDay()
  const recuo = diaDaSemana === 0 ? 6 : diaDaSemana - 1
  return somarDias(data, -recuo)
}

export function nomeDiaSemana(data) {
  const nome = paraDate(data).toLocaleDateString("pt-BR", {
    weekday: "long",
  })
  return nome.charAt(0).toUpperCase() + nome.slice(1)
}

export function siglaDiaSemana(data) {
  return paraDate(data)
    .toLocaleDateString("pt-BR", { weekday: "short" })
    .replace(".", "")
    .toUpperCase()
}

export function formatarDiaMes(data) {
  return paraDate(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  })
}

export function formatarDataAula(data, horario) {
  const dataLocal = paraDate(data)
  const diaSemana = dataLocal
    .toLocaleDateString("pt-BR", { weekday: "long" })
    .split("-")[0]
  return `${diaSemana.toUpperCase()} · ${dataLocal.toLocaleDateString("pt-BR")} · ${horario}`
}
