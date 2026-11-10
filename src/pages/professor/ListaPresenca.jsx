import { useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router"
import { RotateCcw, Trash2, UserPlus, Users } from "lucide-react"
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
const TAMANHO_MAXIMO_OBSERVACAO = 1000

// O que o professor mexe na tela. "salvo" é o último envio com sucesso;
// "rascunho" é o que está na tela agora ("Desfazer" volta para o salvo).
// observacao null = o professor ainda não mexeu: mostra o texto automático.
const SEM_ALTERACOES = { mudancas: {}, extras: [], observacao: null }

// id local para alunos adicionados na tela (o back-end daria o id real).
let contadorNovos = 0
const gerarIdNovo = () => `novo-${++contadorNovos}`

export default function ListaPresenca() {
  const [params] = useSearchParams()
  const aulaId = params.get("aula") ?? AULA_PADRAO_ID

  // key={aulaId}: trocar de aula zera as marcações.
  return <ChamadaDaAula key={aulaId} aulaId={aulaId} />
}

// Checkbox "marcar todos": fica no meio (indeterminate) quando só parte está marcada.
function CheckboxTodos({ total, marcados, aoMudar }) {
  const ref = useRef(null)
  const todos = total > 0 && marcados === total
  const alguns = marcados > 0 && marcados < total

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = alguns
  }, [alguns])

  return (
    <input
      ref={ref}
      type="checkbox"
      className="presenca-check"
      aria-label={todos ? "Desmarcar todos" : "Marcar todos como presentes"}
      checked={todos}
      disabled={total === 0}
      onChange={() => aoMudar(!todos)}
    />
  )
}

function ChamadaDaAula({ aulaId }) {
  // Hooks sempre no topo, antes de qualquer return.
  const buscar = useCallback(() => buscarChamada(aulaId), [aulaId])
  const { dados, carregando, erro, recarregar } = useDados(buscar)
  const [salvo, setSalvo] = useState(SEM_ALTERACOES)
  const [rascunho, setRascunho] = useState(SEM_ALTERACOES)
  const [novoNome, setNovoNome] = useState("")
  const [erroNome, setErroNome] = useState("")
  const [enviando, setEnviando] = useState(false)

  if (carregando) return <SkeletonAulas />
  if (erro) return <EstadoErro mensagem={erro.message} aoTentar={recarregar} />
  if (!dados) return null

  const { aula } = dados
  const alunos = [...dados.alunos, ...rascunho.extras]
  const alterado = rascunho !== salvo

  // A presença é a mudança do aluno, se existir, ou a que veio do service.
  const presencaDe = (aluno) =>
    aluno.id in rascunho.mudancas ? rascunho.mudancas[aluno.id] : aluno.presente

  const presentes = alunos.filter(presencaDe).length

  function marcar(aluno, presente) {
    setRascunho((r) => ({
      ...r,
      mudancas: { ...r.mudancas, [aluno.id]: presente },
    }))
  }

  function marcarTodos(presente) {
    setRascunho((r) => ({
      ...r,
      mudancas: Object.fromEntries(alunos.map((a) => [a.id, presente])),
    }))
  }

  function desfazer() {
    setRascunho(salvo)
    setNovoNome("")
    setErroNome("")
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
    if (presentes === 0) {
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
      await salvarPresencas(aulaId, presencas, observacao)
      toast.success("Presença enviada.")
      setSalvo(rascunho)
    } catch (e) {
      // mantém o que foi marcado para tentar de novo
      toast.error(e?.message ?? "Não foi possível enviar a presença.")
    } finally {
      setEnviando(false)
    }
  }

  // Texto inicial das observações, gerado a partir dos dados de frequência.
  // O professor pode editar ou apagar à vontade.
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
  const observacaoAutomatica =
    avisos.length === 0
      ? ""
      : [...avisos, `A frequência mínima exigida é de ${FREQUENCIA_MINIMA}%.`].join("\n")
  const observacao = rascunho.observacao ?? observacaoAutomatica

  return (
    <div className="lista-presenca">
      <div className="lista-presenca__principal">
        <CardDataAula data={aula.data} horario={aula.horario} />

        <section className="tabela-alunos" aria-label={`Alunos do ${aula.turma}`}>
          <div className="tabela-alunos__topo">
            <span className="tabela-alunos__turma">{aula.turma}</span>
            <span className="tabela-alunos__contagem" aria-live="polite">
              {presentes} de {alunos.length} presentes
            </span>
          </div>

          <div className="tabela-alunos__cabecalho">
            <span>Nome</span>
            <span className="col-centro">
              <CheckboxTodos
                total={alunos.length}
                marcados={presentes}
                aoMudar={marcarTodos}
              />
            </span>
            <span className="col-centro">Freq.</span>
          </div>

          {alunos.length === 0 && (
            <div className="tabela-alunos__vazio">
              <Users size={28} aria-hidden="true" />
              <p>Nenhum aluno nesta turma ainda.</p>
              <p className="tabela-alunos__dica">Adicione alunos pelo campo abaixo.</p>
            </div>
          )}

          {alunos.map((aluno) => {
            const presente = presencaDe(aluno)
            const freq = calcularFrequencia(aluno)
            const situacao = situacaoFrequencia(freq)
            const idCheck = `presenca-${aluno.id}`
            return (
              <div
                className={`linha-aluno ${presente ? "" : "linha-aluno--ausente"}`}
                key={aluno.id}
              >
                <div className="linha-aluno__nome">
                  <span className="avatar" aria-hidden="true">
                    {aluno.nome.charAt(0).toUpperCase()}
                  </span>
                  {/* o nome também marca/desmarca (área de toque maior) */}
                  <label htmlFor={idCheck} className={`nome-aluno nome-aluno--${situacao}`}>
                    {aluno.nome}
                    {aluno.novo && <span className="tag-novo">novo</span>}
                  </label>
                  {aluno.novo && (
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
                  <input
                    id={idCheck}
                    type="checkbox"
                    className="presenca-check"
                    checked={presente}
                    onChange={(e) => marcar(aluno, e.target.checked)}
                  />
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
        </section>
      </div>

      <aside className="lista-presenca__lateral">
        <section className="observacoes">
          <label className="observacoes__titulo" htmlFor="observacoes">
            Observações
          </label>
          <textarea
            id="observacoes"
            className="campo campo--texto"
            rows={5}
            maxLength={TAMANHO_MAXIMO_OBSERVACAO}
            placeholder="Escreva algo sobre a aula ou a turma (opcional)"
            value={observacao}
            onChange={(e) => setRascunho((r) => ({ ...r, observacao: e.target.value }))}
          />
          <span className="observacoes__contador">
            {observacao.length}/{TAMANHO_MAXIMO_OBSERVACAO}
          </span>
        </section>

        <div className="lista-presenca__acoes">
          <button
            type="button"
            className="btn-editar"
            disabled={!alterado || enviando}
            onClick={desfazer}
          >
            <RotateCcw size={16} aria-hidden="true" />
            Desfazer alterações
          </button>

          <button
            type="button"
            className="btn-enviar"
            disabled={enviando}
            onClick={enviar}
          >
            {enviando ? "Enviando…" : "Enviar"}
          </button>
        </div>
      </aside>
    </div>
  )
}
