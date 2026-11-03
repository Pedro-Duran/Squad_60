import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  AlertTriangle,
  ChevronDown,
  ClipboardList,
  FileText,
  House,
  RefreshCw,
  Signal,
  UsersRound,
  Wifi,
} from 'lucide-react'
import './ErrorScreen.css'

const weekdays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']

const navigationItems = [
  { label: 'Início', Icon: House },
  { label: 'Solicitações', Icon: FileText },
  { label: 'Registros', Icon: ClipboardList },
]

export default function ErrorScreen() {
  const [selectedDay, setSelectedDay] = useState('Seg')
  const [activeNavigation, setActiveNavigation] = useState('Início')
  const [isRetrying, setIsRetrying] = useState(false)
  const retryTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(retryTimer.current), [])

  function handleRetry() {
    if (isRetrying) return

    setIsRetrying(true)
    retryTimer.current = window.setTimeout(() => setIsRetrying(false), 900)
  }

  return (
    <main className="error-screen-page">
      <section className="error-screen" aria-label="Aulas integrais">
        <div className="error-screen__status" aria-label="Barra de status">
          <span>09:41</span>
          <div className="error-screen__status-icons" aria-hidden="true">
            <Signal size={17} strokeWidth={2.8} />
            <Wifi size={16} strokeWidth={2.6} />
            <span className="error-screen__battery"><span /></span>
          </div>
        </div>

        <header className="error-screen__header">
          <button
            className="error-screen__back"
            type="button"
            aria-label="Voltar"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={20} strokeWidth={2.4} />
          </button>
          <div>
            <span className="error-screen__eyebrow">SEDUC · SERGIPE</span>
            <h1>Aulas integrais</h1>
          </div>
        </header>

        <div className="error-screen__class-selector">
          <UsersRound size={17} strokeWidth={2.2} aria-hidden="true" />
          <label className="error-screen__visually-hidden" htmlFor="error-screen-class">
            Turma
          </label>
          <select id="error-screen-class" defaultValue="3º Ano A — Integral">
            <option>3º Ano A — Integral</option>
            <option>1º Ano A — Integral</option>
            <option>2º Ano A — Integral</option>
          </select>
          <ChevronDown size={17} strokeWidth={2.2} aria-hidden="true" />
        </div>

        <nav className="error-screen__weekdays" aria-label="Dias da semana">
          {weekdays.map((day) => (
            <button
              className={`error-screen__day${selectedDay === day ? ' is-selected' : ''}`}
              key={day}
              type="button"
              aria-pressed={selectedDay === day}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </nav>

        <section className="error-screen__message" aria-live="polite">
          <div className="error-screen__icon">
            <AlertTriangle size={28} strokeWidth={1.8} aria-hidden="true" />
          </div>
          <h2>Não foi possível carregar a grade</h2>
          <p>Verifique sua conexão com a internet ou tente novamente em instantes.</p>
          <button
            className="error-screen__retry"
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            <RefreshCw
              size={15}
              strokeWidth={2.5}
              className={isRetrying ? 'is-spinning' : ''}
              aria-hidden="true"
            />
            {isRetrying ? 'Tentando novamente...' : 'Tentar novamente'}
          </button>
        </section>

        <footer className="error-screen__footer">
          <nav className="error-screen__navigation" aria-label="Navegação principal">
            {navigationItems.map(({ label, Icon }) => (
              <button
                className={`error-screen__nav-item${activeNavigation === label ? ' is-active' : ''}`}
                key={label}
                type="button"
                aria-current={activeNavigation === label ? 'page' : undefined}
                onClick={() => setActiveNavigation(label)}
              >
                <Icon size={20} strokeWidth={activeNavigation === label ? 2.4 : 2} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="error-screen__credits">
            <p>©2026 Desenvolvido por SQUAD 60</p>
            <p>Tela por Mateus de Lima Pereira</p>
          </div>
        </footer>
      </section>
    </main>
  )
}