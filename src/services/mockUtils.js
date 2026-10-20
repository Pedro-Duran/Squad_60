export function simularRequisicao(operacao, atraso = 500) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const forcarErro =
        new URLSearchParams(window.location.search).get("estado") === "erro"

      if (forcarErro) {
        reject(new Error("Falha de conexão. Tente novamente."))
        return
      }

      try {
        resolve(operacao())
      } catch (erro) {
        reject(erro)
      }
    }, atraso)
  })
}