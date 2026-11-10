import { formatarDataAula } from "@/lib/datas"

// Card branco com "DIA · DD/MM/AAAA · HH:MM". O dia da semana é calculado
// a partir da data (nunca escrito à mão).
export default function CardDataAula({ data, horario }) {
  return (
    <section className="card-data-aula">
      <span className="card-data-aula__rotulo">Dia · data · horário</span>
      <span className="card-data-aula__valor">{formatarDataAula(data, horario)}</span>
    </section>
  )
}
