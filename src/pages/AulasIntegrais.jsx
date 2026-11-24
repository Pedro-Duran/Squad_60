import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { BottomNav } from "@/components/BottomNav"
import { Skeleton } from "@/components/ui/skeleton"
import { obterGradeIntegral, obterOpcoesGrade, salvarGradeIntegral } from "@/services/estruturaCurricularService"

const dias = [
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
]

function horaParaMinutos(hora) {
  if (!hora) return 0
  const [h, m] = hora.split(":").map(Number)
  return h * 60 + m
}

function formatarCarga(minutos) {
  const horas = minutos / 60
  const valor = Number.isInteger(horas) ? String(horas) : horas.toFixed(1).replace(".", ",")
  return `${valor}h`
}

function gerarId() {
  return `atv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function ordenarAtividades(atividades) {
  return [...atividades].sort((a, b) => horaParaMinutos(a.inicio) - horaParaMinutos(b.inicio))
}

function periodoDaAtividade(inicio) {
  return horaParaMinutos(inicio) < 12 * 60 ? "MANHÃ" : "TARDE"
}

function calcularConflitos(atividades) {
  const conflitosPorId = {}
  const ordenadas = ordenarAtividades(atividades)
  for (let i = 0; i < ordenadas.length; i += 1) {
    for (let j = i + 1; j < ordenadas.length; j += 1) {
      const a = ordenadas[i]
      const b = ordenadas[j]
      const sobrepoe =
        horaParaMinutos(a.inicio) < horaParaMinutos(b.fim) &&
        horaParaMinutos(b.inicio) < horaParaMinutos(a.fim)
      if (!sobrepoe) continue
      const mesmoProfessor = a.professor && b.professor && a.professor === b.professor
      const mesmaSala = a.sala && b.sala && a.sala === b.sala
      if (mesmoProfessor || mesmaSala) {
        conflitosPorId[a.id] = [...(conflitosPorId[a.id] || []), `Conflito com ${b.inicio} a ${b.fim}`]
        conflitosPorId[b.id] = [...(conflitosPorId[b.id] || []), `Conflito com ${a.inicio} a ${a.fim}`]
      }
    }
  }
  return conflitosPorId
}

function criarFormularioVazio() {
  return { id: null, disciplina: "", professor: "", sala: "", inicio: "", fim: "", repetirDias: [] }
}

export function AulasIntegrais() {
  const navigate = useNavigate()
  const [opcoes, setOpcoes] = useState({ turmas: [], disciplinas: [], professores: [], salas: [], cargaEsperadaMin: 540 })
  const [turmaId, setTurmaId] = useState("")
  const [diaAtivo, setDiaAtivo] = useState("seg")
  const [gradePorDia, setGradePorDia] = useState({})
  const [diasAlterados, setDiasAlterados] = useState({})
  const [carregandoOpcoes, setCarregandoOpcoes] = useState(true)
  const [carregandoGrade, setCarregandoGrade] = useState(false)
  const [erro, setErro] = useState("")
  const [salvando, setSalvando] = useState(false)
  const [sheetAberto, setSheetAberto] = useState(false)
  const [form, setForm] = useState(criarFormularioVazio())
  const [menuAbertoId, setMenuAbertoId] = useState(null)
  const [recarga, setRecarga] = useState(0)
  const gradePorDiaRef = useRef({})
  const diasAlteradosRef = useRef({})

  useEffect(() => {
    gradePorDiaRef.current = gradePorDia
  }, [gradePorDia])

  useEffect(() => {
    diasAlteradosRef.current = diasAlterados
  }, [diasAlterados])

  const carregarGrade = useCallback(async (turma, dia, sinalAtivo) => {
    try {
      const dados = await obterGradeIntegral({ turmaId: turma, dia })
      if (sinalAtivo && !sinalAtivo.ativo) return
      setGradePorDia((atual) => ({
        ...atual,
        [turma]: {
          ...(atual[turma] || {}),
          [dia]: {
            atividades: ordenarAtividades(dados.atividades || []),
            intervalo: dados.intervalo || { label: "Almoço", inicio: "12:00", fim: "13:00" },
          },
        },
      }))
      setErro("")
    } catch {
      if (sinalAtivo && !sinalAtivo.ativo) return
      setErro("Não foi possível carregar a grade")
    } finally {
      if (!sinalAtivo || sinalAtivo.ativo) setCarregandoGrade(false)
    }
  }, [])

  useEffect(() => {
    let ativo = true
    async function carregarOpcoes() {
      try {
        const dados = await obterOpcoesGrade()
        if (!ativo) return
        setOpcoes(dados)
        setTurmaId((atual) => atual || dados.turmas[0]?.id || "")
      } catch {
        if (!ativo) return
        setErro("Não foi possível carregar a grade")
      } finally {
        if (ativo) setCarregandoOpcoes(false)
      }
    }
    void carregarOpcoes()
    return () => {
      ativo = false
    }
  }, [])

  useEffect(() => {
    if (!turmaId) return
    const diaLocal = gradePorDiaRef.current[turmaId]?.[diaAtivo]
    if (diaLocal) {
      setCarregandoGrade(false)
      return
    }
    const sinal = { ativo: true }
    void Promise.resolve().then(() => carregarGrade(turmaId, diaAtivo, sinal))
    return () => {
      sinal.ativo = false
    }
  }, [turmaId, diaAtivo, carregarGrade, recarga])

  function handleTurmaChange(event) {
    setTurmaId(event.target.value)
    setCarregandoGrade(true)
    setErro("")
  }

  function handleDiaChange(dia) {
    setDiaAtivo(dia)
    setCarregandoGrade(true)
    setErro("")
  }

  const diaAtual = gradePorDia[turmaId]?.[diaAtivo]
  const atividades = useMemo(() => ordenarAtividades(diaAtual?.atividades || []), [diaAtual])
  const intervalo = diaAtual?.intervalo || { label: "Almoço", inicio: "12:00", fim: "13:00" }
  const cargaPreenchidaMin = useMemo(
    () => atividades.reduce((total, a) => total + Math.max(0, horaParaMinutos(a.fim) - horaParaMinutos(a.inicio)), 0),
    [atividades],
  )
  const cargaEsperadaMin = opcoes.cargaEsperadaMin || 540
  const progresso = Math.min(100, Math.round((cargaPreenchidaMin / cargaEsperadaMin) * 100))
  const conflitos = useMemo(() => calcularConflitos(atividades), [atividades])

  const secoes = useMemo(() => {
    const manha = []
    const tarde = []
    atividades.forEach((atividade) => {
      if (periodoDaAtividade(atividade.inicio) === "MANHÃ") manha.push(atividade)
      else tarde.push(atividade)
    })
    return { manha, tarde }
  }, [atividades])

  function marcarDiaAlterado(turma, dia) {
    setDiasAlterados((atual) => ({
      ...atual,
      [turma]: { ...(atual[turma] || {}), [dia]: true },
    }))
  }

  function atualizarDiaLocal(turma, dia, atualizador) {
    setGradePorDia((atual) => {
      const turmaGrade = atual[turma] || {}
      const diaGrade = turmaGrade[dia] || { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } }
      const proximoDia = atualizador(diaGrade)
      return {
        ...atual,
        [turma]: {
          ...turmaGrade,
          [dia]: { ...proximoDia, atividades: ordenarAtividades(proximoDia.atividades || []) },
        },
      }
    })
    marcarDiaAlterado(turma, dia)
  }

  function abrirAdicionar() {
    setForm(criarFormularioVazio())
    setSheetAberto(true)
    setMenuAbertoId(null)
  }

  function abrirEditar(atividade) {
    setForm({
      id: atividade.id,
      disciplina: atividade.disciplina || "",
      professor: atividade.professor || "",
      sala: atividade.sala || "",
      inicio: atividade.inicio || "",
      fim: atividade.fim || "",
      repetirDias: [],
    })
    setSheetAberto(true)
    setMenuAbertoId(null)
  }

  function fecharSheet() {
    setSheetAberto(false)
    setForm(criarFormularioVazio())
  }

  function handleFormChange(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  function toggleRepetirDia(diaId) {
    setForm((atual) => {
      const existe = atual.repetirDias.includes(diaId)
      return { ...atual, repetirDias: existe ? atual.repetirDias.filter((d) => d !== diaId) : [...atual.repetirDias, diaId] }
    })
  }

  const formularioValido =
    form.disciplina &&
    form.professor &&
    form.sala &&
    form.inicio &&
    form.fim &&
    horaParaMinutos(form.fim) > horaParaMinutos(form.inicio)

  function garantirDiaLocal(turma, dia) {
    setGradePorDia((atual) => {
      if (atual[turma]?.[dia]) return atual
      return {
        ...atual,
        [turma]: {
          ...(atual[turma] || {}),
          [dia]: { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } },
        },
      }
    })
  }

  async function handleAdicionarAtividade() {
    if (!formularioValido || !turmaId) return

    const diasAlvo = Array.from(new Set([diaAtivo, ...form.repetirDias.filter((d) => d !== diaAtivo)]))
    const gradeAtualTurma = { ...(gradePorDiaRef.current[turmaId] || {}) }

    // Garante dados base dos dias alvo (evita sobrescrever dias não carregados)
    const faltantes = diasAlvo.filter((dia) => !gradeAtualTurma[dia])
    if (faltantes.length > 0) {
      try {
        const resultados = await Promise.all(
          faltantes.map(async (dia) => ({ dia, dados: await obterGradeIntegral({ turmaId, dia }) })),
        )
        resultados.forEach(({ dia, dados }) => {
          gradeAtualTurma[dia] = {
            atividades: ordenarAtividades(dados.atividades || []),
            intervalo: dados.intervalo || { label: "Almoço", inicio: "12:00", fim: "13:00" },
          }
        })
      } catch {
        toast.error("Não foi possível carregar os dias selecionados. Tente novamente.")
        return
      }
    }

    const proximaTurmaGrade = { ...gradeAtualTurma }
    const alteradosTurma = { ...(diasAlteradosRef.current[turmaId] || {}) }

    diasAlvo.forEach((dia) => {
      const diaGrade = proximaTurmaGrade[dia] || { atividades: [], intervalo: { label: "Almoço", inicio: "12:00", fim: "13:00" } }
      const lista = [...(diaGrade.atividades || [])]
      const idAtividade = form.id && dia === diaAtivo ? form.id : gerarId()
      const atividade = {
        id: idAtividade,
        disciplina: form.disciplina,
        professor: form.professor,
        sala: form.sala,
        inicio: form.inicio,
        fim: form.fim,
      }

      const idx = form.id && dia === diaAtivo ? lista.findIndex((item) => item.id === form.id) : -1
      if (idx >= 0) {
        lista[idx] = atividade
      } else {
        lista.push(atividade)
      }

      proximaTurmaGrade[dia] = {
        ...diaGrade,
        atividades: ordenarAtividades(lista),
      }
      alteradosTurma[dia] = true
    })

    setGradePorDia((atual) => ({
      ...atual,
      [turmaId]: proximaTurmaGrade,
    }))
    setDiasAlterados((atual) => ({
      ...atual,
      [turmaId]: alteradosTurma,
    }))
    gradePorDiaRef.current = { ...gradePorDiaRef.current, [turmaId]: proximaTurmaGrade }
    diasAlteradosRef.current = { ...diasAlteradosRef.current, [turmaId]: alteradosTurma }

    fecharSheet()
  }

  function handleRemoverAtividade(atividadeId) {
    setMenuAbertoId(null)
    atualizarDiaLocal(turmaId, diaAtivo, (diaGrade) => ({
      ...diaGrade,
      atividades: (diaGrade.atividades || []).filter((item) => item.id !== atividadeId),
    }))
  }

  async function handleSalvarGrade() {
    if (!turmaId) return
    const gradeTurma = gradePorDiaRef.current[turmaId] || {}
    const alterados = Object.keys(diasAlteradosRef.current[turmaId] || {})
    const diasParaSalvar = alterados.length ? alterados : [diaAtivo]
    setSalvando(true)
    try {
      for (const dia of diasParaSalvar) {
        const dadosDia = gradeTurma[dia] || gradePorDia[turmaId]?.[dia]
        if (!dadosDia) continue
        await salvarGradeIntegral({
          turmaId,
          dia,
          atividades: dadosDia.atividades || [],
          intervalo: dadosDia.intervalo || { label: "Almoço", inicio: "12:00", fim: "13:00" },
        })
      }
      setDiasAlterados((atual) => ({ ...atual, [turmaId]: {} }))
      diasAlteradosRef.current = { ...diasAlteradosRef.current, [turmaId]: {} }
      toast.success("Grade salva com sucesso.")
    } catch {
      toast.error("Não foi possível salvar a grade. Tente novamente.")
    } finally {
      setSalvando(false)
    }
  }

  function renderAtividade(atividade) {
    const avisos = conflitos[atividade.id] || []
    const menuAberto = menuAbertoId === atividade.id
    return (
      <div key={atividade.id} className="grade-activity-wrap">
        <article className="grade-activity-card">
          <div className="grade-activity-time">
            <span>{atividade.inicio}</span>
            <span>{atividade.fim}</span>
          </div>
          <div className="grade-activity-body">
            <h4>{atividade.disciplina}</h4>
            <p><Users size={14} /> {atividade.professor}</p>
            <p><MapPin size={14} /> {atividade.sala}</p>
          </div>
          <div className="grade-activity-menu">
            <button type="button" className="grade-menu-trigger" aria-label="Ações da atividade" onClick={() => setMenuAbertoId(menuAberto ? null : atividade.id)}>
              <MoreVertical size={18} />
            </button>
            {menuAberto && (
              <div className="grade-menu-popover">
                <button type="button" onClick={() => abrirEditar(atividade)}><Pencil size={14} /> Editar</button>
                <button type="button" className="is-danger" onClick={() => handleRemoverAtividade(atividade.id)}><Trash2 size={14} /> Remover</button>
              </div>
            )}
          </div>
        </article>
        {avisos.map((aviso, idx) => (
          <p key={idx} className="grade-conflict-alert">{aviso}</p>
        ))}
      </div>
    )
  }

  const carregando = carregandoOpcoes || carregandoGrade
  const estadoVazio = !carregando && !erro && atividades.length === 0
  const intervaloMin = horaParaMinutos(intervalo.inicio)
  const mostrarIntervalo = secoes.manha.length > 0 && secoes.tarde.some((a) => horaParaMinutos(a.inicio) >= intervaloMin)

  return (
    <div className="curriculum-page">
      <header className="curriculum-header curriculum-header--aulas">
        <button type="button" className="curriculum-back-circle" aria-label="Voltar" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
        </button>
        <div className="curriculum-header-copy">
          <p className="curriculum-brand">SEDUC · SERGIPE</p>
          <h1>Aulas integrais</h1>
        </div>
      </header>

      <main className="curriculum-main curriculum-main--aulas">
        <div className="grade-turma-select-wrap">
          <Users size={18} />
          <select className="grade-turma-select" value={turmaId} onChange={handleTurmaChange} aria-label="Selecionar turma">
            {opcoes.turmas.map((turma) => (
              <option key={turma.id} value={turma.id}>{turma.nome}</option>
            ))}
          </select>
          <ChevronDown size={18} className="grade-turma-chevron" />
        </div>

        {carregando ? (
          <div className="grade-loading" aria-hidden="true">
            <div className="grade-day-chips">
              {dias.map((dia) => <Skeleton key={dia.id} className="grade-chip-skeleton" />)}
            </div>
            <Skeleton className="grade-carga-skeleton" />
            <Skeleton className="grade-card-skeleton" />
            <Skeleton className="grade-card-skeleton" />
            <Skeleton className="grade-card-skeleton" />
          </div>
        ) : erro ? (
          <div className="grade-state">
            <AlertCircle size={40} className="grade-state-icon is-error" />
            <h2 className="grade-state-title">Não foi possível carregar a grade</h2>
            <p className="grade-state-text">Verifique sua conexão com a internet ou tente novamente em instantes.</p>
            <button type="button" className="grade-retry" onClick={() => { setCarregandoGrade(true); setErro(""); setRecarga((n) => n + 1); }}>
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <div className="grade-day-chips" role="tablist" aria-label="Dias da semana">
              {dias.map((dia) => (
                <button key={dia.id} type="button" className={`grade-day-chip ${diaAtivo === dia.id ? "is-active" : ""}`} onClick={() => handleDiaChange(dia.id)}>
                  {dia.label}
                </button>
              ))}
            </div>

            <section className="grade-carga-card">
              <div className="grade-carga-top">
                <div>
                  <p className="grade-carga-label">Carga do dia</p>
                  <p className="grade-carga-value">{formatarCarga(cargaPreenchidaMin)} de {formatarCarga(cargaEsperadaMin)}</p>
                </div>
                <Clock3 size={22} />
              </div>
              <div className="grade-carga-bar">
                <div className="grade-carga-bar-fill" style={{ width: `${progresso}%` }} />
              </div>
            </section>

            {estadoVazio ? (
              <section className="grade-empty-state">
                <CalendarDays size={44} className="grade-empty-icon" />
                <h2>Nenhuma atividade neste dia</h2>
                <p>Use o botão abaixo para adicionar atividades e configurar a grade do dia.</p>
                <button type="button" className="grade-add-inline" onClick={abrirAdicionar}>
                  <Plus size={16} /> Adicionar atividade
                </button>
              </section>
            ) : (
              <section className="grade-sections">
                {secoes.manha.length > 0 && (
                  <div className="grade-period">
                    <h3 className="grade-period-title">MANHÃ</h3>
                    <div className="grade-period-list">{secoes.manha.map(renderAtividade)}</div>
                  </div>
                )}

                {mostrarIntervalo && (
                  <div className="grade-interval">
                    <span>{intervalo.label} · {intervalo.inicio} – {intervalo.fim}</span>
                  </div>
                )}

                {secoes.tarde.length > 0 && (
                  <div className="grade-period">
                    <h3 className="grade-period-title">TARDE</h3>
                    <div className="grade-period-list">{secoes.tarde.map(renderAtividade)}</div>
                  </div>
                )}
              </section>
            )}

            {!estadoVazio && (
              <button type="button" className="grade-add-dashed" onClick={abrirAdicionar}>
                <Plus size={18} /> Adicionar atividade
              </button>
            )}

            <button type="button" className="grade-save-button" onClick={handleSalvarGrade} disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar grade"}
            </button>
          </>
        )}
      </main>

      <BottomNav ativo="registros" />

      {sheetAberto && (
        <div className="sheet-overlay" role="presentation" onClick={fecharSheet}>
          <div className="sheet-panel" role="dialog" aria-modal="true" aria-label={form.id ? "Editar atividade" : "Adicionar atividade"} onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header">
              <h2>{form.id ? "Editar atividade" : "Adicionar atividade"}</h2>
              <button type="button" className="sheet-close" aria-label="Fechar" onClick={fecharSheet}><X size={18} /></button>
            </div>

            <div className="sheet-form">
              <label className="sheet-field">
                <span>Atividade</span>
                <select value={form.disciplina} onChange={(e) => handleFormChange("disciplina", e.target.value)}>
                  <option value="">Selecione a atividade</option>
                  {opcoes.disciplinas.map((d) => (
                    <option key={d.id} value={d.nome}>{d.nome}</option>
                  ))}
                </select>
              </label>

              <label className="sheet-field">
                <span>Professor</span>
                <select value={form.professor} onChange={(e) => handleFormChange("professor", e.target.value)}>
                  <option value="">Selecione o professor</option>
                  {opcoes.professores.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>

              <div className="sheet-row">
                <label className="sheet-field">
                  <span>Sala</span>
                  <select value={form.sala} onChange={(e) => handleFormChange("sala", e.target.value)}>
                    <option value="">Selecione</option>
                    {opcoes.salas.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label className="sheet-field">
                  <span>Início</span>
                  <input type="time" value={form.inicio} onChange={(e) => handleFormChange("inicio", e.target.value)} />
                </label>
                <label className="sheet-field">
                  <span>Fim</span>
                  <input type="time" value={form.fim} onChange={(e) => handleFormChange("fim", e.target.value)} />
                </label>
              </div>

              <div className="sheet-repeat">
                <p>Repetir em outros dias</p>
                <div className="sheet-repeat-days">
                  {dias.map((dia) => (
                    <label key={dia.id} className={`sheet-repeat-day ${form.repetirDias.includes(dia.id) ? "is-checked" : ""}`}>
                      <input
                        type="checkbox"
                        checked={form.repetirDias.includes(dia.id)}
                        onChange={() => toggleRepetirDia(dia.id)}
                        disabled={dia.id === diaAtivo}
                      />
                      <span>{dia.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sheet-actions">
              <button type="button" className="sheet-btn sheet-btn--cancel" onClick={fecharSheet}>Cancelar</button>
              <button type="button" className="sheet-btn sheet-btn--add" onClick={handleAdicionarAtividade} disabled={!formularioValido}>
                {form.id ? "Salvar" : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
