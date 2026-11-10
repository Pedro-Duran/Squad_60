export function simularRequisicao(callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(callback())
      } catch (error) {
        reject(error)
      }
    }, 350)
  })
}
