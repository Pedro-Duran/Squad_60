import { useCallback } from "react"
import { Check, X } from "lucide-react"
import { Link, useParams } from "react-router"
import CalendarioReposicaoShell from "@/components/dge/CalendarioReposicaoShell"
import { useDados } from "@/hooks/useDados"
import { buscarSolicitacaoReposicao } from "@/services/reposicaoService"

function formatarData(data) {
  if (!data) return "—"
  const [ano, mes, dia] = data.split("-").map(Number)
  return new Date(ano, mes - 1, dia, 12).toLocaleDateString("pt-BR")
}

function LinhaResumo({ rotulo, valor }) {
  return (
    <div className="cr-resumo-linha">
      <span>{rotulo}</span>
      <strong>{valor || "—"}</strong>
    </div>
  )
}

export default function ConfirmacaoReposicao() {
  const { id } = useParams()
  const buscarSolicitacao = useCallback(
    () => buscarSolicitacaoReposicao(id),
    [id],
  )
  const { dados, carregando, erro, recarregar } = useDados(buscarSolicitacao)

  if (carregando) {
    return (
      <CalendarioReposicaoShell titulo="Resumo da reposição" voltarPara="/dge/reposicao">
        <div className="cr-carregando" role="status">
          Carregando confirmação...
        </div>
      </CalendarioReposicaoShell>
    )
  }

  if (erro || !dados) {
    return (
      <CalendarioReposicaoShell titulo="Resumo da reposição" voltarPara="/dge/reposicao">
        <div className="cr-estado-erro" role="alert">
          <p>
            {erro instanceof Error
              ? erro.message
              : "Não foi possível carregar a confirmação."}
          </p>
          <button
            type="button"
            className="cr-botao cr-botao-primario"
            onClick={recarregar}
          >
            Tentar novamente
          </button>
        </div>
      </CalendarioReposicaoShell>
    )
  }

  const aprovada = dados.status === "aprovada"

  return (
    <CalendarioReposicaoShell titulo="Resumo da reposição" voltarPara="/dge/reposicao">
      <section className="cr-confirmacao">
        <div
          className={`cr-confirmacao-icone${aprovada ? "" : " cr-confirmacao-icone-rejeitada"}`}
          aria-hidden="true"
        >
          {aprovada ? <Check size={34} /> : <X size={34} />}
        </div>
        <h1>{aprovada ? "Reposição aprovada" : "Reposição rejeitada"}</h1>

        <div className="cr-resumo" aria-label="Resumo da solicitação">
          <LinhaResumo rotulo="Disciplina" valor={dados.disciplina} />
          <LinhaResumo rotulo="Turma" valor={dados.turma} />
          <LinhaResumo rotulo="Professor" valor={dados.professorNome} />
          <LinhaResumo
            rotulo="Data da solicitação"
            valor={formatarData(dados.dataSolicitacao)}
          />
          {dados.dataAula && (
            <LinhaResumo
              rotulo="Aula solicitada"
              valor={formatarData(dados.dataAula)}
            />
          )}
          {aprovada && (
            <>
              <LinhaResumo
                rotulo="Data da reposição"
                valor={formatarData(dados.data)}
              />
              <LinhaResumo
                rotulo="Horário"
                valor={`${dados.inicio} às ${dados.fim}`}
              />
              <LinhaResumo
                rotulo="Sala"
                valor={`Sala ${String(dados.sala).padStart(2, "0")}`}
              />
            </>
          )}
          <LinhaResumo rotulo="Motivo" valor={dados.motivo} />
        </div>

        <Link
          to="/dge/reposicao/solicitacoes/todos"
          className="cr-botao cr-botao-primario cr-botao-largo"
        >
          Voltar para a lista
        </Link>
      </section>
    </CalendarioReposicaoShell>
  )
}
