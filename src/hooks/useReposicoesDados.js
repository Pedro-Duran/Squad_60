import { useEffect } from "react"
import { useDados } from "@/hooks/useDados"
import { EVENTO_REPOSICOES_ATUALIZADAS } from "@/services/reposicaoService"

export function useReposicoesDados(buscar) {
  const estado = useDados(buscar)
  const { recarregar } = estado

  useEffect(() => {
    const atualizar = () => recarregar()
    window.addEventListener(EVENTO_REPOSICOES_ATUALIZADAS, atualizar)
    window.addEventListener("storage", atualizar)

    return () => {
      window.removeEventListener(EVENTO_REPOSICOES_ATUALIZADAS, atualizar)
      window.removeEventListener("storage", atualizar)
    }
  }, [recarregar])

  return estado
}
