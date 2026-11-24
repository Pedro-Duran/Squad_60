import { CalendarDays, Clock3 } from "lucide-react"
import { Link } from "react-router"

const STATUS = {
  pendente: { texto: "Pendente", classe: "pendente" },
  aprovada: { texto: "Aprovada", classe: "aprovada" },
  rejeitada: { texto: "Rejeitada", classe: "rejeitada" },
}

function formatarData(data) {
  if (!data) return "Data não informada"
  const [ano, mes, dia] = data.split("-").map(Number)
  return new Date(ano, mes - 1, dia, 12).toLocaleDateString("pt-BR")
}

export default function CartaoSolicitacaoReposicao({
  solicitacao,
  mostrarAcao = false,
}) {
  const status = STATUS[solicitacao.status] ?? STATUS.pendente
  const data = solicitacao.status === "aprovada"
    ? solicitacao.data
    : solicitacao.dataSolicitacao

  return (
    <article className="cr-cartao-solicitacao">
      <div className="cr-cartao-topo">
        <div>
          <h2>{solicitacao.disciplina}</h2>
          <p>
            {solicitacao.turma} · {solicitacao.turno}
          </p>
        </div>
        <span className={`cr-status cr-status-${status.classe}`}>
          <span aria-hidden="true" />
          {status.texto}
        </span>
      </div>

      <div className="cr-cartao-detalhes">
        <span>{solicitacao.professorNome}</span>
        <span>
          <CalendarDays size={15} aria-hidden="true" />
          {solicitacao.status === "aprovada" ? "Reposição" : "Solicitada em"}{" "}
          {formatarData(data)}
        </span>
        {solicitacao.status === "aprovada" && solicitacao.inicio && (
          <span>
            <Clock3 size={15} aria-hidden="true" />
            {solicitacao.inicio} – {solicitacao.fim}
            {solicitacao.sala ? ` · Sala ${String(solicitacao.sala).padStart(2, "0")}` : ""}
          </span>
        )}
      </div>

      {solicitacao.motivo && (
        <p className="cr-cartao-motivo">{solicitacao.motivo}</p>
      )}

      {mostrarAcao && solicitacao.status === "pendente" && (
        <Link
          to={`/dge/reposicao/${solicitacao.id}/horarios`}
          className="cr-botao cr-botao-primario cr-botao-cartao"
        >
          Ver horários disponíveis
        </Link>
      )}
    </article>
  )
}
