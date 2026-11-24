import { useState } from "react"
import {
  ChevronDown,
  ChevronLeft,
  Clipboard,
  ClipboardList,
  Home,
  Users,
} from "lucide-react"

import { EstadoErro } from "@/components/shared/EstadoErro"

function StatusBar() {
  return (
    <div className="flex h-10 items-center justify-between px-5 text-xs font-bold text-foreground">
      <span>09:41</span>
      <div className="flex items-center gap-1" aria-hidden="true">
        <span className="h-2.5 w-3.5 rounded-sm border border-current border-b-0" />
        <span className="h-2.5 w-2.5 rounded-full border-2 border-current" />
      </div>
    </div>
  )
}

function TelaAulasIntegrais() {
  return (
    <div className="min-h-dvh bg-muted/20">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background shadow-sm">
        <header>
          <StatusBar />
          <div className="flex h-[62px] items-center gap-3 px-5">
            <ChevronLeft className="size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
                SEDUC · SERGIPE
              </p>
              <h1 className="mt-0.5 text-lg font-bold leading-none text-foreground">
                Aulas integrais
              </h1>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col overflow-hidden px-4 pb-2">
          <button
            type="button"
            className="flex h-12 w-full items-center rounded-xl border border-border bg-background px-4 text-left"
          >
            <Users className="mr-3 size-5 text-primary" aria-hidden="true" />
            <span className="flex-1 text-sm font-medium">
              3º Ano A — Integral
            </span>
            <ChevronDown className="size-4 text-primary" aria-hidden="true" />
          </button>

          <nav className="mt-4 grid grid-cols-5 gap-2" aria-label="Dias da semana">
            {["Seg", "Ter", "Qua", "Qui", "Sex"].map((dia, index) => (
              <button
                key={dia}
                type="button"
                className={
                  index === 0
                    ? "h-10 rounded-full bg-primary text-sm font-bold text-primary-foreground"
                    : "h-10 rounded-full border border-border bg-background text-sm text-muted-foreground"
                }
              >
                {dia}
              </button>
            ))}
          </nav>

          <EstadoErro
            nome="a grade de aulas integrais"
            onTentarNovamente={() => new Promise((resolve) => setTimeout(resolve, 900))}
          />
        </main>

        <footer className="grid h-[88px] grid-cols-3 border-t border-border bg-background px-2 pt-3 text-center">
          <button type="button" className="flex flex-col items-center gap-1 text-primary">
            <Home className="size-5" aria-hidden="true" />
            <span className="text-xs font-bold">Início</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1 text-muted-foreground">
            <ClipboardList className="size-5" aria-hidden="true" />
            <span className="text-xs">Solicitações</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1 text-muted-foreground">
            <Clipboard className="size-5" aria-hidden="true" />
            <span className="text-xs">Registros</span>
          </button>
        </footer>
      </div>
    </div>
  )
}

function VitrineEstadoErro() {
  const [exemploAtivo, setExemploAtivo] = useState("aulas")

  return (
    <main className="min-h-dvh bg-muted/20 p-4">
      <div className="mx-auto max-w-[430px] rounded-2xl border border-border bg-background p-4">
        <h1 className="text-lg font-bold text-foreground">Estado de erro</h1>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setExemploAtivo("aulas")}
            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
          >
            Aulas
          </button>
          <button
            type="button"
            onClick={() => setExemploAtivo("historico")}
            className="rounded-full border border-border px-4 py-2 text-sm"
          >
            Histórico
          </button>
        </div>
        <div className="mt-4 min-h-[360px] border-t border-border">
          {exemploAtivo === "aulas" ? (
            <EstadoErro
              nome="as aulas de hoje"
              onTentarNovamente={() => new Promise((resolve) => setTimeout(resolve, 900))}
            />
          ) : (
            <EstadoErro
              nome="o histórico escolar"
              onTentarNovamente={() => new Promise((resolve) => setTimeout(resolve, 900))}
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default function App() {
  if (window.location.pathname === "/dev/componentes") {
    return <VitrineEstadoErro />
  }

  return <TelaAulasIntegrais />
}