import { Link } from "react-router"
import { nomeDiaSemana } from "@/lib/datas"

export function CelulaAula({ aula, cor, texto }) {
  const nomeDia = nomeDiaSemana(aula.data).toLowerCase()
  const disciplinaAbreviada = `${aula.disciplina.slice(0, 3)}.`
  const turmaAbreviada = aula.turma.replace(" Ano ", "")

  return (
    <Link
      to={`/professor/aulas-hoje?data=${aula.data}`}
      aria-label={`${aula.disciplina}, ${aula.turma}, ${nomeDia} às ${aula.horario}`}
      className={`flex h-12 w-[46px] flex-col items-center justify-center rounded-lg text-[10px] font-bold leading-tight ${cor} ${texto}`}
    >
      <span>{disciplinaAbreviada}</span>
      <span className="mt-0.5 font-normal">{turmaAbreviada}</span>
    </Link>
  )
}
