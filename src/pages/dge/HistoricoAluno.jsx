import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { Skeleton } from "@/components/ui/skeleton"
import { AbasAlunos } from "@/components/dge/AbasAlunos"
import ListaHistorico from "@/components/dge/ListaHistorico"
import DgeAppShell from "@/components/layout/DgeAppShell"
import EstadoErro from "@/components/shared/EstadoErro"
import { buscarAlunoPorId } from "@/services/alunoService"
import { buscarHistoricoAluno } from "@/services/historicoService"

function CarregandoHistorico() {
  return (
    <div role="status" aria-label="Carregando histórico" className="space-y-3">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex min-h-[102px] items-start gap-3 rounded-xl bg-card p-4">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-3 pt-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HistoricoAluno() {
  const { id } = useParams()
  const [estado, setEstado] = useState(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true

    Promise.all([buscarAlunoPorId(id), buscarHistoricoAluno(id)])
      .then(([aluno, registros]) => {
        if (ativo) setEstado({ id, tentativa, aluno, registros })
      })
      .catch((erro) => {
        if (ativo) setEstado({ id, tentativa, erro })
      })

    return () => {
      ativo = false
    }
  }, [id, tentativa])

  const estadoAtual = estado?.id === id && estado?.tentativa === tentativa
  const aluno = estadoAtual ? estado.aluno : null
  const registros = estadoAtual ? estado.registros : null
  const erro = estadoAtual ? estado.erro : null

  return (
    <DgeAppShell>
      <div className="sticky top-0 z-10">
        <AbasAlunos ativa="historico" alunoId={id} voltarPara={`/dge/alunos/${id}`} />
        <header className="border-b border-border bg-card px-4 py-4 text-center">
          <h1 className="text-[22px] leading-7 font-bold text-foreground">
            Histórico de Alterações
          </h1>
          {aluno ? (
            <p className="mt-1 text-sm leading-5 text-muted-foreground">{aluno.nome}</p>
          ) : (
            <p className="mt-1 text-sm leading-5 text-muted-foreground" aria-hidden="true">
              &nbsp;
            </p>
          )}
        </header>
      </div>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-3 bg-background px-4 py-5">
        {erro ? (
          <EstadoErro
            titulo="Erro ao carregar histórico"
            textoBotao="Tentar novamente"
            onTentarNovamente={() => setTentativa((valor) => valor + 1)}
          />
        ) : !registros ? (
          <CarregandoHistorico />
        ) : registros.length === 0 ? (
          <p className="py-2 text-xs font-medium text-muted-foreground">
            Nenhum registro encontrado.
          </p>
        ) : (
          <>
            <p className="text-xs leading-4 text-muted-foreground">
              {registros.length} {registros.length === 1 ? "registro encontrado" : "registros encontrados"}
            </p>
            <ListaHistorico registros={registros} />
          </>
        )}
      </main>
    </DgeAppShell>
  )
}
