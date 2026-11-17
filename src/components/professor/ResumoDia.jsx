import { nomeDiaSemana, formatarDiaMes } from "@/lib/datas"

// Card de resumo: dia, data, pílulas de disciplina/turmas e "concluídas/total".
export default function ResumoDia({ data, aulas }) {
  const disciplinas = [...new Set(aulas.map((a) => a.disciplina))]
  const turmas = [...new Set(aulas.map((a) => a.turma))]
  const concluidas = aulas.filter((a) => a.status === "concluida").length
  const total = aulas.length

  return (
    <section className="resumo-dia">
      <div className="resumo-dia__texto">
        <span className="resumo-dia__dia-semana">{nomeDiaSemana(data)}</span>
        <span className="resumo-dia__data">{formatarDiaMes(data)}</span>
        <div className="resumo-dia__pilulas">
          <span className="pilula">{disciplinas.join(" · ")}</span>
          <span className="pilula">{turmas.join(" · ")}</span>
        </div>
      </div>

      <div className="resumo-dia__contador">
        <div className="resumo-dia__circulo">
          {concluidas}/{total}
        </div>
        <span className="resumo-dia__legenda">aulas</span>
      </div>
    </section>
  )
}
