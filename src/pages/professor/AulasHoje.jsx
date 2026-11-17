import { useCallback, useState } from "react"
import { useSearchParams } from "react-router"
import { CalendarOff } from "lucide-react"
import { listarAulasDoDia } from "@/services/aulaService"
import { useAuth } from "@/hooks/useAuth"
import { useDados } from "@/hooks/useDados"
import { HORARIOS_MANHA } from "@/lib/horarios"
import SeletorDia from "@/components/professor/SeletorDia"
import ResumoDia from "@/components/professor/ResumoDia"
import CardAulaDia from "@/components/professor/CardAulaDia"
import EstadoErro from "@/components/professor/EstadoErro"
import SkeletonAulas from "@/components/professor/SkeletonAulas"

// Sem login (acesso direto pela URL), usa a professora do mock.
const PROFESSOR_PADRAO_ID = "prof-001"
const DIA_INICIAL = "2026-09-14" // o mock só tem aulas de 14 a 16/09/2026

export default function AulasHoje() {
  const [params, setParams] = useSearchParams()
  const data = params.get("data") ?? DIA_INICIAL

  function irPara(novaData) {
    params.set("data", novaData)
    setParams(params)
  }

  return (
    <div className="aulas-hoje">
      <SeletorDia data={data} irPara={irPara} />
      {/* key={data}: ao trocar de dia, o React descarta este componente e cria
          um novo — zera o estado, volta a "carregando" e recalcula o card aberto. */}
      <AulasDoDia key={data} data={data} />
    </div>
  )
}

function AulasDoDia({ data }) {
  const { usuario } = useAuth()
  const professorId = usuario?.professorId ?? PROFESSOR_PADRAO_ID

  // A busca depende de `data`, então vai num useCallback com [data];
  // sem ele, o useDados buscaria em loop.
  const buscar = useCallback(
    () => listarAulasDoDia(professorId, data),
    [professorId, data],
  )
  const { dados: aulas, carregando, erro, recarregar } = useDados(buscar)

  // null = o professor ainda não escolheu (abre a 1ª pendente);
  // "" = ele fechou tudo; senão, o id escolhido.
  const [abertaId, setAbertaId] = useState(null)

  if (carregando) return <SkeletonAulas />
  if (erro) return <EstadoErro aoTentar={recarregar} />
  if (!aulas || aulas.length === 0) {
    return (
      <div className="estado-vazio">
        <CalendarOff className="estado-vazio__icone" size={36} aria-hidden="true" />
        <p className="estado-vazio__texto">Nenhuma aula neste dia.</p>
      </div>
    )
  }

  const primeiraPendente = aulas.find((a) => a.status === "pendente")
  const idAberta = abertaId === null ? primeiraPendente?.id : abertaId

  function alternar(id) {
    setAbertaId((atual) => {
      const efetivo = atual === null ? primeiraPendente?.id : atual
      return efetivo === id ? "" : id
    })
  }

  return (
    <>
      <ResumoDia data={data} aulas={aulas} />

      <div className="lista-aulas">
        <div className="lista-aulas__cabecalho">
          <span>Início</span>
          <span>Aula</span>
          <span>Término</span>
        </div>

        {HORARIOS_MANHA.map((h) => {
          if (h.intervalo) {
            return (
              <div className="intervalo" key={`intervalo-${h.inicio}`}>
                <span className="intervalo__hora">{h.inicio}</span>
                <div className="intervalo__meio">
                  <span className="intervalo__linha" />
                  <span className="intervalo__texto">INTERVALO</span>
                  <span className="intervalo__linha" />
                </div>
                <span className="intervalo__hora">{h.fim}</span>
              </div>
            )
          }

          const aula = aulas.find((a) => a.horario === h.inicio)
          if (!aula) return null

          return (
            <div className="linha-aula" key={aula.id}>
              <span className="linha-aula__hora">{h.inicio}</span>
              <CardAulaDia
                aula={aula}
                aberta={idAberta === aula.id}
                aoAlternar={() => alternar(aula.id)}
              />
              <span className="linha-aula__hora">{h.fim}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}
