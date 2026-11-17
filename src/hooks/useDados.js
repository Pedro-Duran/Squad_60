import { useEffect, useState } from "react"

export function useDados(buscar) {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true

    buscar()
      .then((resultado) => {
        if (ativo) setDados(resultado)
      })
      .catch((erroDaBusca) => {
        if (ativo) setErro(erroDaBusca)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [buscar, tentativa])

  function recarregar() {
    setCarregando(true)
    setErro(null)
    setTentativa((valor) => valor + 1)
  }

  return { dados, carregando, erro, recarregar }
}
