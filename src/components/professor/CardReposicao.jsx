import { CalendarDays, Clock3 } from 'lucide-react'
import StatusBadge from '@/components/shared/StatusBadge'
import { formatarDataCurta } from '@/lib/datas'
const CORES_TURMAS = ['turma-1', 'turma-2', 'turma-3']
function classeTurma(turma) {
  const serie = Number(turma.match(/\d+/)?.[0] ?? 7)
  return CORES_TURMAS[((serie - 6) % 3 + 3) % 3]
}
export default function CardReposicao({ reposicao }) {
  return <article className={`card-reposicao ${classeTurma(reposicao.turma)}`}>
    <div className="card-reposicao-topo"><div className="card-reposicao-titulos"><h3>{reposicao.disciplina}</h3><p>{reposicao.turma} – {reposicao.turno}</p></div><StatusBadge status={reposicao.status} /></div>
    <div className="card-reposicao-info"><span><CalendarDays size={16} aria-hidden="true" />{formatarDataCurta(reposicao.data)}</span><span><Clock3 size={16} aria-hidden="true" />{reposicao.inicio} – {reposicao.fim}</span></div>
  </article>
}
