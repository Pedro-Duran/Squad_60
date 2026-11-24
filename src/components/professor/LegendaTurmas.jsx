const coresTurma = [
  "bg-turma-1",
  "bg-turma-2",
  "bg-turma-3",
]

export function LegendaTurmas({ turmas }) {
  return (
    <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      {turmas.map((turma, indice) => (
        <li key={turma} className="flex items-center gap-2 text-xs text-foreground">
          <span
            aria-hidden="true"
            className={`size-3 rounded-sm ${coresTurma[indice]}`}
          />
          {turma}
        </li>
      ))}
    </ul>
  )
}
