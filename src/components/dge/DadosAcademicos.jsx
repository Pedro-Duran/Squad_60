const linhasAcademicas = (aluno) => [
  ["Série/Ano", aluno.turma.split(" ").slice(0, 2).join(" ")],
  ["Turma", aluno.turma.split(" ").at(-1)],
  ["Turno", aluno.turno ?? "Manhã"],
  ["Modalidade", aluno.modalidade ?? "Ensino Médio"],
]

export default function DadosAcademicos({ aluno }) {
  return (
    <section className="rounded-2xl bg-card p-5 text-card-foreground shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Dados acadêmicos
      </h2>
      <dl className="mt-4 divide-y divide-border">
        {linhasAcademicas(aluno).map(([rotulo, valor]) => (
          <div key={rotulo} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-xs font-semibold uppercase text-muted-foreground">{rotulo}</dt>
            <dd className="text-right text-sm">{valor}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
