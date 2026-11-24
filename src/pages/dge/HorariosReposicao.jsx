import { useCallback, useState } from "react"
import { useNavigate, useParams } from "react-router"
import CalendarioReposicaoShell from "@/components/dge/CalendarioReposicaoShell"
import { useReposicoesDados } from "@/hooks/useReposicoesDados"
import {
  aprovarSolicitacaoReposicao,
  buscarOpcoesReposicao,
  rejeitarSolicitacaoReposicao,
} from "@/services/reposicaoService"

function formatarData(data) {
  if (!data) return "Não informada"
  const [ano, mes, dia] = data.split("-").map(Number)
  return new Date(ano, mes - 1, dia, 12).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  })
}

export default function HorariosReposicao() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dataSelecionada, setDataSelecionada] = useState("")
  const [selecao, setSelecao] = useState(null)
  const [erroAcao, setErroAcao] = useState("")
  const [enviando, setEnviando] = useState(false)
  const buscarOpcoes = useCallback(() => buscarOpcoesReposicao(id), [id])
  const { dados, carregando, erro, recarregar } =
    useReposicoesDados(buscarOpcoes)
  const diaAtivo =
    dados?.datas.find((dia) => dia.data === dataSelecionada) ?? dados?.datas[0]

  async function confirmarReposicao() {
    if (!selecao) return
    setErroAcao("")
    setEnviando(true)
    try {
      await aprovarSolicitacaoReposicao(id, selecao)
      navigate(`/dge/reposicao/confirmacao/${id}`)
    } catch (erroConfirmacao) {
      setErroAcao(
        erroConfirmacao instanceof Error
          ? erroConfirmacao.message
          : "Não foi possível confirmar a reposição.",
      )
      recarregar()
    } finally {
      setEnviando(false)
    }
  }

  async function rejeitarReposicao() {
    setErroAcao("")
    setEnviando(true)
    try {
      await rejeitarSolicitacaoReposicao(id)
      navigate(`/dge/reposicao/confirmacao/${id}`)
    } catch (erroRejeicao) {
      setErroAcao(
        erroRejeicao instanceof Error
          ? erroRejeicao.message
          : "Não foi possível rejeitar a solicitação.",
      )
      recarregar()
    } finally {
      setEnviando(false)
    }
  }

  return (
    <CalendarioReposicaoShell
      titulo="Reposições de aulas"
      aoVoltar={() => navigate(-1)}
    >
      {carregando ? (
        <div className="cr-carregando" role="status">
          Carregando horários disponíveis...
        </div>
      ) : erro ? (
        <div className="cr-estado-erro" role="alert">
          <p>{erro instanceof Error ? erro.message : String(erro)}</p>
          <button
            type="button"
            className="cr-botao cr-botao-primario"
            onClick={recarregar}
          >
            Tentar novamente
          </button>
        </div>
      ) : dados ? (
        <>
          <section className="cr-resumo" aria-label="Solicitação selecionada">
            <div className="cr-resumo-linha">
              <span>Disciplina</span>
              <strong>{dados.solicitacao.disciplina}</strong>
            </div>
            <div className="cr-resumo-linha">
              <span>Professor</span>
              <strong>{dados.solicitacao.professorNome}</strong>
            </div>
            <div className="cr-resumo-linha">
              <span>Turma</span>
              <strong>{dados.solicitacao.turma}</strong>
            </div>
            <div className="cr-resumo-linha">
              <span>Sugestão de data da aula de reposição</span>
              <strong>{formatarData(dados.solicitacao.dataAula)}</strong>
            </div>
            <div className="cr-resumo-linha">
              <span>Solicitada em</span>
              <strong>{formatarData(dados.solicitacao.dataSolicitacao)}</strong>
            </div>
          </section>

          <label className="cr-campo">
            <span>Data da reposição (segunda a sábado, até dois meses)</span>
            {dados.datas.length ? (
              <select
                className="cr-select-data"
                value={diaAtivo?.data ?? ""}
                onChange={(event) => {
                  setDataSelecionada(event.target.value)
                  setSelecao(null)
                }}
              >
                {dados.datas.map((dia) => (
                  <option key={dia.data} value={dia.data}>
                    {formatarData(dia.data)}
                  </option>
                ))}
              </select>
            ) : (
              <span className="cr-estado-vazio">
                Não há horários disponíveis dentro do prazo desta solicitação.
              </span>
            )}
          </label>

          {diaAtivo && (
            <section
              className="cr-disponibilidade"
              aria-label="Horários e salas disponíveis"
            >
              {diaAtivo.horarios.map((horario) => (
                <div
                  className="cr-horario"
                  key={`${horario.inicio}-${horario.fim}`}
                >
                  <h2>
                    {horario.inicio} às {horario.fim}
                  </h2>
                  <div className="cr-salas">
                    {horario.salas.map((sala) => {
                      const selecionada =
                        selecao?.data === diaAtivo.data &&
                        selecao.inicio === horario.inicio &&
                        selecao.sala === sala
                      return (
                        <button
                          key={sala}
                          type="button"
                          className={`cr-sala${selecionada ? " cr-sala-selecionada" : ""}`}
                          aria-pressed={selecionada}
                          onClick={() =>
                            setSelecao({
                              data: diaAtivo.data,
                              inicio: horario.inicio,
                              fim: horario.fim,
                              sala,
                            })
                          }
                        >
                          Sala {String(sala).padStart(2, "0")}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </section>
          )}

          {selecao && (
            <p className="cr-contagem" aria-live="polite">
              Selecionado: sala {String(selecao.sala).padStart(2, "0")} ·{" "}
              {selecao.inicio}–{selecao.fim} · {formatarData(selecao.data)}
            </p>
          )}
          {erroAcao && (
            <p className="cr-alerta" role="alert">
              {erroAcao}
            </p>
          )}

          <div className="cr-acoes-horarios">
            <button
              type="button"
              className="cr-botao cr-botao-primario cr-botao-largo"
              disabled={!selecao || enviando}
              onClick={confirmarReposicao}
            >
              Confirmar reposição
            </button>
            <button
              type="button"
              className="cr-botao cr-botao-rejeitar cr-botao-largo"
              disabled={enviando}
              onClick={rejeitarReposicao}
            >
              Rejeitar reposição
            </button>
          </div>
        </>
      ) : null}
    </CalendarioReposicaoShell>
  )
}
