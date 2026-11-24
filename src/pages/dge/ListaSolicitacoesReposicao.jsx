import { useCallback, useState } from "react"
import { Search } from "lucide-react"
import { Link, Navigate, useParams } from "react-router"
import CartaoSolicitacaoReposicao from "@/components/dge/CartaoSolicitacaoReposicao"
import CalendarioReposicaoShell from "@/components/dge/CalendarioReposicaoShell"
import { useReposicoesDados } from "@/hooks/useReposicoesDados"
import { listarSolicitacoesCalendario } from "@/services/reposicaoService"

const ABAS = [
  { status: "todos", rotulo: "Todos" },
  { status: "pendente", rotulo: "Pendente" },
  { status: "aprovada", rotulo: "Aprovada" },
  { status: "rejeitada", rotulo: "Rejeitada" },
]

function normalizarBusca(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim()
}

export default function ListaSolicitacoesReposicao() {
  const { status } = useParams()
  const [busca, setBusca] = useState("")
  const statusValido = ABAS.some((aba) => aba.status === status)
  const buscarSolicitacoes = useCallback(
    () => listarSolicitacoesCalendario(statusValido ? status : "todos"),
    [status, statusValido],
  )
  const { dados, carregando, erro, recarregar } =
    useReposicoesDados(buscarSolicitacoes)

  if (!statusValido) {
    return <Navigate to="/dge/reposicao/solicitacoes/todos" replace />
  }

  const termo = normalizarBusca(busca)
  const filtradas = (dados ?? []).filter((solicitacao) => {
    const texto = normalizarBusca(
      `${solicitacao.disciplina} ${solicitacao.turma} ${solicitacao.professorNome}`,
    )
    return texto.includes(termo)
  })

  return (
    <CalendarioReposicaoShell
      titulo="Reposições de aulas"
      voltarPara="/dge/reposicao"
    >
      <label className="cr-busca">
        <Search size={18} aria-hidden="true" />
        <span className="sr-only">Buscar por disciplina, turma ou professor</span>
        <input
          type="search"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Buscar por disciplina, turma ou professor..."
        />
      </label>

      <nav className="cr-chips" aria-label="Filtrar solicitações por status">
        {ABAS.map((aba) => (
          <Link
            key={aba.status}
            to={`/dge/reposicao/solicitacoes/${aba.status}`}
            className={`cr-chip${status === aba.status ? " cr-chip-ativo" : ""}`}
            aria-current={status === aba.status ? "page" : undefined}
          >
            {aba.rotulo}
          </Link>
        ))}
      </nav>

      {carregando ? (
        <div className="cr-carregando" role="status">
          Carregando solicitações...
        </div>
      ) : erro ? (
        <div className="cr-estado-erro" role="alert">
          <p>Não foi possível carregar as solicitações.</p>
          <p>{erro instanceof Error ? erro.message : String(erro)}</p>
          <button
            type="button"
            className="cr-botao cr-botao-primario"
            onClick={recarregar}
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          <p className="cr-contagem">
            {filtradas.length}{" "}
            {filtradas.length === 1 ? "solicitação encontrada" : "solicitações encontradas"}
          </p>
          {filtradas.length ? (
            <div className="cr-lista">
              {filtradas.map((solicitacao) => (
                <CartaoSolicitacaoReposicao
                  key={solicitacao.id}
                  solicitacao={solicitacao}
                  mostrarAcao={status === "pendente"}
                />
              ))}
            </div>
          ) : (
            <p className="cr-estado-vazio">
              Nenhuma solicitação corresponde à busca e ao filtro selecionados.
            </p>
          )}
        </>
      )}
    </CalendarioReposicaoShell>
  )
}
