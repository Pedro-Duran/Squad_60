import { useCallback, useState } from "react"
import { useSearchParams } from "react-router"
import { Check } from "lucide-react"
import { buscarChamada, salvarPresencas } from "@/services/aulaService"
import { useDados } from "@/hooks/useDados"
import {
  calcularFrequencia,
  situacaoFrequencia,
  FREQUENCIA_MINIMA,
} from "@/lib/frequencia"
import { toast } from "sonner"
import CardDataAula from "@/components/professor/CardDataAula"
import EstadoErro from "@/components/professor/EstadoErro"
import SkeletonAulas from "@/components/professor/SkeletonAulas"

// A aula vem de "Aulas de Hoje" (?aula=). Sem ela, abre a primeira do mock.
const AULA_PADRAO_ID = "aula-001"

export default function ListaPresenca() {
  const [params] = useSearchParams()
  const aulaId = params.get("aula") ?? AULA_PADRAO_ID

  // key={aulaId}: trocar de aula zera marcações e modo edição.
  return <ChamadaDaAula key={aulaId} aulaId={aulaId} />
}

function ChamadaDaAula({ aulaId }) {
  // Hooks sempre no topo, antes de qualquer return.
  const buscar = useCallback(() => buscarChamada(aulaId), [aulaId])
  const { dados, carregando, erro, recarregar } = useDados(buscar)
  const [modoEdicao, setModoEdicao] = useState(false)
  const [mudancas, setMudancas] = useState({}) // { [alunoId]: true/false }
  const [enviando, setEnviando] = useState(false)

  if (carregando) return <SkeletonAulas />
  if (erro) return <EstadoErro mensagem={erro.message} aoTentar={recarregar} />
  if (!dados) return null

  const { aula, alunos } = dados

  // A presença é a mudança do aluno, se existir, ou a que veio do service.
  const presencaDe = (aluno) =>
    aluno.id in mudancas ? mudancas[aluno.id] : aluno.presente

  function alternar(aluno) {
    if (!modoEdicao) return
    setMudancas((m) => {
      const atual = aluno.id in m ? m[aluno.id] : aluno.presente
      return { ...m, [aluno.id]: !atual }
    })
  }

  function cancelar() {
    setMudancas({}) // desfaz as mudanças
    setModoEdicao(false)
  }

  async function enviar() {
    setEnviando(true)
    const presencas = alunos.map((a) => ({ alunoId: a.id, presente: presencaDe(a) }))
    try {
      await salvarPresencas(aulaId, presencas)
      toast.success("Presença enviada.")
      setModoEdicao(false) // volta ao modo leitura mostrando a chamada nova
    } catch (e) {
      // continua no modo edição, sem perder o que foi marcado
      toast.error(e?.message ?? "Não foi possível enviar a presença.")
    } finally {
      setEnviando(false)
    }
  }

  // Observações geradas a partir dos dados (nunca escritas à mão).
  const avisos = alunos.flatMap((aluno) => {
    const situacao = situacaoFrequencia(calcularFrequencia(aluno))
    if (situacao === "atencao") {
      return [`${aluno.nome} está perto de atingir o limite permitido de faltas.`]
    }
    if (situacao === "limite") {
      return [`${aluno.nome} já atingiu o limite permitido de faltas.`]
    }
    return []
  })

  return (
    <div className="lista-presenca">
      <CardDataAula data={aula.data} horario={aula.horario} />

      <section className="tabela-alunos">
        <div className="tabela-alunos__cabecalho">
          <span>Nome</span>
          <span className="col-centro">P</span>
          <span className="col-centro">Freq.</span>
        </div>

        {alunos.map((aluno) => {
          const presente = presencaDe(aluno)
          const freq = calcularFrequencia(aluno)
          const situacao = situacaoFrequencia(freq)
          return (
            <div className="linha-aluno" key={aluno.id}>
              <div className="linha-aluno__nome">
                <span className="avatar" aria-hidden="true">
                  {aluno.nome.charAt(0)}
                </span>
                <span className={`nome-aluno nome-aluno--${situacao}`}>
                  {aluno.nome}
                </span>
              </div>

              <div className="col-centro">
                <button
                  type="button"
                  className={`presenca-btn ${presente ? "presenca-btn--on" : ""}`}
                  aria-pressed={presente}
                  aria-label={`Presença de ${aluno.nome}`}
                  disabled={!modoEdicao}
                  onClick={() => alternar(aluno)}
                >
                  {presente && <Check size={16} strokeWidth={3} aria-hidden="true" />}
                </button>
              </div>

              <div className="freq">
                <div className="freq__barra">
                  <div
                    className={`freq__preenchido freq__preenchido--${situacao}`}
                    style={{ width: `${freq}%` }}
                  />
                </div>
                <span className={`freq__valor freq__valor--${situacao}`}>{freq}%</span>
              </div>
            </div>
          )
        })}
      </section>

      <button
        type="button"
        className="btn-editar"
        onClick={modoEdicao ? cancelar : () => setModoEdicao(true)}
      >
        {modoEdicao ? "Cancelar edição" : "Editar presença"}
      </button>

      <section className="observacoes">
        <h2 className="observacoes__titulo">Observações</h2>
        <div className="observacoes__card">
          {avisos.length === 0 ? (
            <p className="observacoes__item">Nenhum aluno perto do limite de faltas.</p>
          ) : (
            <>
              {avisos.map((aviso) => (
                <p className="observacoes__item" key={aviso}>
                  {aviso}
                </p>
              ))}
              <p className="observacoes__item observacoes__item--regra">
                A frequência mínima exigida é de {FREQUENCIA_MINIMA}%.
              </p>
            </>
          )}
        </div>
      </section>

      <button
        type="button"
        className="btn-enviar"
        disabled={!modoEdicao || enviando}
        onClick={enviar}
      >
        {enviando ? "Enviando…" : "Enviar"}
      </button>
    </div>
  )
}
