import { Check, Pencil, User } from "lucide-react"

const TIPOS_REGISTRO = {
  turma: { titulo: "Turma alterada", Icone: Pencil, classeIcone: "bg-primary/10 text-primary" },
  turno: { titulo: "Turno modificado", Icone: Pencil, classeIcone: "bg-primary/10 text-primary" },
  situacao: { titulo: "Situação atualizada", Icone: Check, classeIcone: "bg-status/10 text-status" },
  matricula: { titulo: "Matrícula confirmada", Icone: Check, classeIcone: "bg-status/10 text-status" },
  cadastro: { titulo: "Cadastro atualizado", Icone: Pencil, classeIcone: "bg-primary/10 text-primary" },
}

function formatarDataHora(dataIso) {
  const [data, horario] = dataIso.split("T")
  const [ano, mes, dia] = data.split("-")
  const [hora, minuto] = horario.split(":")

  return `${dia}/${mes}/${ano} · ${hora}h${minuto}`
}

function criarDescricao(registro) {
  if (registro.tipo === "matricula") return "Registro inicial do aluno no sistema"
  if (registro.descricao) return registro.descricao
  return `De ${registro.anterior} para ${registro.nova}`
}

export default function ItemHistorico({ registro }) {
  const { titulo, Icone, classeIcone } = TIPOS_REGISTRO[registro.tipo]

  return (
    <article className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-sm">
      <span
        aria-hidden="true"
        className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full ${classeIcone}`}
      >
        <Icone size={19} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm leading-5 font-semibold text-foreground">{titulo}</h2>
          <time
            dateTime={registro.data}
            className="shrink-0 pt-0.5 text-[10px] leading-4 text-muted-foreground"
          >
            {formatarDataHora(registro.data)}
          </time>
        </div>
        <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
          {criarDescricao(registro)}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs leading-4 text-muted-foreground">
          <User aria-hidden="true" size={13} strokeWidth={1.8} />
          {registro.responsavel.nome} — {registro.responsavel.setor}
        </p>
      </div>
    </article>
  )
}
