import { EllipsisVertical, UserRound } from "lucide-react"

export default function CardUsuario({ nome, descricao, children }) {
  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
          <UserRound aria-hidden="true" className="size-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-foreground">{nome}</p>
          <p className="truncate text-[11px] text-muted-foreground">{descricao}</p>
        </div>
        <EllipsisVertical className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      </div>
      {children}
    </section>
  )
}
