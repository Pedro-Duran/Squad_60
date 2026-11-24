import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { AbasAlunos } from "@/components/dge/AbasAlunos"
import { ItemAluno } from "@/components/dge/ItemAluno"
import ModalAdicionarAluno from "@/components/dge/ModalAdicionarAluno"
import SelectFiltro from "@/components/dge/SelectFiltro"
import DgeAppShell from "@/components/layout/DgeAppShell"
import AvisoSucesso from "@/components/shared/AvisoSucesso"
import EstadoErro from "@/components/dge/EstadoErroDge"
import ModalConfirmacao from "@/components/shared/ModalConfirmacao"
import { Button } from "@/components/ui/button"
import {
  adicionarAlunoNaTurma,
  buscarAlunosDaTurma,
  buscarCandidatosParaTurma,
  buscarTurmasDisponiveis,
  removerAlunoDaTurma,
} from "@/services/turmaService"

const TURMAS_VAZIAS = []

export default function GerenciarAlunos() {
  const [turmasState, setTurmasState] = useState(null)
  const [turmaSelecionada, setTurmaSelecionada] = useState("")
  const turmaSelecionadaRef = useRef("")
  const [modalidade, setModalidade] = useState("")
  const [listaState, setListaState] = useState(null)
  const [candidatosState, setCandidatosState] = useState(null)
  const [termoCandidato, setTermoCandidato] = useState("")
  const [tentativa, setTentativa] = useState(0)
  const [versao, setVersao] = useState(0)
  const [alunoParaRemover, setAlunoParaRemover] = useState(null)
  const [adicionarAberto, setAdicionarAberto] = useState(false)
  const [processandoAcao, setProcessandoAcao] = useState(false)
  const [processandoCandidatoId, setProcessandoCandidatoId] = useState("")
  const [erroAcao, setErroAcao] = useState("")
  const [aviso, setAviso] = useState("")

  const turmas = turmasState?.tentativa === tentativa ? turmasState.opcoes : TURMAS_VAZIAS
  const erroTurmas = turmasState?.tentativa === tentativa ? turmasState.erro : null
  const turmaAtual = useMemo(
    () => turmas.find((turma) => turma.chave === turmaSelecionada),
    [turmas, turmaSelecionada]
  )

  useEffect(() => {
    let ativo = true

    buscarTurmasDisponiveis()
      .then((opcoes) => {
        if (!ativo) return
        setTurmasState({ tentativa, opcoes })
        const turmaPreferida = opcoes.find(
          (opcao) => opcao.chave === turmaSelecionadaRef.current
        )
        const turmaInicial = turmaPreferida || opcoes[0]
        if (turmaInicial) {
          turmaSelecionadaRef.current = turmaInicial.chave
          setTurmaSelecionada(turmaInicial.chave)
          setModalidade((atual) =>
            turmaInicial.modalidades.includes(atual) ? atual : turmaInicial.modalidades[0]
          )
        }
      })
      .catch((erro) => {
        if (ativo) setTurmasState({ tentativa, erro })
      })

    return () => {
      ativo = false
    }
  }, [tentativa])

  const chaveLista = turmaAtual
    ? JSON.stringify([turmaAtual.serie, turmaAtual.turno, modalidade, versao, tentativa])
    : ""
  const listaAtual = listaState?.chave === chaveLista
  const alunos = listaAtual ? listaState.alunos : null
  const erroLista = listaAtual ? listaState.erro : null
  const carregando = Boolean(chaveLista) && !listaAtual

  useEffect(() => {
    if (!turmaAtual || !modalidade) return undefined

    let ativo = true
    const chave = JSON.stringify([
      turmaAtual.serie,
      turmaAtual.turno,
      modalidade,
      versao,
      tentativa,
    ])
    buscarAlunosDaTurma(turmaAtual.serie, turmaAtual.turno, modalidade)
      .then((resultado) => {
        if (ativo) setListaState({ chave, alunos: resultado })
      })
      .catch((erro) => {
        if (ativo) setListaState({ chave, erro })
      })

    return () => {
      ativo = false
    }
  }, [turmaAtual, modalidade, versao, tentativa])

  const chaveCandidatos =
    adicionarAberto && turmaAtual
      ? JSON.stringify([
          turmaAtual.serie,
          turmaAtual.turno,
          modalidade,
          termoCandidato,
          versao,
        ])
      : ""
  const candidatosAtuais = candidatosState?.chave === chaveCandidatos
  const candidatos = candidatosAtuais ? candidatosState.alunos : []
  const erroCandidatos = candidatosAtuais ? candidatosState.erro : ""
  const carregandoCandidatos = Boolean(chaveCandidatos) && !candidatosAtuais

  useEffect(() => {
    if (!adicionarAberto || !turmaAtual || !modalidade) return undefined

    let ativo = true
    const chave = JSON.stringify([
      turmaAtual.serie,
      turmaAtual.turno,
      modalidade,
      termoCandidato,
      versao,
    ])
    buscarCandidatosParaTurma(
      turmaAtual.serie,
      turmaAtual.turno,
      modalidade,
      termoCandidato
    )
      .then((resultado) => {
        if (ativo) setCandidatosState({ chave, alunos: resultado })
      })
      .catch((erro) => {
        if (ativo) setCandidatosState({ chave, erro: erro.message })
      })

    return () => {
      ativo = false
    }
  }, [adicionarAberto, turmaAtual, modalidade, termoCandidato, versao])

  useEffect(() => {
    if (!aviso) return undefined
    const timer = window.setTimeout(() => setAviso(""), 3000)
    return () => window.clearTimeout(timer)
  }, [aviso])

  const buscarCandidatos = useCallback((termo) => {
    setTermoCandidato(termo)
  }, [])

  function selecionarTurma(chave) {
    const turma = turmas.find((opcao) => opcao.chave === chave)
    if (!turma) return
    turmaSelecionadaRef.current = chave
    setTurmaSelecionada(chave)
    setModalidade(turma.modalidades[0])
    setAviso("")
  }

  async function confirmarRemocao() {
    if (!alunoParaRemover) return
    setProcessandoAcao(true)
    setErroAcao("")
    try {
      await removerAlunoDaTurma(alunoParaRemover.id)
      setAlunoParaRemover(null)
      setVersao((valor) => valor + 1)
      setAviso("Turma Editada Com Sucesso")
    } catch (erroRemocao) {
      setErroAcao(erroRemocao.message)
    } finally {
      setProcessandoAcao(false)
    }
  }

  async function adicionarAluno(aluno) {
    if (!turmaAtual) return
    setProcessandoCandidatoId(aluno.id)
    setErroAcao("")
    try {
      await adicionarAlunoNaTurma(
        aluno.id,
        turmaAtual.serie,
        turmaAtual.turno,
        modalidade
      )
      setAdicionarAberto(false)
      setVersao((valor) => valor + 1)
      setAviso("Turma Editada Com Sucesso")
    } catch (erroAdicao) {
      setErroAcao(erroAdicao.message)
    } finally {
      setProcessandoCandidatoId("")
    }
  }

  const opcoesTurma = turmas.map((turma) => ({
    value: turma.chave,
    label: `${turma.serie} - ${turma.turno}`,
  }))
  const opcoesModalidade = (turmaAtual?.modalidades || []).map((opcao) => ({
    value: opcao,
    label: opcao,
  }))

  return (
    <DgeAppShell>
      <div className="flex h-[calc(100dvh-100px)] min-h-0 flex-col overflow-hidden">
        <div className="shrink-0">
          <AbasAlunos ativa="gerenciar" />
          <header className="border-b border-border bg-card px-4 py-4 text-center">
            <h1 className="text-[22px] leading-7 font-bold text-foreground">Gerenciar Alunos</h1>
          </header>
        </div>

        <main className="flex min-h-0 flex-1 flex-col bg-background">
          {aviso && (
            <div className="shrink-0 px-5 pt-4">
              <AvisoSucesso>
                <span className="text-sm font-bold">{aviso}</span>
              </AvisoSucesso>
            </div>
          )}

          <div className="shrink-0 space-y-4 px-5 pb-3 pt-4">
            <SelectFiltro
              id="filtro-turma"
              label="TURMA"
              value={turmaSelecionada}
              options={opcoesTurma}
              onChange={selecionarTurma}
              disabled={!opcoesTurma.length}
            />
            <SelectFiltro
              id="filtro-modalidade"
              label="MODALIDADE"
              value={modalidade}
              options={opcoesModalidade}
              onChange={(valor) => {
                setModalidade(valor)
                setAviso("")
              }}
              disabled={!opcoesModalidade.length}
            />
            <div className="flex h-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
              {carregando
                ? "CARREGANDO ALUNOS…"
                : `TOTAL - ${alunos?.length ?? 0} ${alunos?.length === 1 ? "ALUNO" : "ALUNOS"}`}
            </div>
          </div>

          {erroTurmas || erroLista ? (
            <div className="px-5">
              <EstadoErro
                titulo="Não foi possível carregar a turma."
                textoBotao="Tentar novamente"
                onTentarNovamente={() => setTentativa((valor) => valor + 1)}
              />
            </div>
          ) : (
            <div
              aria-label="Alunos da turma"
              className="min-h-0 flex-1 space-y-2 overflow-y-auto px-5 pb-3"
            >
              {carregando ? (
                <p role="status" className="py-3 text-center text-sm text-muted-foreground">
                  Carregando alunos…
                </p>
              ) : alunos?.length ? (
                alunos.map((aluno) => (
                  <ItemAluno
                    key={aluno.id}
                    aluno={aluno}
                    acao={{
                      icone: Trash2,
                      label: `Remover ${aluno.nome} da turma`,
                      onClick: () => {
                        setErroAcao("")
                        setAlunoParaRemover(aluno)
                      },
                    }}
                  />
                ))
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Nenhum aluno nesta turma.
                </p>
              )}
            </div>
          )}

          <div className="shrink-0 px-5 pb-4 pt-2">
            <Button
              type="button"
              onClick={() => {
                setErroAcao("")
                setTermoCandidato("")
                setAdicionarAberto(true)
              }}
              disabled={!turmaAtual || !modalidade}
              className="h-[52px] w-full rounded-full text-sm font-bold shadow-md"
            >
              <Plus aria-hidden="true" className="size-4" strokeWidth={3} />
              ADICIONAR ALUNO
            </Button>
          </div>
        </main>
      </div>

      <ModalConfirmacao
        open={Boolean(alunoParaRemover)}
        aluno={alunoParaRemover}
        onCancelar={() => {
          setAlunoParaRemover(null)
          setErroAcao("")
        }}
        onConfirmar={confirmarRemocao}
        processando={processandoAcao}
        erro={erroAcao}
      />
      <ModalAdicionarAluno
        open={adicionarAberto}
        termo={termoCandidato}
        candidatos={candidatos}
        carregando={carregandoCandidatos}
        onBuscar={buscarCandidatos}
        onAdicionar={adicionarAluno}
        processandoId={processandoCandidatoId}
        erro={erroCandidatos || erroAcao}
        onFechar={() => {
          setAdicionarAberto(false)
          setErroAcao("")
        }}
      />
    </DgeAppShell>
  )
}
