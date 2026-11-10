export function formatarDataAula(data, horario) {
  const dataObj = data
    ? (() => {
        const [ano, mes, dia] = data.split("-").map(Number)
        return new Date(ano, mes - 1, dia)
      })()
    : new Date()

  const horarioAtual =
    horario ??
    dataObj.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

  const diaSemana = dataObj
    .toLocaleDateString("pt-BR", { weekday: "long" })
    .split("-")[0]
  const dataBR = dataObj.toLocaleDateString("pt-BR")

  return `${diaSemana.toUpperCase()} · ${dataBR} · ${horarioAtual}`
}
