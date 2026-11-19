import { tokenCorTurma } from "@/lib/turmas"

// Legenda das cores da grade: um quadradinho com a cor e o nome de cada turma.
export default function LegendaTurmas({ turmas }) {
  return (
    <ul className="legenda-turmas" aria-label="Legenda das turmas">
      {turmas.map((turma) => (
        <li key={turma} className="legenda-turmas__item">
          <span
            className={`legenda-turmas__cor legenda-turmas__cor--${tokenCorTurma(turma)}`}
            aria-hidden="true"
          />
          {turma}
        </li>
      ))}
    </ul>
  )
}
