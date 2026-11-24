import { useCallback, useEffect, useState } from "react"

export function useDados(buscarDados) {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true

    Promise.resolve()
      .then(() => {
        if (ativo) {
          setCarregando(true)
          setErro(null)
        }
        return buscarDados()
      })
      .then((resultado) => {
        if (ativo) setDados(resultado)
      })
      .catch((erroBusca) => {
        if (ativo) setErro(erroBusca)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [buscarDados, tentativa])

  const recarregar = useCallback(() => {
    setCarregando(true)
    setTentativa((valor) => valor + 1)
  }, [])

  return { dados, carregando, erro, recarregar }
}
