import { useId, useState } from "react"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"

const DIAS_SEMANA = [
  { abreviacao: "Dom", nome: "domingo" },
  { abreviacao: "Seg", nome: "segunda-feira" },
  { abreviacao: "Ter", nome: "terça-feira" },
  { abreviacao: "Qua", nome: "quarta-feira" },
  { abreviacao: "Qui", nome: "quinta-feira" },
  { abreviacao: "Sex", nome: "sexta-feira" },
  { abreviacao: "Sáb", nome: "sábado" },
]

function dataDeIso(valor) {
  const correspondencia = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!correspondencia) return null

  const [, ano, mes, dia] = correspondencia.map(Number)
  const data = new Date(ano, mes - 1, dia, 12)
  return data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia
    ? data
    : null
}

function formatarData(valor) {
  const data = dataDeIso(valor)
  if (!data) return ""
  return `${String(data.getDate()).padStart(2, "0")}/${String(
    data.getMonth() + 1,
  ).padStart(2, "0")}/${data.getFullYear()}`
}

function converterParaIso(valor) {
  const correspondencia = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!correspondencia) return ""

  const [, diaTexto, mesTexto, anoTexto] = correspondencia
  const dia = Number(diaTexto)
  const mes = Number(mesTexto)
  const ano = Number(anoTexto)
  const data = new Date(ano, mes - 1, dia, 12)
  if (
    Number.isNaN(data.getTime()) ||
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia
  ) {
    return ""
  }

  return `${anoTexto}-${mesTexto}-${diaTexto}`
}

function aplicarMascara(valor) {
  const digitos = valor.replace(/\D/g, "").slice(0, 8)
  if (digitos.length <= 2) return digitos
  if (digitos.length <= 4) {
    return `${digitos.slice(0, 2)}/${digitos.slice(2)}`
  }
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`
}

function dataParaIso(data) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(data.getDate()).padStart(2, "0")}`
}

function primeiroDiaDoMes(data) {
  return new Date(data.getFullYear(), data.getMonth(), 1, 12)
}

export default function SeletorDataBrasileira({ value, onChange }) {
  const calendarioId = useId()
  const dataSelecionada = dataDeIso(value)
  const [texto, setTexto] = useState(() => formatarData(value))
  const [aberto, setAberto] = useState(false)
  const [mesVisivel, setMesVisivel] = useState(() =>
    primeiroDiaDoMes(dataSelecionada ?? new Date()),
  )

  function abrirCalendario() {
    if (!aberto) {
      setMesVisivel(primeiroDiaDoMes(dataSelecionada ?? new Date()))
    }
    setAberto((atual) => !atual)
  }

  function atualizarTexto(evento) {
    const novoTexto = aplicarMascara(evento.target.value)
    setTexto(novoTexto)
    const dataIso = converterParaIso(novoTexto)
    onChange(dataIso)

    const data = dataDeIso(dataIso)
    if (data) setMesVisivel(primeiroDiaDoMes(data))
  }

  function selecionarData(data) {
    const dataIso = dataParaIso(data)
    setTexto(formatarData(dataIso))
    onChange(dataIso)
    setAberto(false)
  }

  function mudarMes(diferenca) {
    setMesVisivel(
      (atual) =>
        new Date(atual.getFullYear(), atual.getMonth() + diferenca, 1, 12),
    )
  }

  const diasNoMes = new Date(
    mesVisivel.getFullYear(),
    mesVisivel.getMonth() + 1,
    0,
  ).getDate()
  const espacosAntesDoMes = primeiroDiaDoMes(mesVisivel).getDay()
  const nomeMes = mesVisivel.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  })
  const tituloMes = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)

  return (
    <div
      className="relative"
      onBlur={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget)) {
          setAberto(false)
        }
      }}
      onKeyDown={(evento) => {
        if (evento.key === "Escape") setAberto(false)
      }}
    >
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          lang="pt-BR"
          required
          pattern="\d{2}/\d{2}/\d{4}"
          placeholder="dd/mm/aaaa"
          value={texto}
          onChange={atualizarTexto}
          aria-label="Sugestão de data da aula de reposição, dia, mês e ano"
          className="min-h-11 w-full rounded-xl border border-slate-300 px-3 pr-12 font-normal outline-none focus:border-blue-700"
        />
        <button
          type="button"
          aria-label={aberto ? "Fechar calendário" : "Abrir calendário"}
          aria-expanded={aberto}
          aria-controls={calendarioId}
          onClick={abrirCalendario}
          className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-r-xl text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-700"
        >
          <CalendarDays size={18} aria-hidden="true" />
        </button>
      </div>
      <span className="text-xs font-normal text-slate-500">
        Use o formato DD/MM/AAAA.
      </span>

      {aberto && (
        <section
          id={calendarioId}
          lang="pt-BR"
          role="dialog"
          aria-label="Selecionar data"
          className="absolute left-0 top-full z-30 mt-2 w-full min-w-[280px] rounded-xl border border-slate-200 bg-white p-3 text-[#192a44] shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Mês anterior"
              onClick={() => mudarMes(-1)}
              className="grid size-9 place-items-center rounded-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-700"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <h2 className="text-sm font-bold" aria-live="polite">
              {tituloMes}
            </h2>
            <button
              type="button"
              aria-label="Próximo mês"
              onClick={() => mudarMes(1)}
              className="grid size-9 place-items-center rounded-lg hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-700"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {DIAS_SEMANA.map(({ abreviacao, nome }) => (
              <span
                key={nome}
                title={nome}
                aria-label={nome}
                className="py-1 text-xs font-semibold text-slate-500"
              >
                {abreviacao}
              </span>
            ))}
            {Array.from(
              { length: espacosAntesDoMes + diasNoMes },
              (_, indice) => {
                if (indice < espacosAntesDoMes) {
                  return <span key={`vazio-${indice}`} aria-hidden="true" />
                }

                const dia = indice - espacosAntesDoMes + 1
                const data = new Date(
                  mesVisivel.getFullYear(),
                  mesVisivel.getMonth(),
                  dia,
                  12,
                )
                const dataIso = dataParaIso(data)
                const selecionada = value === dataIso
                const nomeData = data.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })

                return (
                  <button
                    key={dataIso}
                    type="button"
                    aria-label={nomeData}
                    aria-pressed={selecionada}
                    onClick={() => selecionarData(data)}
                    className={`grid size-9 place-items-center rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-blue-700 ${
                      selecionada
                        ? "bg-[#1026a6] font-bold text-white"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    {dia}
                  </button>
                )
              },
            )}
          </div>
        </section>
      )}
    </div>
  )
}
