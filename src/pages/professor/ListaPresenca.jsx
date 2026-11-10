import { useCallback, useState } from "react"
import { useSearchParams } from "react-router"
import { Check, Trash2, UserPlus, Users } from "lucide-react"
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
const TAMANHO_MINIMO_NOME = 3
const TAMANHO_MAXIMO_OBSERVACAO = 500

// O que o professor mexe na tela. "salvo" é o último envio com sucesso;
// "rascunho" é o que está sendo editado (Cancelar volta para o salvo).
const SEM_ALTERACOES = { mudancas: {}, extras: [], observacao: "" }

// id local para alunos adicionados na tela (o back-end daria o id real).
let contadorNovos = 0
const gerarIdNovo = () => `novo-${++contadorNovos}`

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
  const [salvo, setSalvo] = useState(SEM_ALTERACOES)
  const [rascunho, setRascunho] = useState(SEM_ALTERACOES)
  const [novoNome, setNovoNome] = useState("")
  const [erroNome, setErroNome] = useState("")
  const [enviando, setEnviando] = useState(false)

  if (carregando) return <SkeletonAulas />
  if (erro) return <EstadoErro mensagem={erro.message} aoTentar={recarregar} />
  if (!dados) return null

  const { aula } = dados
  const estado = modoEdicao ? rascunho : salvo
  const alunos = [...dados.alunos, ...estado.extras]

  // A presença é a mudança do aluno, se existir, ou a que veio do service.
  const presencaDe = (aluno) =>
    aluno.id in estado.mudancas ? estado.mudancas[aluno.id] : aluno.presente

  function alternar(aluno) {
    if (!modoEdicao) return
    setRascunho((r) => ({
      ...r,
      mudancas: { ...r.mudancas, [aluno.id]: !presencaDe(aluno) },
    }))
  }

  function editar() {
    setRascunho(salvo)
    setModoEdicao(true)
  }

  function cancelar() {
    setRascunho(salvo) // desfaz o que não foi enviado
    setNovoNome("")
    setErroNome("")
    setModoEdicao(false)
  }

  function adicionarAluno(evento) {
    evento.preventDefault()
    const nome = novoNome.trim().replace(/\s+/g, " ")

    if (nome.length < TAMANHO_MINIMO_NOME) {
      setErroNome(`Digite o nome do aluno (mínimo ${TAMANHO_MINIMO_NOME} letras).`)
      return
    }
    if (/\d/.test(nome)) {
      setErroNome("O nome não pode ter números.")
      return
    }
    const repetido = alunos.some(
      (a) => a.nome.toLocaleLowerCase("pt-BR") === nome.toLocaleLowerCase("pt-BR"),
    )
    if (repetido) {
      setErroNome("Esse aluno já está na lista.")
      return
    }

    const novo = {
      id: gerarIdNovo(),
      nome,
      turma: aula.turma,
      aulasDadas: 0,
      presencas: 0,
      presente: true,
      novo: true,
    }
    setRascunho((r) => ({ ...r, extras: [...r.extras, novo] }))
    setNovoNome("")
    setErroNome("")
  }

  function removerAluno(id) {
    setRascunho((r) => {
      const mudancas = { ...r.mudancas }
      delete mudancas[id]
      return { ...r, mudancas, extras: r.extras.filter((a) => a.id !== id) }
    })
  }

  // Validação antes de enviar: devolve a mensagem de erro, ou null se ok.
  function validarEnvio() {
    if (alunos.length === 0) {
      return "A lista está vazia. Adicione pelo menos um aluno antes de enviar."
    }
    if (!alunos.some(presencaDe)) {
      return "Nenhum aluno marcado como presente. Marque a presença antes de enviar."
    }
    if (novoNome.trim()) {
      return "Você digitou um nome e não adicionou. Toque em Adicionar ou apague o nome."
    }
    return null
  }

  async function enviar() {
    const problema = validarEnvio()
    if (problema) {
      toast.error(problema)
      return
    }

    setEnviando(true)
    const presencas = alunos.map((a) => ({
      alunoId: a.id,
      nome: a.nome,
      presente: presencaDe(a),
    }))
    try {
      await salvarPresencas(aulaId, presencas, rascunho.observacao)
      toast.success("Presença enviada.")
      setSalvo(rascunho)
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

      <section className="tabela-alunos" aria-label={`Alunos do ${aula.turma}`}>
        <div className="tabela-alunos__cabecalho">
          <span>Nome</span>
          <span className="col-centro">P</span>
          <span className="col-centro">Freq.</span>
        </div>

        {alunos.length === 0 && (
          <div className="tabela-alunos__vazio">
            <Users size={28} aria-hidden="true" />
            <p>Nenhum aluno nesta turma ainda.</p>
            <p className="tabela-alunos__dica">
              Toque em <strong>Editar presença</strong> para adicionar alunos.
            </p>
          </div>
        )}

        {alunos.map((aluno) => {
          const presente = presencaDe(aluno)
          const freq = calcularFrequencia(aluno)
          const situacao = situacaoFrequencia(freq)
          return (
            <div className="linha-aluno" key={aluno.id}>
              <div className="linha-aluno__nome">
                <span className="avatar" aria-hidden="true">
                  {aluno.nome.charAt(0).toUpperCase()}
                </span>
                <span className={`nome-aluno nome-aluno--${situacao}`}>
                  {aluno.nome}
                  {aluno.novo && <span className="tag-novo">novo</span>}
                </span>
                {modoEdicao && aluno.novo && (
                  <button
                    type="button"
                    className="remover-aluno"
                    aria-label={`Remover ${aluno.nome}`}
                    onClick={() => removerAluno(aluno.id)}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                )}
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
                {aluno.novo ? (
                  <span className="freq__valor">—</span>
                ) : (
                  <>
                    <div className="freq__barra">
                      <div
                        className={`freq__preenchido freq__preenchido--${situacao}`}
                        style={{ width: `${freq}%` }}
                      />
                    </div>
                    <span className={`freq__valor freq__valor--${situacao}`}>
                      {freq}%
                    </span>
                  </>
                )}
              </div>
            </div>
          )
        })}

        {modoEdicao && (
          <form className="adicionar-aluno" onSubmit={adicionarAluno} noValidate>
            <label className="adicionar-aluno__rotulo" htmlFor="novo-aluno">
              Adicionar aluno
            </label>
            <div className="adicionar-aluno__linha">
              <input
                id="novo-aluno"
                className={`campo ${erroNome ? "campo--erro" : ""}`}
                type="text"
                placeholder="Nome completo do aluno"
                autoComplete="off"
                maxLength={80}
                value={novoNome}
                aria-invalid={Boolean(erroNome)}
                aria-describedby={erroNome ? "novo-aluno-erro" : undefined}
                onChange={(e) => {
                  setNovoNome(e.target.value)
                  if (erroNome) setErroNome("")
                }}
              />
              <button type="submit" className="adicionar-aluno__botao">
                <UserPlus size={16} aria-hidden="true" />
                Adicionar
              </button>
            </div>
            {erroNome && (
              <p id="novo-aluno-erro" className="campo-erro" role="alert">
                {erroNome}
              </p>
            )}
          </form>
        )}
      </section>

      <button
        type="button"
        className="btn-editar"
        onClick={modoEdicao ? cancelar : editar}
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

        {modoEdicao ? (
          <>
            <label className="observacoes__rotulo" htmlFor="observacao-professor">
              Observação do professor
            </label>
            <textarea
              id="observacao-professor"
              className="campo campo--texto"
              rows={3}
              maxLength={TAMANHO_MAXIMO_OBSERVACAO}
              placeholder="Escreva algo sobre a aula ou a turma (opcional)"
              value={rascunho.observacao}
              onChange={(e) =>
                setRascunho((r) => ({ ...r, observacao: e.target.value }))
              }
            />
            <span className="observacoes__contador">
              {rascunho.observacao.length}/{TAMANHO_MAXIMO_OBSERVACAO}
            </span>
          </>
        ) : (
          <>
            <span className="observacoes__rotulo">Observação do professor</span>
            <p className="observacoes__texto">
              {salvo.observacao.trim() ||
                "Nenhuma observação. Toque em Editar presença para escrever."}
            </p>
          </>
        )}
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
