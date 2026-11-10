import { Link, useLocation } from "react-router"
import { ChevronRight } from "lucide-react"

export function ItemAluno({ aluno }) {
  const location = useLocation()

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
          Matrícula: {aluno.matricula} • Turma: {aluno.turma}
        </p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-slate-400 transition-colors group-hover:text-primary" />
    </Link>
  )
}
