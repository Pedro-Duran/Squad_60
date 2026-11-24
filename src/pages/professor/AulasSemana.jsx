import { ChevronLeft, Clipboard, ClipboardList, Home } from "lucide-react"
import { Link } from "react-router"

import { CelulaAula } from "@/components/professor/CelulaAula"
import { LegendaTurmas } from "@/components/professor/LegendaTurmas"
import { EstadoErro } from "@/components/shared/EstadoErro"
import { Skeleton } from "@/components/ui/skeleton"
import { useDados } from "@/hooks/useDados"
import { inicioDaSemana, siglaDiaSemana, somarDias } from "@/lib/datas"
import { HORARIOS_MANHA } from "@/lib/horarios"
import { listarAulasDaSemana } from "@/services/aulaService"

const PROFESSOR_LOGADO_ID = "prof-001"
const SEGUNDA = inicioDaSemana("2026-09-14")
const DIAS = [0, 1, 2, 3, 4, 5].map((n) => somarDias(SEGUNDA, n))
const buscarSemana = () =>
  listarAulasDaSemana(PROFESSOR_LOGADO_ID, SEGUNDA)

const classesDasCores = [
  ["bg-turma-1", "text-white"],
  ["bg-turma-2", "text-white"],
  ["bg-turma-3", "text-foreground"],
]

function BarraStatus() {
  return (
    <div className="flex h-10 items-center justify-between px-5 text-xs font-bold text-foreground">
      <span>09:41</span>
      <span aria-hidden="true" className="flex items-center gap-1">
        <span className="h-2.5 w-3.5 rounded-sm border border-current border-b-0" />
        <span className="h-2.5 w-2.5 rounded-full border-2 border-current" />
      </span>
    </div>
  )
}

function AppShell({ children }) {
  return (
    <div className="min-h-dvh bg-muted/20">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background shadow-sm">
        <header className="shrink-0 border-b border-border">
          <BarraStatus />
          <div className="flex h-[62px] items-center gap-3 px-5">
            <Link
              to="/"
              aria-label="Voltar"
              className="flex size-10 items-center justify-center rounded-full bg-muted"
            >
              <ChevronLeft className="size-5 text-foreground" aria-hidden="true" />
            </Link>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                SEDUC · SERGIPE
              </p>
              <h1 className="mt-0.5 text-lg font-bold leading-none text-foreground">
                Aulas da semana
              </h1>
            </div>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-x-hidden px-4 pb-4 pt-4">
          {children}
        </main>

        <footer className="grid h-[88px] shrink-0 grid-cols-3 border-t border-border bg-background px-2 pt-3 text-center">
          <Link to="/" className="flex flex-col items-center gap-1 text-primary">
            <Home className="size-5" aria-hidden="true" />
            <span className="text-xs font-bold">Início</span>
          </Link>
          <Link
            to="/professor/solicitacoes"
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <ClipboardList className="size-5" aria-hidden="true" />
            <span className="text-xs">Solicitações</span>
          </Link>
          <Link
            to="/professor/registros"
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <Clipboard className="size-5" aria-hidden="true" />
            <span className="text-xs">Registros</span>
          </Link>
        </footer>
      </div>
    </div>
  )
}

function TabelaCarregando() {
  return (
    <div className="overflow-x-auto" aria-label="Carregando aulas" aria-busy="true">
      <div className="grid min-w-[358px] grid-cols-[32px_repeat(6,46px)] gap-2">
        {Array.from({ length: 42 }, (_, indice) => (
          <Skeleton
            key={indice}
            className={indice < 7 ? "h-7 w-[46px] rounded-full" : "h-12 w-[46px]"}
          />
        ))}
      </div>
    </div>
  )
}

export default function AulasSemana() {
  const { dados: aulas, carregando, erro, recarregar } = useDados(buscarSemana)

  let conteudo
  if (carregando) {
    conteudo = <TabelaCarregando />
  } else if (erro) {
    conteudo = (
      <EstadoErro nome="as aulas da semana" onTentarNovamente={recarregar} />
    )
  } else {
    const turmas = [...new Set(aulas.map((aula) => aula.turma))].sort()
    const aulaEm = (data, horario) =>
      aulas.find((aula) => aula.data === data && aula.horario === horario)

    conteudo = (
      <>
        <div className="overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[358px] table-fixed border-separate border-spacing-x-1 border-spacing-y-1">
            <caption className="mb-3 text-left text-[22px] font-bold text-foreground">
              Aulas da semana
            </caption>
            <colgroup>
              <col className="w-8" />
              {DIAS.map((dia) => (
                <col key={dia} className="w-[46px]" />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th scope="col" aria-label="Horário" />
                {DIAS.map((dia) => (
                  <th key={dia} scope="col" className="pb-1">
                    <Link
                      to={`/professor/aulas-hoje?data=${dia}`}
                      className="flex h-7 items-center justify-center rounded-lg bg-turma-1 text-[11px] font-bold text-white"
                    >
                      {siglaDiaSemana(dia)}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HORARIOS_MANHA.map((horario) =>
                horario.intervalo ? (
                  <tr key={horario.inicio}>
                    <th
                      scope="row"
                      className="whitespace-nowrap pr-1 text-right text-[11px] font-normal text-muted-foreground"
                    >
                      {horario.inicio}
                    </th>
                    <td colSpan={6}>
                      <div className="flex h-7 items-center justify-center rounded-lg bg-turma-1 text-[10px] font-bold tracking-wide text-white">
                        INTERVALO
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={horario.inicio}>
                    <th
                      scope="row"
                      className="whitespace-nowrap pr-1 text-right text-[11px] font-normal text-muted-foreground"
                    >
                      {horario.inicio}
                    </th>
                    {DIAS.map((dia) => {
                      const aula = aulaEm(dia, horario.inicio)
                      if (!aula) {
                        return (
                          <td key={dia}>
                            <div
                              aria-hidden="true"
                              className="h-12 w-[46px] rounded-lg border border-border"
                            />
                          </td>
                        )
                      }

                      const indiceTurma = turmas.indexOf(aula.turma)
                      const [cor, texto] =
                        classesDasCores[indiceTurma] ?? classesDasCores[0]

                      return (
                        <td key={dia}>
                          <CelulaAula aula={aula} cor={cor} texto={texto} />
                        </td>
                      )
                    })}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        <LegendaTurmas turmas={turmas} />
      </>
    )
  }

  return (
    <AppShell>
      {conteudo}
    </AppShell>
  )
}
