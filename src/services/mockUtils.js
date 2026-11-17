// Simula uma requisição a um "back-end" com um pequeno atraso.
// Para testar estados, lê ?estado= da URL:
//   ?estado=carregando  -> a promessa nunca resolve (fica em "carregando")
//   ?estado=erro        -> a promessa rejeita (mostra o estado de erro)
// O segundo parâmetro pode ser o atraso (número) ou opções:
//   { atraso, erroEm, mensagemErro }
// `erroEm` define um gatilho de erro próprio, para falhar sem derrubar o
// carregamento — ex.: ?estado=erro-envio só no envio da presença.
export function simularRequisicao(operacao, opcoes = 500) {
  const {
    atraso = 500,
    erroEm,
    mensagemErro = "Falha de conexão. Tente novamente.",
  } = typeof opcoes === "number" ? { atraso: opcoes } : opcoes

  return new Promise((resolve, reject) => {
    const estado = new URLSearchParams(window.location.search).get("estado")

    if (estado === "carregando") return // nunca resolve

    setTimeout(() => {
      if (estado === "erro" || (erroEm && estado === erroEm)) {
        reject(new Error(mensagemErro))
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
