import { ArrowLeft, BookOpen, CalendarDays, House } from "lucide-react"
import { Link } from "react-router"

const itensRodape = [
  {
    icone: House,
    titulo: "Início",
    rota: "/professor",
    ativo: true,
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

export default function AppShell({ children, professor }) {
  const tratamento = professor?.genero === "F" ? "Professora" : "Professor"
  const saudacao = professor
    ? `Seja bem-vinda${professor.genero === "F" ? "" : "o"}, ${tratamento} ${professor.nomeCurto}!`
    : "Seja bem-vinda!"

  return (
    <div className="flex min-h-screen flex-col bg-menu-surface">
      <header className="bg-professor-navy px-4 pt-5 pb-4 text-white">
        <div className="mx-auto w-full max-w-[390px]">
          <div className="flex items-center justify-between">
            <Link
              aria-label="Voltar ao menu do professor"
              className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide"
              to="/professor"
            >
              <ArrowLeft aria-hidden="true" size={16} strokeWidth={2.5} />
              SEDUC · SERGIPE
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-emerald-300"
              />
              CONECTADO
            </span>
          </div>
          <h1 className="mt-4 text-2xl leading-7 font-bold">Menu do Professor</h1>
          <p className="mt-2 text-sm leading-5 text-white/70">{saudacao}</p>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="bg-professor-navy text-white">
        <nav
          aria-label="Navegação principal do professor"
          className="mx-auto grid min-h-[60px] w-full max-w-[390px] grid-cols-3"
        >
          {itensRodape.map(({ icone: Icone, titulo, rota, ativo }) => (
            <Link
              aria-current={ativo ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] ${
                ativo ? "text-primary" : "text-slate-400"
              }`}
              key={titulo}
              to={rota}
            >
              <Icone aria-hidden="true" size={20} strokeWidth={1.8} />
              <span>{titulo}</span>
            </Link>
          ))}
        </nav>
        <p className="border-t border-white/10 py-2 text-center text-[10px] text-slate-500">
          ©2026 Desenvolvido por SQUAD 60
        </p>
      </footer>
    </div>
  )
}
