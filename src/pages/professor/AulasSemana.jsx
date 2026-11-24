import { Link } from "react-router"
import CelulaAula from "@/components/professor/CelulaAula"
import EstadoErro from "@/components/professor/EstadoErro"
import LegendaTurmas from "@/components/professor/LegendaTurmas"
import SkeletonAulas from "@/components/professor/SkeletonAulas"
import { useDados } from "@/hooks/useDados"
import { inicioDaSemana, nomeDiaSemana, siglaDiaSemana, somarDias } from "@/lib/datas"
import { HORARIOS_MANHA } from "@/lib/horarios"
import { listarAulasDaSemana } from "@/services/aulaService"

// Fora do componente: não mudam e, dentro, fariam o useDados buscar em loop.
const PROFESSOR_LOGADO_ID = "prof-001"
const SEGUNDA = inicioDaSemana("2026-09-14") // o mock só tem aulas nesta semana
const DIAS = [0, 1, 2, 3, 4, 5].map((n) => somarDias(SEGUNDA, n))
const buscarSemana = () => listarAulasDaSemana(PROFESSOR_LOGADO_ID, SEGUNDA)

export default function AulasSemana() {
  const { dados: aulas, carregando, erro, recarregar } = useDados(buscarSemana)

  if (carregando) return <SkeletonAulas />
  if (erro) {
    return (
      <EstadoErro
        mensagem="Erro ao carregar as aulas da semana."
        aoTentar={recarregar}
      />
    )
  }

  // Só depois dos ifs: antes disso `aulas` ainda é null.
  const turmas = [...new Set(aulas.map((a) => a.turma))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  )
  const aulaEm = (data, horario) =>
    aulas.find((a) => a.data === data && a.horario === horario)

  return (
    <div className="aulas-semana">
      <h2 className="aulas-semana__titulo">Aulas da semana</h2>

      <div className="grade-semana__rolagem">
        <table className="grade-semana">
          <caption className="sr-only">
            Aulas de {nomeDiaSemana(DIAS[0]).toLowerCase()} a{" "}
            {nomeDiaSemana(DIAS[5]).toLowerCase()}, por horário
          </caption>
          <thead>
            <tr>
              <th scope="col" className="grade-semana__canto">
                <span className="sr-only">Horário</span>
              </th>
              {DIAS.map((dia) => (
                <th scope="col" key={dia}>
                  <Link
                    to={`/professor/aulas-hoje?data=${dia}`}
                    className="grade-semana__dia"
                    aria-label={`Ver aulas de ${nomeDiaSemana(dia).toLowerCase()}`}
                  >
                    {siglaDiaSemana(dia)}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HORARIOS_MANHA.map((h) =>
              h.intervalo ? (
                <tr key={h.inicio}>
                  <th scope="row" className="grade-semana__hora">
                    {h.inicio}
                  </th>
                  <td colSpan={6}>
                    <div className="grade-semana__intervalo">INTERVALO</div>
                  </td>
                </tr>
              ) : (
                <tr key={h.inicio}>
                  <th scope="row" className="grade-semana__hora">
                    {h.inicio}
                  </th>
                  {DIAS.map((dia) => {
                    const aula = aulaEm(dia, h.inicio)
                    return (
                      <td key={dia}>
                        {aula ? (
                          <CelulaAula aula={aula} />
                        ) : (
                          <span className="celula-aula celula-aula--vazia" />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      <LegendaTurmas turmas={turmas} />
    </div>
  )
}
