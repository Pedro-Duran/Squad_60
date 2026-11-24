const aguardar = (tempo) =>
  new Promise((resolve) => setTimeout(resolve, tempo))

export async function simularRequisicao(buscarDados) {
  const estado = new URLSearchParams(window.location.search).get("estado")

  if (estado === "erro") {
    throw new Error("Falha ao carregar os dados.")
  }

  await aguardar(estado === "carregando" ? 5000 : 250)
  return buscarDados()
}
