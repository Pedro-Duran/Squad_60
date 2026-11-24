export function simularRequisicao(produzir) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try { resolve(produzir()) } catch (erro) { reject(erro) }
    }, 350)
  })
}
