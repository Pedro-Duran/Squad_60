import { ChevronRight } from "lucide-react"
import { Link } from "react-router"

export default function ItemMenu({
  icone: Icone,
  titulo,
  descricao,
  rota,
}) {
  return (
    <Link
      className="group flex min-h-[74px] items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-colors hover:border-primary active:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      to={rota}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary group-active:bg-primary/10 group-active:text-primary group-focus-visible:bg-primary/10 group-focus-visible:text-primary"
      >
        <Icone aria-hidden="true" size={19} strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] leading-5 font-semibold">{titulo}</span>
        <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">
          {descricao}
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary group-active:text-primary group-focus-visible:text-primary"
        size={18}
        strokeWidth={2.5}
      />
    </Link>
  )
}
