import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import RodapeProfessor from "@/components/professor/RodapeProfessor"
import { useAuth } from "@/hooks/useAuth"

export default function AppShell({ children, professor }) {
  const { sair } = useAuth()
  const tratamento = professor?.genero === "F" ? "Professora" : "Professor"
  const saudacao = professor
    ? `Seja ${professor.genero === "F" ? "bem-vinda" : "bem-vindo"}, ${tratamento} ${professor.nomeCurto}!`
    : "Seja bem-vinda!"

  return (
    <div className="flex min-h-screen flex-col bg-menu-surface">
      <header className="bg-professor-navy px-4 pt-5 pb-4 text-white">
        <div className="mx-auto w-full max-w-[390px]">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide">
              <Link
                aria-label="Sair e voltar ao login"
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                onClick={sair}
                to="/login"
              >
                <ArrowLeft aria-hidden="true" size={16} strokeWidth={2.5} />
              </Link>
              <span>SEDUC · SERGIPE</span>
            </div>
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

      <RodapeProfessor ativo="/professor" />
    </div>
  )
}
