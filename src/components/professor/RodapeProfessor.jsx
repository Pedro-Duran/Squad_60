import { BookOpen, CalendarDays, House } from "lucide-react"
import { Link } from "react-router"

const ITENS_RODAPE = [
  {
    icone: House,
    titulo: "Início",
    rota: "/professor",
  },
  {
    icone: CalendarDays,
    titulo: "Solicitações",
    rota: "/professor/solicitacoes",
  },
  {
    icone: BookOpen,
    titulo: "Registros",
    rota: "/professor/diario",
  },
]

export default function RodapeProfessor({ ativo }) {
  return (
    <footer className="bg-professor-navy text-white">
      <nav
        aria-label="Navegação principal do professor"
        className="mx-auto grid min-h-[60px] w-full max-w-[390px] grid-cols-3"
      >
        {ITENS_RODAPE.map(({ icone: Icone, titulo, rota }) => {
          const selecionado = ativo === rota
          return (
            <Link
              aria-current={selecionado ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] ${
                selecionado ? "text-primary" : "text-slate-400"
              }`}
              key={titulo}
              to={rota}
            >
              <Icone aria-hidden="true" size={20} strokeWidth={1.8} />
              <span>{titulo}</span>
            </Link>
          )
        })}
      </nav>
      <p className="border-t border-white/10 py-2 text-center text-[10px] text-slate-500">
        ©2026 Desenvolvido por SQUAD 60
      </p>
    </footer>
  )
}
