import { useState } from "react"
import { AlertTriangle, ArrowLeft, BookOpen, CalendarDays, CheckCircle2, ChevronDown, ClipboardList, FolderOpen, Home, MoreVertical } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import logo from "../assets/Seduc-Logo-Branco-Negativo 1.png"
import "./CriarGradeCurricular.css"

const disciplinasIniciais = [
  { nome: "Língua Portuguesa", horas: 120 },
  { nome: "Matemática", horas: 120 },
  { nome: "Programação", horas: 80 },
  { nome: "História", horas: 80 },
]
const turnos = ["Manhã", "Tarde"]
const seriesPorModalidade = {
  "Ensino Médio": [1, 2, 3],
  "Ensino Fundamental": [6, 7, 8, 9],
}
// Todo ano oferece todos os turnos: "1º ano · Manhã", "1º ano · Tarde", ...
const turmas = Object.fromEntries(
  Object.entries(seriesPorModalidade).map(([modalidade, series]) => [
    modalidade,
    series.flatMap((serie) => turnos.map((turno) => `${serie}º ano · ${turno}`)),
  ]),
)
const anos = [2025, 2026, 2027]

function Campo({ titulo, valor, alterar, opcoes, Icone = ChevronDown, desabilitado }) {
  return (
    <label className="grade-campo">
      {titulo}
      <span>
        <select value={valor} onChange={(evento) => alterar(evento.target.value)} disabled={desabilitado}>
          <option value="">Selecione</option>
          {opcoes.map((opcao) => <option key={opcao}>{opcao}</option>)}
        </select>
        <Icone size={18} aria-hidden="true" />
      </span>
    </label>
  )
}

export default function CriarGradeCurricular() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const inicio = state?.origem ?? "/dge"
  const [modalidade, setModalidade] = useState("")
  const [ano, setAno] = useState("")
  const [turma, setTurma] = useState("")
  const [disciplinas, setDisciplinas] = useState(disciplinasIniciais)
  const [menu, setMenu] = useState(null)
  const [edicao, setEdicao] = useState(null)
  const [aviso, setAviso] = useState(null) // { tipo: "sucesso" | "erro", texto }
  const [avisoAberto, setAvisoAberto] = useState(false)
  const total = disciplinas.reduce((soma, item) => soma + item.horas, 0)
  const podeSalvar = Boolean(modalidade && ano && turma)
  const voltar = () => state?.origem ? navigate(-1) : navigate(inicio, { replace: true })

  function mostrarAviso(tipo, texto) {
    setAviso({ tipo, texto })
    setAvisoAberto(true)
  }

  function salvar() {
    if (!podeSalvar) return
    try {
      const chave = JSON.stringify([modalidade, ano, turma])
      localStorage.setItem(`squad60:grade:${chave}`, JSON.stringify({ modalidade, ano, turma, disciplinas }))
      mostrarAviso("sucesso", "Grade salva com sucesso.")
    } catch {
      mostrarAviso("erro", "Não foi possível salvar a grade. Tente novamente.")
    }
  }

  function confirmarDisciplina(evento) {
    evento.preventDefault()
    const nome = edicao.nome.trim()
    const horas = Number(edicao.horas)
    if (!nome || !Number.isSafeInteger(horas) || horas < 1) return
    const item = { nome, horas }
    setDisciplinas((lista) => edicao.indice === null
      ? [...lista, item]
      : lista.map((anterior, indice) => indice === edicao.indice ? item : anterior))
    setEdicao(null)
  }

  return (
    <div className="grade-page">
      <header className="grade-header">
        <div>
          <button type="button" aria-label="Voltar" onClick={voltar}><ArrowLeft size={22} /></button>
          <img src={logo} alt="SEDUC · SERGIPE" />
        </div>
        <h1>Criar Grade Curricular</h1>
      </header>
      <main className="grade-main">
        <div className="grade-card grade-form">
          <Campo titulo="Modalidade" valor={modalidade} opcoes={Object.keys(turmas)} alterar={(valor) => {
            setModalidade(valor)
            setTurma("")
          }} />
          <Campo titulo="Ano Letivo" valor={ano} opcoes={anos} Icone={CalendarDays} alterar={(valor) => {
            setAno(valor)
          }} />
          <Campo titulo="Turma" valor={turma} opcoes={turmas[modalidade] ?? []} desabilitado={!modalidade} alterar={(valor) => {
            setTurma(valor)
          }} />
        </div>
        <section aria-labelledby="grade-disciplinas">
          <div className="grade-section-heading">
            <h2 id="grade-disciplinas">Disciplinas da grade</h2>
            <button type="button" onClick={() => { setMenu(null); setEdicao({ indice: null, nome: "", horas: "" }) }}>Adicionar disciplina</button>
          </div>
          <ul className="grade-lista">
            {disciplinas.map((item, indice) => (
              <li key={indice} className="grade-card grade-disciplina">
                <span className="grade-livro"><BookOpen size={19} /></span>
                <span>{item.nome}</span>
                <strong>{item.horas}h</strong>
                <button type="button" aria-label={`Ações de ${item.nome}`} aria-expanded={menu === indice}
                  onClick={() => setMenu(menu === indice ? null : indice)}><MoreVertical size={20} /></button>
                {menu === indice && (
                  <div className="grade-menu" onKeyDown={(evento) => {
                    if (evento.key === "Escape") {
                      evento.currentTarget.previousElementSibling.focus()
                      setMenu(null)
                    }
                  }}>
                    <button type="button" onClick={() => { setEdicao({ ...item, indice }); setMenu(null) }}>Editar carga horária</button>
                    <button type="button" onClick={() => {
                      setEdicao(null)
                      setDisciplinas((lista) => lista.filter((_, posicao) => posicao !== indice))
                      setMenu(null)
                    }}>Remover</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {edicao && (
            <form className="grade-card grade-form" onSubmit={confirmarDisciplina}>
              {edicao.indice === null && (
                <label className="grade-campo">Nome da disciplina
                  <input required value={edicao.nome} onChange={(evento) => setEdicao({ ...edicao, nome: evento.target.value })} />
                </label>
              )}
              <label className="grade-campo">Carga horária (h)
                <input required type="number" min="1" step="1" value={edicao.horas}
                  onChange={(evento) => setEdicao({ ...edicao, horas: evento.target.value })} />
              </label>
              <div className="grade-acoes">
                <button type="button" onClick={() => setEdicao(null)}>Cancelar edição</button>
                <button type="submit">Confirmar</button>
              </div>
            </form>
          )}
        </section>
        <div className="grade-total"><span>Carga horária total</span><strong aria-live="polite">{total}h</strong></div>
        <div className="grade-acoes">
          <button type="button" onClick={voltar}>Cancelar</button>
          <button type="button" disabled={!podeSalvar} onClick={salvar}>Salvar grade</button>
        </div>
      </main>
      <footer className="grade-footer">
        <small>©2026 Desenvolvido por SQUAD 60</small>
        <nav aria-label="Navegação principal">
          <Link to={inicio}><Home size={20} />Início</Link>
          <span aria-current="page"><ClipboardList size={20} />Solicitações</span>
          <Link to="/dge/registros" state={{ origem: inicio }}><FolderOpen size={20} />Registros</Link>
        </nav>
      </footer>

      <Dialog open={avisoAberto} onOpenChange={setAvisoAberto}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/50"
          className="gap-0 rounded-2xl px-6 pb-5 pt-6 text-center sm:max-w-[350px]"
        >
          {aviso?.tipo === "erro" ? (
            <AlertTriangle aria-hidden="true" className="mx-auto size-10 fill-destructive text-white" />
          ) : (
            <CheckCircle2 aria-hidden="true" className="mx-auto size-10 fill-emerald-600 text-white" />
          )}
          <DialogTitle className="mt-3 text-center text-base font-bold">
            {aviso?.tipo === "erro" ? "Não foi possível salvar" : "Grade salva"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-center text-sm leading-6">
            {aviso?.texto}
          </DialogDescription>
          {aviso?.tipo === "sucesso" && (
            <p className="mt-1 text-center text-xs font-semibold text-muted-foreground">
              {modalidade} · {ano} · {turma}
            </p>
          )}
          <Button
            type="button"
            className="mt-5 h-10 w-full rounded-lg bg-[#1453af] text-sm font-semibold text-white hover:bg-[#1453af]/90"
            onClick={() => setAvisoAberto(false)}
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
