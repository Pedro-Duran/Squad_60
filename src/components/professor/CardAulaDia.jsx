import { Link } from "react-router"
import { Check, ChevronDown, ClipboardList, BookOpen } from "lucide-react"
import { tokenCorTurma } from "@/lib/turmas"

// Card de uma aula. Fechado: faixa colorida + disciplina/turma + (check).
// Aberto: fica azul e mostra os atalhos de presença e diário.
export default function CardAulaDia({ aula, aberta, aoAlternar }) {
  const concluida = aula.status === "concluida"
  const estiloCor = { "--cor-turma": `var(--${tokenCorTurma(aula.turma)})` }

  return (
    <div
      className={`card-aula ${aberta ? "card-aula--aberta" : ""}`}
      style={estiloCor}
    >
      <button
        type="button"
        className="card-aula__cabecalho"
        aria-expanded={aberta}
        onClick={aoAlternar}
      >
        <span className="card-aula__info">
          <span className="card-aula__disciplina">{aula.disciplina}</span>
          <span className="card-aula__turma">{aula.turma}</span>
        </span>

        {concluida && (
          <span className="card-aula__check" aria-label="Aula concluída">
            <Check size={14} strokeWidth={3} aria-hidden="true" />
          </span>
        )}

        <ChevronDown className="card-aula__seta" size={20} aria-hidden="true" />
      </button>

      {aberta && (
        <div className="card-aula__acoes">
          <Link
            className="btn-pilula btn-pilula--contorno"
            to={`/professor/presenca?aula=${aula.id}`}
          >
            <ClipboardList size={16} aria-hidden="true" />
            Lista de Presença
          </Link>
          <Link
            className="btn-pilula btn-pilula--solido"
            to={`/professor/diario?aula=${aula.id}`}
          >
            <BookOpen size={16} aria-hidden="true" />
            Diário Eletrônico
          </Link>
        </div>
      )}
    </div>
  )
}
