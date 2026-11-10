import { useEffect, useMemo, useState } from "react"
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookOpen,
  Check,
  ClipboardList,
  Grip,
  Home,
  Plus,
  Save,
  School,
  X,
} from "lucide-react"
import { useNavigate } from "react-router"
import "./ConteudoProgramatico.css"

const STORAGE_KEY = "squad60:conteudos-programaticos"

const DISCIPLINAS = [
  "Arte",
  "Ciências",
  "Educação Física",
  "Geografia",
  "História",
  "Língua Portuguesa",
  "Matemática",
]

const SERIES = [
  "1º Ano",
  "2º Ano",
  "3º Ano",
  "4º Ano",
  "5º Ano",
  "6º Ano",
  "7º Ano",
  "8º Ano",
  "9º Ano",
]

const CONTEUDOS_INICIAIS = {
  "Matemática|7º Ano": [
    {
      id: "equacoes-primeiro-grau",
      titulo: "Equações do 1º grau",
      descricao:
        "Resolução e interpretação de equações lineares com uma incógnita.",
    },
    {
      id: "problemas-equacoes",
      titulo: "Problemas com equações",
      descricao: "Resolução de problemas utilizando equações do 1º grau.",
    },
  ],
}

function clonarListas(listas) {
  return Object.fromEntries(
    Object.entries(listas).map(([chave, itens]) => [
      chave,
      itens.map((item) => ({ ...item })),
    ]),
  )
}

function carregarListasSalvas() {
  const dadosSalvos = localStorage.getItem(STORAGE_KEY)
  if (!dadosSalvos) return clonarListas(CONTEUDOS_INICIAIS)

  try {
    const listas = JSON.parse(dadosSalvos)
    if (!listas || typeof listas !== "object" || Array.isArray(listas)) {
      throw new Error("Formato de conteúdos programáticos inválido.")
    }

    return {
      ...clonarListas(CONTEUDOS_INICIAIS),
      ...listas,
    }
  } catch (erro) {
    console.error("Não foi possível carregar os conteúdos salvos.", erro)
    return clonarListas(CONTEUDOS_INICIAIS)
  }
}

function criarEstadoInicial() {
  const listasSalvas = carregarListasSalvas()
  return {
    listasSalvas,
    listasRascunho: clonarListas(listasSalvas),
  }
}

export default function ConteudoProgramatico() {
  const navigate = useNavigate()
  const [disciplina, setDisciplina] = useState("")
  const [serie, setSerie] = useState("")
  const [listas, setListas] = useState(criarEstadoInicial)
  const [adicionando, setAdicionando] = useState(false)
  const [novoTitulo, setNovoTitulo] = useState("")
  const [novaDescricao, setNovaDescricao] = useState("")
  const [erroNovoTitulo, setErroNovoTitulo] = useState("")
  const [conteudoAberto, setConteudoAberto] = useState("")
  const [editandoId, setEditandoId] = useState("")
  const [tituloEditado, setTituloEditado] = useState("")
  const [descricaoEditada, setDescricaoEditada] = useState("")
  const [reorganizando, setReorganizando] = useState(false)
  const [mensagem, setMensagem] = useState("")
  const [erroSalvamento, setErroSalvamento] = useState("")

  const chaveLista = disciplina && serie ? `${disciplina}|${serie}` : ""
  const conteudos = chaveLista
    ? listas.listasRascunho[chaveLista] ?? []
    : []
  const alteracoesPendentes = useMemo(
    () =>
      Object.keys(listas.listasRascunho).some(
        (chave) =>
          JSON.stringify(listas.listasRascunho[chave]) !==
          JSON.stringify(listas.listasSalvas[chave] ?? []),
      ),
    [listas],
  )

  useEffect(() => {
    if (!alteracoesPendentes) return undefined

    function avisarAoSair(evento) {
      evento.preventDefault()
      evento.returnValue = ""
    }

    window.addEventListener("beforeunload", avisarAoSair)
    return () => window.removeEventListener("beforeunload", avisarAoSair)
  }, [alteracoesPendentes])

  function atualizarLista(atualizar) {
    if (!chaveLista) return

    setListas((estado) => {
      const listaAtual = estado.listasRascunho[chaveLista] ?? []
      return {
        ...estado,
        listasRascunho: {
          ...estado.listasRascunho,
          [chaveLista]: atualizar(listaAtual),
        },
      }
    })
    setMensagem("")
    setErroSalvamento("")
  }

  function limparInteracoes() {
    setAdicionando(false)
    setNovoTitulo("")
    setNovaDescricao("")
    setErroNovoTitulo("")
    setConteudoAberto("")
    setEditandoId("")
    setTituloEditado("")
    setDescricaoEditada("")
    setReorganizando(false)
  }

  function voltar() {
    if (
      alteracoesPendentes &&
      !window.confirm(
        "Há alterações não salvas. Deseja sair sem salvar o conteúdo programático?",
      )
    ) {
      return
    }
    navigate(-1)
  }

  function adicionarConteudo(evento) {
    evento.preventDefault()
    const titulo = novoTitulo.trim()
    if (!titulo) {
      setErroNovoTitulo("Informe o título do conteúdo.")
      return
    }

    atualizarLista((itens) => [
      ...itens,
      { id: crypto.randomUUID(), titulo, descricao: novaDescricao.trim() },
    ])
    setNovoTitulo("")
    setNovaDescricao("")
    setErroNovoTitulo("")
    setAdicionando(false)
  }

  function iniciarEdicao(item) {
    setConteudoAberto(item.id)
    setEditandoId(item.id)
    setTituloEditado(item.titulo)
    setDescricaoEditada(item.descricao ?? "")
  }

  function salvarEdicao(evento) {
    evento.preventDefault()
    const titulo = tituloEditado.trim()
    if (!titulo) return
    const descricao = descricaoEditada.trim()

    atualizarLista((itens) =>
      itens.map((item) =>
        item.id === editandoId ? { ...item, titulo, descricao } : item,
      ),
    )
    setEditandoId("")
    setTituloEditado("")
    setDescricaoEditada("")
  }

  function removerConteudo(id) {
    atualizarLista((itens) => itens.filter((item) => item.id !== id))
    setConteudoAberto("")
    setEditandoId("")
  }

  function moverConteudo(indice, deslocamento) {
    atualizarLista((itens) => {
      const destino = indice + deslocamento
      if (destino < 0 || destino >= itens.length) return itens
      const novaLista = [...itens]
      ;[novaLista[indice], novaLista[destino]] = [
        novaLista[destino],
        novaLista[indice],
      ]
      return novaLista
    })
  }

  function salvarPrograma() {
    if (!chaveLista) return

    const listaAtualizada = clonarListas({ atual: conteudos }).atual
    const listasSalvas = {
      ...listas.listasSalvas,
      [chaveLista]: listaAtualizada,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(listasSalvas))
    } catch (erro) {
      console.error("Não foi possível salvar o conteúdo programático.", erro)
      setErroSalvamento("Não foi possível salvar. Tente novamente.")
      setMensagem("")
      return
    }

    setListas((estado) => ({
      listasSalvas,
      listasRascunho: {
        ...estado.listasRascunho,
        [chaveLista]: listaAtualizada,
      },
    }))
    setMensagem("Conteúdo programático salvo com sucesso!")
    setErroSalvamento("")
  }

  return (
    <div className="programa-page">
      <header className="programa-header">
        <div className="programa-header__inner">
          <button
            className="programa-back"
            type="button"
            onClick={voltar}
            aria-label="Voltar"
          >
            <ArrowLeft aria-hidden="true" />
          </button>
          <div className="programa-header__title">
            <span>SEDUC · SERGIPE</span>
            <h1>Conteúdo programático</h1>
          </div>
          <span className="programa-header__spacer" aria-hidden="true" />
        </div>
      </header>

      <main className="programa-main">
        <section
          className="programa-summary"
          aria-label="Resumo do conteúdo programático"
        >
          <div className="programa-summary__subject">
            <span>Disciplina</span>
            <h2>{disciplina || "Selecione uma disciplina"}</h2>
            <div className="programa-summary__meta">
              <span>{serie || "Série"}</span>
              <span>
                {conteudos.length}{" "}
                {conteudos.length === 1 ? "conteúdo" : "conteúdos"}
              </span>
            </div>
          </div>
        </section>

        <section
          className="programa-card programa-filters"
          aria-labelledby="filtros-title"
        >
          <div className="programa-section-heading">
            <span>Personalize sua visualização</span>
            <h2 id="filtros-title">Filtrar por</h2>
          </div>
          <div className="programa-filter-grid">
            <label className="programa-field" htmlFor="disciplina">
              <span>Disciplina</span>
              <select
                id="disciplina"
                value={disciplina}
                onChange={(evento) => {
                  setDisciplina(evento.target.value)
                  setMensagem("")
                  setErroSalvamento("")
                  limparInteracoes()
                }}
              >
                <option value="">Selecione a disciplina</option>
                {DISCIPLINAS.map((opcao) => (
                  <option key={opcao} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            </label>
            <label className="programa-field" htmlFor="serie">
              <span>Série</span>
              <select
                id="serie"
                value={serie}
                onChange={(evento) => {
                  setSerie(evento.target.value)
                  setMensagem("")
                  setErroSalvamento("")
                  limparInteracoes()
                }}
              >
                <option value="">Selecione a série</option>
                {SERIES.map((opcao) => (
                  <option key={opcao} value={opcao}>
                    {opcao}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="programa-content" aria-labelledby="conteudos-title">
          <div className="programa-content__heading">
            <div className="programa-section-heading">
              <span>Planejamento do ano letivo</span>
              <h2 id="conteudos-title">Conteúdos cadastrados</h2>
              <p>Organize os temas que serão trabalhados ao longo do ano.</p>
            </div>
            <button
              className={`programa-button programa-button--outline${reorganizando ? " is-active" : ""}`}
              type="button"
              onClick={() => {
                setReorganizando((atual) => !atual)
                setConteudoAberto("")
                setEditandoId("")
              }}
              disabled={!chaveLista || conteudos.length < 2}
            >
              {reorganizando ? (
                <Check aria-hidden="true" />
              ) : (
                <Grip aria-hidden="true" />
              )}
              {reorganizando ? "Concluir" : "Reorganizar"}
            </button>
          </div>

          {!chaveLista ? (
            <div className="programa-empty">
              <School aria-hidden="true" />
              <h3>Escolha uma disciplina e uma série</h3>
              <p>Os conteúdos correspondentes aparecerão aqui.</p>
            </div>
          ) : conteudos.length === 0 ? (
            <div className="programa-empty">
              <BookOpen aria-hidden="true" />
              <h3>Nenhum conteúdo cadastrado</h3>
              <p>Adicione o primeiro conteúdo para esta disciplina e série.</p>
            </div>
          ) : (
            <ol className="programa-list">
              {conteudos.map((item, indice) => (
                <li className="programa-item" key={item.id}>
                  <span className="programa-item__number">{indice + 1}</span>
                  {reorganizando ? (
                    <>
                      <span className="programa-item__title">{item.titulo}</span>
                      <div className="programa-item__move">
                        <button
                          className="programa-icon-button"
                          type="button"
                          aria-label={`Mover ${item.titulo} para cima`}
                          disabled={indice === 0}
                          onClick={() => moverConteudo(indice, -1)}
                        >
                          <ArrowUp aria-hidden="true" />
                        </button>
                        <button
                          className="programa-icon-button"
                          type="button"
                          aria-label={`Mover ${item.titulo} para baixo`}
                          disabled={indice === conteudos.length - 1}
                          onClick={() => moverConteudo(indice, 1)}
                        >
                          <ArrowDown aria-hidden="true" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="programa-item__body">
                      <button
                        className="programa-item__toggle"
                        type="button"
                        aria-expanded={conteudoAberto === item.id}
                        onClick={() => {
                          setConteudoAberto((aberto) =>
                            aberto === item.id ? "" : item.id,
                          )
                          setEditandoId("")
                        }}
                      >
                        <span>{item.titulo}</span>
                        <span
                          className={`programa-item__chevron${conteudoAberto === item.id ? " is-open" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                      {conteudoAberto === item.id && (
                        <div className="programa-item__details">
                          {editandoId === item.id ? (
                            <form
                              className="programa-inline-form"
                              onSubmit={salvarEdicao}
                            >
                              <h3>Editar conteúdo</h3>
                              <label htmlFor={`editar-titulo-${item.id}`}>
                                Título
                              </label>
                              <input
                                id={`editar-titulo-${item.id}`}
                                autoFocus
                                value={tituloEditado}
                                onChange={(evento) =>
                                  setTituloEditado(evento.target.value)
                                }
                              />
                              <label htmlFor={`editar-descricao-${item.id}`}>
                                Descrição
                              </label>
                              <textarea
                                id={`editar-descricao-${item.id}`}
                                value={descricaoEditada}
                                onChange={(evento) =>
                                  setDescricaoEditada(evento.target.value)
                                }
                              />
                              <div className="programa-inline-form__actions">
                                <button
                                  className="programa-button programa-button--outline"
                                  type="button"
                                  onClick={() => {
                                    setEditandoId("")
                                    setTituloEditado("")
                                    setDescricaoEditada("")
                                  }}
                                >
                                  Cancelar
                                </button>
                                <button
                                  className="programa-button programa-button--primary"
                                  type="submit"
                                  disabled={!tituloEditado.trim()}
                                >
                                  Salvar edição
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="programa-item__expanded">
                              <p>
                                {item.descricao ||
                                  "Nenhuma descrição informada."}
                              </p>
                              <div className="programa-item__actions">
                                <button
                                  className="programa-button programa-button--edit"
                                  type="button"
                                  onClick={() => iniciarEdicao(item)}
                                >
                                  Editar conteúdo
                                </button>
                                <button
                                  className="programa-button programa-button--danger"
                                  type="button"
                                  onClick={() => removerConteudo(item.id)}
                                >
                                  <X aria-hidden="true" />
                                  Remover conteúdo
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}

          {chaveLista &&
            (adicionando ? (
              <form
                className="programa-add-form"
                onSubmit={adicionarConteudo}
              >
                <h3>Novo conteúdo</h3>
                <label htmlFor="novo-conteudo">Título</label>
                <input
                  id="novo-conteudo"
                  autoFocus
                  placeholder="Digite o título do conteúdo"
                  value={novoTitulo}
                  onChange={(evento) => {
                    setNovoTitulo(evento.target.value)
                    setErroNovoTitulo("")
                  }}
                  aria-invalid={Boolean(erroNovoTitulo)}
                  aria-describedby={
                    erroNovoTitulo ? "novo-conteudo-erro" : undefined
                  }
                />
                <label htmlFor="nova-descricao">
                  Descrição <span>(opcional)</span>
                </label>
                <textarea
                  id="nova-descricao"
                  placeholder="Descreva o conteúdo programático"
                  value={novaDescricao}
                  onChange={(evento) => setNovaDescricao(evento.target.value)}
                />
                {erroNovoTitulo && (
                  <p className="programa-form-error" id="novo-conteudo-erro">
                    {erroNovoTitulo}
                  </p>
                )}
                <div className="programa-inline-form__actions">
                  <button
                    className="programa-button programa-button--outline"
                    type="button"
                    onClick={() => {
                      setAdicionando(false)
                      setNovoTitulo("")
                      setNovaDescricao("")
                      setErroNovoTitulo("")
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="programa-button programa-button--primary"
                    type="submit"
                  >
                    <Plus aria-hidden="true" />
                    Adicionar conteúdo
                  </button>
                </div>
              </form>
            ) : (
              <button
                className="programa-button programa-button--add"
                type="button"
                onClick={() => {
                  setAdicionando(true)
                  setReorganizando(false)
                  setConteudoAberto("")
                }}
              >
                <Plus aria-hidden="true" />
                Adicionar conteúdo
              </button>
            ))}

          {chaveLista && (
            <button
              className="programa-button programa-button--save"
              type="button"
              onClick={salvarPrograma}
            >
              <Save aria-hidden="true" />
              Salvar conteúdo programático
            </button>
          )}
          {mensagem && (
            <p className="programa-success" role="status">
              <Check aria-hidden="true" />
              {mensagem}
            </p>
          )}
          {erroSalvamento && (
            <p className="programa-form-error" role="alert">
              {erroSalvamento}
            </p>
          )}
        </section>
      </main>

      <footer className="programa-footer">
        <nav className="programa-footer__nav" aria-label="Navegação principal">
          <span className="is-current">
            <Home aria-hidden="true" />
            Início
          </span>
          <span>
            <ClipboardList aria-hidden="true" />
            Solicitações
          </span>
        </nav>
        <p>©2026 Desenvolvido por SQUAD 60</p>
      </footer>
    </div>
  )
}