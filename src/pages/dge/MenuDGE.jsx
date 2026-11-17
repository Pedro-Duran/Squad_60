import { useSearchParams } from "react-router"
import { BookOpen, Calendar, Check, FileText, LayoutGrid, List, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import AppShell from "@/components/dge/AppShellDge"
import CardUsuario from "@/components/shared/CardUsuario"
import EstadoErro from "@/components/dge/EstadoErroDge"
import ItemMenu from "@/components/dge/ItemMenuDge"
import { useDados } from "@/hooks/useDados"
import { buscarGestor, definirGestorAtivo } from "@/services/gestorService"

const GESTOR_LOGADO_ID = "ges-001"
const buscarGestorLogado = () => {
  definirGestorAtivo(GESTOR_LOGADO_ID)
  return buscarGestor(GESTOR_LOGADO_ID)
}

const ATALHOS = [
  {
    titulo: "Alunos",
    descricao: "Consulta de cadastros, turmas e matrículas",
    icone: Users,
    rota: "/dge/alunos",
  },
  {
    titulo: "Grade Curricular",
    descricao: "Estrutura de disciplinas e carga horária",
    icone: LayoutGrid,
    rota: "/dge/grade",
  },
  {
    titulo: "Modalidade e Disciplinas",
    descricao: "Parâmetros de ensino e componentes curriculares",
    icone: BookOpen,
    rota: "/dge/modalidades",
  },
  {
    titulo: "Controle de Ementas",
    descricao: "Acompanhamento de diretrizes e planos de ensino",
    icone: FileText,
    rota: "/dge/ementas",
  },
  {
    titulo: "Calendário de Reposição",
    descricao: "Agendamento e controle de dias e aulas de reposição",
    icone: Calendar,
    rota: "/dge/reposicao",
  },
  {
    titulo: "Conteúdo Programático",
    descricao: "Edição e atualização dos tópicos das disciplinas",
    icone: List,
    rota: "/dge/conteudo",
  },
]

function SkeletonCardUsuario() {
  return (
    <section aria-label="Carregando dados da gestão escolar" className="rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="size-11 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
        <Skeleton className="size-5" />
      </div>
    </section>
  )
}

function AvisoSincronizacao() {
  return (
    <p className="flex min-h-10 items-center gap-2 rounded-lg border border-navy/10 bg-navy/5 px-3 text-[11px] leading-4 text-foreground">
      <Check aria-hidden="true" className="shrink-0 text-teal-800" size={15} strokeWidth={2.5} />
      Sincronização concluída com o servidor central SEDUC.
    </p>
  )
}

export default function MenuDGE() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { dados: gestor, carregando, erro, recarregar } = useDados(buscarGestorLogado)
  const estadoSimulado = searchParams.get("estado")
  const mostrarCarregamento = carregando || estadoSimulado === "carregando"
  const mostrarErro = Boolean(erro) || estadoSimulado === "erro"

  function tentarNovamente() {
    if (estadoSimulado) {
      const proximosParametros = new URLSearchParams(searchParams)
      proximosParametros.delete("estado")
      setSearchParams(proximosParametros, { replace: true })
    }
    recarregar()
  }

  return (
    <AppShell titulo="Gestão Escolar" usuario={gestor}>
      <main className="min-h-full bg-menu-surface px-4 py-4">
        <div className="mx-auto flex w-full max-w-[390px] flex-col gap-3">
          {mostrarErro ? (
            <EstadoErro
              titulo="Não foi possível carregar o menu da gestão escolar."
              descricao={erro instanceof Error ? erro.message : undefined}
              textoBotao="Tentar novamente"
              onTentarNovamente={tentarNovamente}
            />
          ) : mostrarCarregamento ? (
            <SkeletonCardUsuario />
          ) : (
            <CardUsuario nome={gestor.nome} descricao={gestor.departamento} />
          )}

          <nav aria-label="Atalhos da gestão escolar" className="flex flex-col gap-3">
            {ATALHOS.map((atalho) => (
              <ItemMenu key={atalho.rota} {...atalho} />
            ))}
          </nav>

          <AvisoSincronizacao />
        </div>
      </main>
    </AppShell>
  )
}
