import { Check, EllipsisVertical, UserRound } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function CardProfessor({ professor }) {
  const { fechamentoAno } = professor

  return (
    <article className="rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <UserRound aria-hidden="true" size={20} strokeWidth={1.7} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[15px] leading-5 font-semibold">
            {professor.nome}
          </h2>
          <p className="mt-1 truncate text-[11px] leading-4 text-muted-foreground">
            {professor.disciplina} • {professor.nivelEnsino}
          </p>
        </div>
        <button
          aria-label="Mais opções do professor"
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground"
          type="button"
        >
          <EllipsisVertical aria-hidden="true" size={20} />
        </button>
      </div>

      <div className="my-3 border-t border-border" />

      <div className="flex items-center justify-between gap-2 text-[12px] leading-4">
        <span className="font-semibold">{fechamentoAno.titulo}</span>
        <span className="shrink-0 font-bold text-primary">
          {fechamentoAno.percentualConcluido}% concluído
        </span>
      </div>
      <Progress
        aria-label={fechamentoAno.titulo}
        className="mt-2"
        value={fechamentoAno.percentualConcluido}
      />

      <div className="my-3 border-t border-border" />

      <p className="flex items-center gap-1.5 text-[11px] leading-4 text-teal-800">
        <Check aria-hidden="true" className="shrink-0" size={14} strokeWidth={2.5} />
        <span>
          Diários em dia para {fechamentoAno.turmasEmDia} de{" "}
          {fechamentoAno.totalTurmas} turmas
        </span>
      </p>
    </article>
  )
}
