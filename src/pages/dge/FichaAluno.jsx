import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { History, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import CardIdentificacaoAluno from "@/components/dge/CardIdentificacaoAluno"
import DadosAcademicos from "@/components/dge/DadosAcademicos"
import { AbasAlunos } from "@/components/dge/AbasAlunos"
import DgeAppShell from "@/components/layout/DgeAppShell"
import EstadoErro from "@/components/shared/EstadoErro"
import { buscarAlunoPorId } from "@/services/alunoService"

export default function FichaAluno() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [estado, setEstado] = useState(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true

    buscarAlunoPorId(id)
      .then((aluno) => {
        if (ativo) setEstado({ id, tentativa, aluno })
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
  const erro = estadoAtual ? estado.erro : null
  const voltarPara = location.state?.from || "/dge/alunos"

  return (
    <DgeAppShell>
      <AbasAlunos ativa="ficha" alunoId={id} voltarPara={voltarPara} />
      <header className="border-b border-border bg-card px-4 py-4 text-center">
        <h1 className="text-[22px] font-bold leading-7 text-foreground">Ficha do Aluno</h1>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 p-4">
        {erro && (
          <EstadoErro
            titulo="Erro ao carregar ficha"
            textoBotao="Tentar novamente"
            onTentarNovamente={() => setTentativa((valor) => valor + 1)}
          />
        )}

        {!erro && !aluno && (
          <p role="status" className="text-sm text-muted-foreground">
            Carregando…
          </p>
        )}

        {aluno && (
          <>
            <CardIdentificacaoAluno aluno={aluno} />
            <DadosAcademicos aluno={aluno} />
            <Button
              type="button"
              className="h-12 w-full rounded-full"
              onClick={() => navigate(`/dge/alunos/${id}/editar`)}
            >
              <Pencil aria-hidden="true" className="size-4" />
              EDITAR DADOS
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-full border-primary text-primary hover:bg-primary/5 hover:text-primary"
              onClick={() => navigate(`/dge/alunos/${id}/historico`)}
            >
              <History aria-hidden="true" className="size-4" />
              HISTÓRICO DE ALTERAÇÕES
            </Button>
          </>
        )}
      </main>
    </DgeAppShell>
  )
}
