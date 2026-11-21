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
