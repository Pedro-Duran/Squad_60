import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  XCircle,
} from "lucide-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router"

const dadosBase = [
  {
    id: 1,
    professor: "Marina Costa",
    disciplina: "Matemática",
    turma: "3º A",
    turno: "Tarde",
    data: "18/09/2026",
    horario: "07:00 – 08:40",
    sala: "A-12",
    status: "Solicitada",
  },
  {
    id: 2,
    professor: "Rafael Souza",
    disciplina: "Língua Portuguesa",
    turma: "2º B",
    turno: "Manhã",
    data: "20/09/2026",
    horario: "09:00 – 10:40",
    sala: "B-04",
    status: "Aprovada",
  },
  {
    id: 3,
    professor: "Joana Martins",
    disciplina: "História",
    turma: "1º C",
    turno: "Tarde",
    data: "22/09/2026",
    horario: "13:00 – 14:40",
    sala: "C-02",
    status: "Negada",
  },
  {
    id: 4,
    professor: "Pedro Alves",
    disciplina: "Física",
    turma: "2º D",
    turno: "Manhã",
    data: "24/09/2026",
    horario: "08:00 – 09:20",
    sala: "D-07",
    status: "Solicitada",
  },
  {
    id: 5,
    professor: "Clara Nunes",
    disciplina: "Química",
    turma: "1º A",
    turno: "Noite",
    data: "25/09/2026",
    horario: "18:10 – 19:40",
    sala: "Laboratório 2",
    status: "Aprovada",
  },
]

const abas = ["Solicitadas", "Aprovadas", "Negadas"]

function formatarDataExtenso() {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date())
}

function statusVariant(status) {
  if (status === "Aprovada") return "status-aprovada"
  if (status === "Negada") return "status-negada"
  return "status-solicitada"
}

function ReposicaoCard({ item }) {
  return (
    <article className="reposition-card">
      <div className={`reposition-accent ${statusVariant(item.status)}`} />
      <div className="reposition-body">
        <div className="reposition-header">
          <div>
            <p className="reposition-professor">{item.professor}</p>
            <h3>{item.disciplina}</h3>
          </div>
          <span className={`status-badge ${statusVariant(item.status)}`}>
            {item.status}
          </span>
        </div>

        <p className="reposition-meta">
          {item.turma} · {item.turno}
        </p>

        <div className="reposition-info">
          <span>
            <CalendarDays size={14} />
            {item.data}
          </span>
          <span>
            <Clock3 size={14} />
            {item.horario}
          </span>
          <span>
            <Search size={14} />
            {item.sala}
          </span>
        </div>

      </div>
    </article>
  )
}

export function ProfessorHome() {
  const navigate = useNavigate()
  const resumoPadrao = [
    { id: "aulas", label: "Aulas pendentes", valor: 4, destaque: true },
    { id: "reposicoes", label: "Reposições agendadas", valor: 7 },
    { id: "horarios", label: "Horários disponíveis", valor: 12 },
    { id: "solicitacoes", label: "Solicitações pendentes", valor: 3 },
  ]

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-brand-wrap">
          <span className="home-brand">SEDUC</span>
          <span className="home-brand home-brand--sub">SERGIPE</span>
        </div>

        <div className="home-header-main">
          <div className="home-user-copy">
            <p className="home-greeting">Painel do coordenador</p>
            <p className="home-date">{formatarDataExtenso()}</p>
          </div>
        </div>
      </header>

      <main className="home-main">
        <section className="summary-grid" aria-label="Resumo">
          {resumoPadrao.map((item) => (
            <article
              key={item.id}
              className={`summary-card ${item.destaque ? "summary-card--featured" : ""}`}
            >
              <span className="summary-label">{item.label}</span>
              <strong className="summary-value">{item.valor}</strong>
            </article>
          ))}
        </section>

        <section className="reposition-section">
          <div className="section-header">
            <h2>Solicitações de reposição</h2>
          </div>

          <div className="reposition-list">
            {dadosBase.filter((item) => item.status === "Solicitada").map((item) => (
              <ReposicaoCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <button type="button" className="primary-action" onClick={() => navigate("/coordenador/reposicoes")}>
          Gerenciar reposições
        </button>
      </main>

    </div>
  )
}

export function GerenciarReposicoes() {
  const navigate = useNavigate()
  const [aba, setAba] = useState("Solicitadas")
  const [lista, setLista] = useState(dadosBase)
  const [selecionadoId, setSelecionadoId] = useState(null)
  const [form, setForm] = useState({ sala: "", dia: "2026-09-25", horario: "08:00 – 09:20" })

  const listaFiltrada = useMemo(() => {
    if (aba === "Aprovadas") return lista.filter((item) => item.status === "Aprovada")
    if (aba === "Negadas") return lista.filter((item) => item.status === "Negada")
    return lista.filter((item) => item.status === "Solicitada")
  }, [aba, lista])

  function handleSalvar() {
    setLista((atual) =>
      atual.map((item) => {
        if (item.id !== selecionadoId) return item
        return {
          ...item,
          sala: form.sala || item.sala,
          data: form.dia || item.data,
          horario: form.horario || item.horario,
          status: "Aprovada",
        }
      }),
    )

    setSelecionadoId(null)
    setForm({ sala: "", dia: "2026-09-25", horario: "08:00 – 09:20" })
  }

  function handleNegar(id) {
    setLista((atual) =>
      atual.map((item) => (item.id === id ? { ...item, status: "Negada" } : item)),
    )
  }

  return (
    <div className="page-shell page-shell--manager">
      <header className="page-header">
        <button type="button" className="back-link" onClick={() => navigate("/coordenador")}>
          ← Voltar
        </button>
        <h1>Gerenciar reposições</h1>
      </header>

      <main className="manager-main">
        <div className="tabs-row" role="tablist" aria-label="Filtros de status">
          {abas.map((abaAtual) => (
            <button
              key={abaAtual}
              type="button"
              className={`tab-button ${aba === abaAtual ? "tab-button--active" : ""}`}
              onClick={() => setAba(abaAtual)}
            >
              {abaAtual}
            </button>
          ))}
        </div>

        {selecionadoId && (
          <div className="assignment-card">
            <h2>Marcar reposição</h2>
            <div className="field-grid">
              <label>
                Sala
                <input
                  value={form.sala}
                  onChange={(event) => setForm((atual) => ({ ...atual, sala: event.target.value }))}
                  placeholder="Ex.: A-12"
                />
              </label>

              <label>
                Dia
                <input
                  type="date"
                  value={form.dia}
                  onChange={(event) => setForm((atual) => ({ ...atual, dia: event.target.value }))}
                />
              </label>

              <label>
                Horário
                <input
                  value={form.horario}
                  onChange={(event) => setForm((atual) => ({ ...atual, horario: event.target.value }))}
                  placeholder="Ex.: 07:00 – 08:40"
                />
              </label>
            </div>

            <div className="action-row">
              <button type="button" className="secondary-button" onClick={() => setSelecionadoId(null)}>
                Cancelar
              </button>
              <button type="button" className="primary-button" onClick={handleSalvar}>
                Salvar
              </button>
            </div>
          </div>
        )}

        {listaFiltrada.length > 0 ? (
          <div className="manager-list">
            {listaFiltrada.map((item) => (
              <div key={item.id} className="manager-item">
                <div className="manager-item__top">
                  <div>
                    <p className="manager-item__label">{item.professor}</p>
                    <h3>{item.disciplina}</h3>
                  </div>
                  <span className={`status-badge ${statusVariant(item.status)}`}>{item.status}</span>
                </div>

                <p className="manager-item__meta">
                  {item.turma} · {item.turno}
                </p>

                <div className="manager-item__details">
                  <span><CalendarDays size={14} /> {item.data}</span>
                  <span><Clock3 size={14} /> {item.horario}</span>
                  <span><Search size={14} /> {item.sala}</span>
                </div>

                {item.status === "Solicitada" && (
                  <div className="manager-actions">
                    <button type="button" className="approve-button" onClick={() => setSelecionadoId(item.id)}>
                      <CheckCircle2 size={14} />
                      Aprovar
                    </button>
                    <button type="button" className="reject-button" onClick={() => handleNegar(item.id)}>
                      <XCircle size={14} />
                      Negar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">Nenhuma reposição nesta categoria.</div>
        )}
      </main>
    </div>
  )
}
