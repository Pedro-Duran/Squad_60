const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function simularRequisicao(obterDados, atraso = 600) {
  const estado = new URLSearchParams(window.location.search).get("estado")

  if (estado === "carregando") await esperar(60_000)

  await esperar(atraso)

  if (estado === "erro") {
    throw new Error("Falha simulada na requisição")
  }

  return obterDados()
}
