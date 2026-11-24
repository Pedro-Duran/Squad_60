import { ArrowLeft, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { BottomNav } from "@/components/BottomNav"
import { Skeleton } from "@/components/ui/skeleton"
import { atualizarStatusDisciplina, listarDisciplinas } from "@/services/estruturaCurricularService"

const filtros = [
  { id: "todas", label: "TODAS" },
  { id: "ativas", label: "ATIVAS" },
  { id: "inativas", label: "INATIVAS" },
]

export function GerenciarDisciplinas() {
  const navigate = useNavigate()
  const [disciplinas, setDisciplinas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroCarga, setErroCarga] = useState("")
  const [busca, setBusca] = useState("")
  const [filtro, setFiltro] = useState("todas")
  const [atualizandoId, setAtualizandoId] = useState(null)

  async function carregar() {
    setCarregando(true)
    setErroCarga("")
    try {
      const dados = await listarDisciplinas()
      setDisciplinas(dados)
    } catch {
      setErroCarga("Não foi possível carregar as disciplinas.")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    let ativo = true
    async function carregarInicial() {
      try {
        const dados = await listarDisciplinas()
        if (!ativo) return
        setDisciplinas(dados)
        setErroCarga("")
      } catch {
        if (!ativo) return
        setErroCarga("Não foi possível carregar as disciplinas.")
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    void carregarInicial()
    return () => {
      ativo = false
    }
  }, [])

  const totais = useMemo(() => {
    const total = disciplinas.length
    const inativas = disciplinas.filter((d) => !d.ativa).length
    return { total, inativas }
  }, [disciplinas])

  const disciplinasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return disciplinas.filter((disciplina) => {
      const passaBusca = !termo || disciplina.nome.toLowerCase().includes(termo)
      const passaFiltro =
        filtro === "todas" ||
        (filtro === "ativas" && disciplina.ativa) ||
        (filtro === "inativas" && !disciplina.ativa)
      return passaBusca && passaFiltro
    })
  }, [busca, disciplinas, filtro])

  async function handleToggle(disciplina) {
    const novoStatus = !disciplina.ativa
    const anterior = disciplinas
    setAtualizandoId(disciplina.id)
    setDisciplinas((atual) =>
      atual.map((item) =>
        item.id === disciplina.id ? { ...item, ativa: novoStatus } : item,
      ),
    )

    try {
      await atualizarStatusDisciplina(disciplina.id, novoStatus)
    } catch {
      setDisciplinas(anterior)
      toast.error("Não foi possível atualizar a disciplina. Tente novamente.")
    } finally {
      setAtualizandoId(null)
    }
  }

  return (
    <div className="curriculum-page">
      <header className="curriculum-header curriculum-header--menu">
        <button
          type="button"
          className="curriculum-back-circle"
          aria-label="Voltar"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="curriculum-header-copy">
          <p className="curriculum-brand">SEDUC · SERGIPE</p>
          <h1>Gerenciar Disciplinas</h1>
        </div>
      </header>

      <main className="curriculum-main curriculum-main--disciplinas">
        <label className="discipline-search" aria-label="Buscar disciplina">
          <Search size={18} />
          <input
            type="text"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar disciplina..."
          />
        </label>

        <div className="discipline-segmented" role="tablist" aria-label="Filtros de disciplinas">
          {filtros.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filtro === item.id}
              className={`discipline-segment ${filtro === item.id ? "is-active" : ""}`}
              onClick={() => setFiltro(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="discipline-totals">
          TOTAL - {totais.total} DISCIPLINAS ({totais.inativas} INATIVA{totais.inativas === 1 ? "" : "S"})
        </div>

        {carregando ? (
          <div className="discipline-list" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="discipline-card-skeleton">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : erroCarga ? (
          <div className="grade-state">
            <p className="grade-state-title">{erroCarga}</p>
            <p className="grade-state-text">Verifique sua conexão e tente novamente.</p>
            <button type="button" className="grade-retry" onClick={carregar}>
              Tentar novamente
            </button>
          </div>
        ) : disciplinasFiltradas.length === 0 ? (
          <div className="discipline-empty">
            <p className="discipline-empty-title">Nenhuma disciplina encontrada</p>
            <p className="discipline-empty-text">
              Tente ajustar a busca ou o filtro selecionado.
            </p>
          </div>
        ) : (
          <div className="discipline-list">
            {disciplinasFiltradas.map((disciplina) => (
              <article
                key={disciplina.id}
                className={`discipline-card ${disciplina.ativa ? "" : "is-inactive"}`}
              >
                <div className="discipline-card-main">
                  <div className="discipline-card-head">
                    <h2>{disciplina.nome}</h2>
                    <span className={`discipline-status ${disciplina.ativa ? "is-active" : "is-inactive"}`}>
                      {disciplina.ativa ? "ATIVA" : "INATIVA"}
                    </span>
                  </div>
                  <p className="discipline-card-meta">
                    Código: {disciplina.codigo} • {disciplina.modalidade}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={disciplina.ativa}
                  aria-label={`Ativar ou inativar ${disciplina.nome}`}
                  className={`discipline-toggle ${disciplina.ativa ? "is-on" : ""}`}
                  onClick={() => handleToggle(disciplina)}
                  disabled={atualizandoId === disciplina.id}
                >
                  <span className="discipline-toggle-thumb" />
                </button>
              </article>
            ))}
          </div>
        )}
      </main>

      <BottomNav ativo="registros" />
    </div>
  )
}
