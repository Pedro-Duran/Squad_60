import { ChevronRight } from "lucide-react"
import { Link } from "react-router"

export default function ItemMenu({
  icone: Icone,
  titulo,
  descricao,
  rota,
  destaque = false,
}) {
  return (
    <Link
      className={`flex min-h-[74px] items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
        destaque ? "border-primary" : "border-border"
      }`}
      to={rota}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
          destaque
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-professor-navy"
        }`}
      >
        <Icone aria-hidden="true" size={19} strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] leading-5 font-semibold">
          {titulo}
        </span>
        <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">
          {descricao}
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="shrink-0 text-muted-foreground"
        size={18}
        strokeWidth={2.5}
      />
    </Link>
  )
}
