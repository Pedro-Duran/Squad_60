import { useCallback, useEffect, useState } from 'react'

export default function useDados(buscar) {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [versao, setVersao] = useState(0)

  const recarregar = useCallback(() => setVersao((v) => v + 1), [])

  useEffect(() => {
    let ativo = true
    // Schedule the request asynchronously, avoiding synchronous state updates in the effect.
    Promise.resolve().then(() => {
      if (!ativo) return null
      setCarregando(true)
      setErro(null)
      return buscar()
    }).then((resultado) => {
      if (ativo) setDados(resultado)
    }).catch((falha) => {
      if (ativo) setErro(falha)
    }).finally(() => {
      if (ativo) setCarregando(false)
    })
    return () => { ativo = false }
  }, [buscar, versao])

  return { dados, carregando, erro, recarregar }
}
