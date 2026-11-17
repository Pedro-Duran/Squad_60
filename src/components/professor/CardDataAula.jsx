import { formatarDataAula } from "@/lib/datas"

export default function CardDataAula({
  data,
  horario,
  onDataChange,
  onHorarioChange,
  className = "",
}) {
  const texto = formatarDataAula(data, horario)
  const editavel = Boolean(onDataChange && onHorarioChange)

  return (
    <div
      className={`rounded-[16px] bg-[color:var(--card)] px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.08)] ring-1 ring-black/5 ${className}`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted-text)] sm:text-[11px]">
        Dia · data · horário
      </div>
      {editavel ? (
        <>
          <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2">
            <label className="sr-only" htmlFor="aula-data">Data da aula</label>
            <input
              id="aula-data"
              type="date"
              value={data}
              onChange={(event) => onDataChange(event.target.value)}
              className="min-w-0 rounded-lg border border-[color:var(--muted-border)] bg-white px-2 py-2 text-[13px] font-semibold text-[color:var(--title)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]"
            />
            <label className="sr-only" htmlFor="aula-horario">Horário da aula</label>
            <input
              id="aula-horario"
              type="time"
              value={horario}
              onChange={(event) => onHorarioChange(event.target.value)}
              className="w-[112px] rounded-lg border border-[color:var(--muted-border)] bg-white px-2 py-2 text-[13px] font-semibold text-[color:var(--title)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]"
            />
          </div>
          <div className="mt-2 text-[11px] font-semibold text-[color:var(--muted-text)]">
            {texto}
          </div>
        </>
      ) : (
        <div className="mt-2 text-[12px] font-semibold text-[color:var(--title)] sm:text-[14px]">
          {texto}
        </div>
      )}
    </div>
  )
}
