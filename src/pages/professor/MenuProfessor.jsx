import {
  BookOpen,
  Calendar,
  CalendarDays,
  Check,
  ClipboardList,
  Plus,
} from "lucide-react"
import CardProfessor from "@/components/professor/CardProfessor"
import AppShell from "@/components/shared/AppShell"
import ItemMenu from "@/components/shared/ItemMenu"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useDados } from "@/hooks/useDados"
import { buscarProfessor } from "@/services/professorService"

const PROFESSOR_LOGADO_ID = "prof-001"

const buscarProfessorLogado = () => buscarProfessor(PROFESSOR_LOGADO_ID)

const itensMenu = [
  {
    icone: Calendar,
    titulo: "Aulas de Hoje",
    descricao: "Controle de frequência e conteúdo do dia",
    rota: "/professor/aulas-hoje",
    destaque: true,
  },
  {
    icone: CalendarDays,
    titulo: "Aulas da Semana",
    descricao: "Cronograma de aulas e planejamento semanal",
    rota: "/professor/aulas-semana",
  },
  {
    icone: ClipboardList,
    titulo: "Lista de Presença",
    descricao: "Registro de frequência por turma",
    rota: "/professor/presenca",
  },
  {
    icone: BookOpen,
    titulo: "Diário Eletrônico",
    descricao: "Lançamentos de notas e ocorrências",
    rota: "/professor/diario",
  },
  {
    icone: Plus,
    titulo: "Solicitar Aula Excepcional",
    descricao: "Substituições, reposições ou eventos extras",
    rota: "/professor/solicitacoes/nova",
  },
]

export default function MenuProfessor() {
  const { dados: professor, carregando, erro, recarregar } =
    useDados(buscarProfessorLogado)

  return (
    <AppShell professor={professor}>
      <main className="bg-menu-surface px-4 py-4">
        <div className="mx-auto flex w-full max-w-[390px] flex-col gap-4">
          {carregando ? (
            <div
              aria-label="Carregando dados do professor"
              className="rounded-2xl bg-card p-4 shadow-sm"
            >
              <Skeleton className="h-11 w-full" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-2 w-full" />
              <Skeleton className="mt-4 h-4 w-3/4" />
            </div>
          ) : erro ? (
            <section
              aria-live="polite"
              className="rounded-2xl bg-card p-4 shadow-sm"
              role="alert"
            >
              <p className="text-sm font-semibold">
                Não foi possível carregar o menu.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {erro instanceof Error ? erro.message : String(erro)}
              </p>
              <Button className="mt-3" onClick={recarregar}>
                Tentar novamente
              </Button>
            </section>
          ) : (
            <CardProfessor professor={professor} />
          )}

          <nav aria-label="Menu do professor" className="flex flex-col gap-4">
            {itensMenu.map((item) => (
              <ItemMenu key={item.rota} {...item} />
            ))}
          </nav>

          <p className="flex min-h-10 items-center gap-2 rounded-lg border border-professor-navy/10 bg-professor-navy/5 px-3 text-[11px] leading-4 text-foreground">
            <Check
              aria-hidden="true"
              className="shrink-0 text-teal-800"
              size={15}
              strokeWidth={2.5}
            />
            Sincronização concluída com o servidor central SEDUC.
          </p>
        </div>
      </main>
    </AppShell>
  )
}
