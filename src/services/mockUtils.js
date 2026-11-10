export function simularRequisicao(callback, delay = 450) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(callback())
      } catch (error) {
        reject(error)
      }
    }, delay)
  })
}
