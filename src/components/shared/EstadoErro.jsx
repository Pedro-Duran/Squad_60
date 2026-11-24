import { useState } from "react"
import { RefreshCw, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

const descricaoPadrao =
  "Verifique sua conexão com a internet ou tente novamente em instantes."

export function EstadoErro({
  nome,
  descricao = descricaoPadrao,
  onTentarNovamente,
}) {
  const [carregando, setCarregando] = useState(false)

  async function tentarNovamente() {
    if (carregando) return

    setCarregando(true)
    try {
      await onTentarNovamente?.()
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section
      role="alert"
      className="flex min-h-full flex-1 flex-col items-center px-4 pt-[clamp(56px,10vh,88px)] text-center"
    >
      <div className="flex size-[72px] items-center justify-center rounded-full bg-error-soft">
        <TriangleAlert
          aria-hidden="true"
          className="size-8 text-destructive"
        />
      </div>

      <h1 className="mt-8 max-w-[320px] text-base font-bold leading-tight text-foreground">
        Erro ao carregar {nome}
      </h1>

      <p className="mt-3 max-w-[320px] text-[13px] leading-5 text-muted-foreground">
        {descricao}
      </p>

      <Button
        type="button"
        size="lg"
        disabled={carregando}
        onClick={tentarNovamente}
        className="mt-5 h-12 rounded-full px-8 text-base font-bold"
      >
        <RefreshCw
          aria-hidden="true"
          className="size-[14px]"
        />
        {carregando ? "Carregando..." : "Tentar novamente"}
      </Button>
    </section>
  )
}
