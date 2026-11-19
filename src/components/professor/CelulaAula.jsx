import { Link } from "react-router"
import { nomeDiaSemana } from "@/lib/datas"
import { tokenCorTurma } from "@/lib/turmas"

// "Matemática" → "Mat."
function abreviarDisciplina(disciplina) {
  return `${disciplina.slice(0, 3)}.`
}

// "7º Ano A" → "7ºA"
function abreviarTurma(turma) {
  return turma.replace(" Ano ", "")
}

// Célula da grade de Aulas da Semana com uma aula: quadrado na cor da turma
// que leva para Aulas de Hoje no dia da aula.
export default function CelulaAula({ aula }) {
  const token = tokenCorTurma(aula.turma)
  const descricao = `${aula.disciplina}, ${aula.turma}, ${nomeDiaSemana(aula.data).toLowerCase()} às ${aula.horario}`

  return (
    <Link
      to={`/professor/aulas-hoje?data=${aula.data}`}
      className={`celula-aula celula-aula--${token}`}
      aria-label={descricao}
    >
      <span aria-hidden="true">{abreviarDisciplina(aula.disciplina)}</span>
      <span aria-hidden="true">{abreviarTurma(aula.turma)}</span>
    </Link>
  )
}
