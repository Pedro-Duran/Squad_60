import { Link, useLocation } from "react-router"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ItemAluno({ aluno, acao }) {
  const location = useLocation()

  if (acao) {
    const IconeAcao = acao.icone

    return (
      <article className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-2 shadow-sm">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-foreground">{aluno.nome}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Matrícula: {aluno.matricula}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          aria-label={acao.label}
          onClick={acao.onClick}
          className="size-9 shrink-0 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <IconeAcao aria-hidden="true" className="size-5" />
        </Button>
      </article>
    )
  }

  return (
    <Link
      to={`/dge/alunos/${aluno.id}`}
      state={{ from: `${location.pathname}${location.search}` }}
      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-primary"
    >
      <div>
        <h2 className="font-semibold text-slate-900 transition-colors group-hover:text-primary">
          {aluno.nome}
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Matrícula: {aluno.matricula} • Turma:{" "}
          {aluno.turma
            ? [aluno.serie, aluno.turma].filter(Boolean).join(" ") || "Sem turma"
            : `${aluno.serie} · Sem turma`}
        </p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-slate-400 transition-colors group-hover:text-primary" />
    </Link>
  )
}
