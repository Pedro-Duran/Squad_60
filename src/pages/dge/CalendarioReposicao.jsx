import { useCallback } from "react"
import { Link } from "react-router"
import CartaoSolicitacaoReposicao from "@/components/dge/CartaoSolicitacaoReposicao"
import CalendarioReposicaoShell from "@/components/dge/CalendarioReposicaoShell"
import { useAuth } from "@/hooks/useAuth"
import { useReposicoesDados } from "@/hooks/useReposicoesDados"
import { buscarPainelCalendarioReposicao } from "@/services/reposicaoService"

function dataAtualExtensa() {
  const data = new Date()
  const texto = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(data)
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function CartaoMetrica({ valor, rotulo, destaque, destino }) {
  const classe = `cr-metrica${destaque ? " cr-metrica-destaque" : ""}`
  const conteudo = (
    <>
      <strong>{valor}</strong>
      <span>{rotulo}</span>
    </>
  )

  return destino ? (
    <Link to={destino} className={classe}>
      {conteudo}
    </Link>
  ) : (
    <div className={classe}>{conteudo}</div>
  )
}

export default function CalendarioReposicao() {
  const { usuario } = useAuth()
  const buscarPainel = useCallback(
    () => buscarPainelCalendarioReposicao(),
    [],
  )
  const { dados, carregando, erro, recarregar } =
    useReposicoesDados(buscarPainel)
  const primeiroNome = usuario?.nome?.trim().split(/\s+/)[0] ?? "Usuário"

  return (
    <CalendarioReposicaoShell
      titulo={`Olá, ${primeiroNome}!`}
      subtitulo={dataAtualExtensa()}
      voltarPara="/dge"
      pendencias={dados?.metricas.solicitacoesPendentes ?? 0}
    >
      {carregando ? (
        <div className="cr-carregando" role="status">
          Carregando calendário de reposição...
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
      ) : dados ? (
        <>
          <section className="cr-metricas" aria-label="Resumo das reposições">
            <CartaoMetrica
              valor={dados.metricas.aulasPendentes}
              rotulo="Aulas pendentes"
            />
            <CartaoMetrica
              valor={dados.metricas.reposicoesAgendadas}
              rotulo="Reposições agendadas"
            />
            <CartaoMetrica
              valor={dados.metricas.horariosDisponiveis}
              rotulo="Horários disponíveis"
            />
            <CartaoMetrica
              valor={dados.metricas.solicitacoesPendentes}
              rotulo="Solicitações pendentes"
              destaque
              destino="/dge/reposicao/solicitacoes/pendente"
            />
          </section>

          <section className="cr-dashboard-conteudo">
            <div className="cr-secao-cabecalho">
              <h2>Próximas reposições</h2>
              <Link to="/dge/reposicao/solicitacoes/todos">Ver todas ›</Link>
            </div>
            {dados.proximas.length > 0 ? (
              <div className="cr-lista">
                {dados.proximas.map((solicitacao) => (
                  <CartaoSolicitacaoReposicao
                    key={solicitacao.id}
                    solicitacao={solicitacao}
                  />
                ))}
              </div>
            ) : (
              <p className="cr-estado-vazio">
                Nenhuma reposição futura agendada.
              </p>
            )}
            <Link
              to="/dge/reposicao/solicitacoes/todos"
              className="cr-botao cr-botao-primario cr-botao-largo cr-acoes-dashboard"
            >
              Gerenciar reposições
            </Link>
          </section>
        </>
      ) : null}
    </CalendarioReposicaoShell>
  )
}
