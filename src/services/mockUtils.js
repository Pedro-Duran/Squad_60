export function simularRequisicao(callback) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(callback()), 350)
  })
}
