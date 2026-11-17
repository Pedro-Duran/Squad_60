import { Button } from "@/components/ui/button"

export default function EstadoErro({ titulo, descricao, textoBotao, onTentarNovamente }) {
  return (
    <section
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 text-center shadow-sm"
    >
      <h2 className="font-semibold text-foreground">{titulo}</h2>
      {descricao && <p className="text-sm text-muted-foreground">{descricao}</p>}
      <Button type="button" className="rounded-full px-6" onClick={onTentarNovamente}>
        {textoBotao}
      </Button>
    </section>
  )
}
