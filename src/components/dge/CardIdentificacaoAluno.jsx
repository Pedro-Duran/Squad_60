import { Badge } from "@/components/ui/badge"
import { iniciaisDoNome } from "@/lib/texto"

export default function CardIdentificacaoAluno({ aluno }) {
  return (
    <section className="rounded-2xl bg-card p-6 text-center text-card-foreground shadow-sm">
      <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
        {iniciaisDoNome(aluno.nome)}
      </div>
      <h2 className="mt-4 text-lg font-semibold">{aluno.nome}</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Matrícula nº {aluno.matricula}
      </p>
      <Badge variant="status" className="mt-3 px-3 font-semibold tracking-wide">
        {aluno.situacao.toUpperCase()}
      </Badge>
    </section>
  )
}
