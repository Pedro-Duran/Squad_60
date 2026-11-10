import { ChevronLeft, ChevronRight } from "lucide-react"
import { nomeDiaSemana, formatarDiaMes, siglaDiaSemana, somarDias } from "@/lib/datas"

// Setas de dia anterior/próximo + nome e data do dia atual.
export default function SeletorDia({ data, irPara }) {
  return (
    <div className="seletor-dia">
      <button
        type="button"
        className="seletor-dia__seta"
        aria-label="Dia anterior"
        onClick={() => irPara(somarDias(data, -1))}
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>

      <div className="seletor-dia__centro">
        <span className="seletor-dia__nome">{nomeDiaSemana(data)}</span>
        <span className="seletor-dia__data">{formatarDiaMes(data)}</span>
      </div>

      <button
        type="button"
        className="seletor-dia__seta"
        aria-label="Próximo dia"
        onClick={() => irPara(somarDias(data, 1))}
      >
        <span className="seletor-dia__sigla">{siglaDiaSemana(somarDias(data, 1))}</span>
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </div>
  )
}
