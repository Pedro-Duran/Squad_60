import { BookOpen, CalendarDays, House } from "lucide-react"

function NavegacaoInferior() {
  const itens = [
    { label: "Início", Icone: House },
    { label: "Solicitações", Icone: CalendarDays, ativa: true },
    { label: "Registros", Icone: BookOpen },
  ]

  return (
    <footer className="fixed inset-x-0 bottom-0 z-20">
      <nav
        aria-label="Navegação principal"
        className="grid grid-cols-3 items-center bg-white px-4 py-2"
      >
        {itens.map(({ label, Icone, ativa }) => (
          <a
            key={label}
            href="#"
            aria-current={ativa ? "page" : undefined}
            className={`mx-auto flex min-w-[96px] flex-col items-center justify-center gap-0.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
              ativa ? "bg-footer-active text-primary" : "text-footer-muted"
            }`}
          >
            <Icone className="size-[19px]" aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <p className="bg-navy px-4 py-3 text-center text-[11px] text-white/50">
        ©2026 Desenvolvido por SQUAD 60
      </p>
    </footer>
  )
}

export default function DgeAppShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-[100px]">
      {children}
      <NavegacaoInferior />
    </div>
  )
}
