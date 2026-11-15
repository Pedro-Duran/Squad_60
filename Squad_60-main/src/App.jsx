import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  Home,
  Plus,
} from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()
const DEMO_USER = {
  name: 'Carlos Silva',
  role: 'COORDENADOR PEDAGÓGICO',
  profile: 'coordenador_pedagogico',
}

function readLoggedUser() {
  const possibleKeys = ['squad60:user', 'usuarioLogado', 'user']

  for (const key of possibleKeys) {
    try {
      const rawUser = window.localStorage.getItem(key)
      if (rawUser) return JSON.parse(rawUser)
    } catch {
      // Ignore invalid session data and continue to the demo account.
    }
  }

  // The supplied base project has no authentication/session implementation.
  // This demo user keeps the screen previewable until the real login is connected.
  return DEMO_USER
}

function normalizeProfile(user) {
  return String(user?.profile ?? user?.perfil ?? user?.role ?? user?.cargo ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

function DestinationView({ title, description, onBack }) {
  return (
    <main className="destination-view">
      <button className="destination-back" type="button" onClick={onBack} aria-label="Voltar ao Hub do Coordenador">
        <ArrowLeft size={20} /> Voltar
      </button>
      <span className="eyebrow">SEDUC · SERGIPE</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="destination-note">
        Esta tela será conectada à funcionalidade correspondente quando ela estiver disponível no projeto.
      </div>
    </main>
  )
}

export default function App() {
  const [user] = useState(readLoggedUser)
  const [activeView, setActiveView] = useState('home')
  const [activeTab, setActiveTab] = useState('inicio')
  const year = useMemo(() => CURRENT_YEAR, [])

  const profile = normalizeProfile(user)
  const isCoordinator = profile.includes('coordenador') || profile.includes('coordinator')
  const userName = user?.name ?? user?.nome ?? user?.fullName ?? 'Coordenador'
  const userRole = user?.roleLabel ?? user?.cargo ?? 'COORDENADOR PEDAGÓGICO'

  const goBack = () => {
    if (activeView !== 'home') {
      setActiveView('home')
      return
    }
    if (window.history.length > 1) window.history.back()
  }

  if (!isCoordinator) {
    return (
      <div className="app-shell">
        <main className="access-denied">
          <div className="access-icon"><FileText size={28} /></div>
          <h1>Acesso restrito</h1>
          <p>Esta área está disponível apenas para usuários com perfil de coordenador pedagógico.</p>
        </main>
      </div>
    )
  }

  if (activeView !== 'home') {
    const destinations = {
      criar: ['Criar Ementa Pedagógica', 'Área de criação de uma nova ementa pedagógica.'],
      historico: ['Ementas Criadas', 'Histórico de propostas de ementas do coordenador.'],
      validacoes: ['Acompanhar Validações', 'Acompanhamento dos pareceres da diretoria regional de ensino.'],
      solicitacoes: ['Solicitações', 'Solicitações do coordenador.'],
    }
    const [title, description] = destinations[activeView] ?? destinations.criar
    return (
      <div className="app-shell">
        <DestinationView title={title} description={description} onBack={() => setActiveView('home')} />
      </div>
    )
  }

  const quickLinks = [
    {
      title: 'Ver Ementas Criadas',
      subtitle: 'Histórico de propostas',
      icon: BookOpen,
      action: () => setActiveView('historico'),
      label: 'Ver histórico de ementas criadas',
    },
    {
      title: 'Acompanhar Validações',
      subtitle: 'Acompanhe pareceres',
      icon: CheckCircle2,
      action: () => setActiveView('validacoes'),
      label: 'Acompanhar validações',
    },
  ]

  return (
    <div className="app-shell">
      <div className="phone-screen">
        <div className="screen-scroll">
          <header className="hub-header">
            <div className="brand-row">
              <button className="back-button" type="button" onClick={goBack} aria-label="Voltar">
                <ArrowLeft size={19} strokeWidth={2.4} />
              </button>
              <span className="brand-name">SEDUC · SERGIPE</span>
              <span className="electronic-seal">DIÁRIO ELETRÔNICO</span>
            </div>
            <h1>Hub do Coordenador</h1>
            <div className="header-divider" />
          </header>

          <main className="hub-content">
            <section className="greeting" aria-label="Identificação do usuário">
              <p className="user-role">{userRole} — SEDUC</p>
              <h2>Olá, {userName}</h2>
            </section>

            <section className="main-card" aria-labelledby="ementas-title">
              <p className="planning-year">PLANEJAMENTO {year}</p>
              <h2 id="ementas-title">Ementas Pedagógicas</h2>
              <p className="main-description">
                Crie ou gerencie ementas curriculares e envie para validação direta da diretoria regional de ensino.
              </p>
              <button className="create-button" type="button" onClick={() => setActiveView('criar')}>
                <Plus size={23} strokeWidth={2.8} />
                <span>Criar Ementa Pedagógica</span>
              </button>
            </section>

            <section className="quick-access" aria-labelledby="quick-title">
              <h2 id="quick-title">Acesso Rápido</h2>
              <div className="quick-list">
                {quickLinks.map(({ title, subtitle, icon: Icon, action, label }) => (
                  <button className="quick-card" key={title} type="button" onClick={action} aria-label={label}>
                    <span className="quick-icon"><Icon size={29} strokeWidth={2.4} /></span>
                    <span className="quick-copy">
                      <strong>{title}</strong>
                      <span>{subtitle}</span>
                    </span>
                    <ChevronRight className="quick-chevron" size={28} strokeWidth={2.7} />
                  </button>
                ))}
              </div>
            </section>
          </main>
        </div>

        <footer className="bottom-area">
          <nav className="bottom-nav" aria-label="Navegação principal">
            <button className={`nav-item ${activeTab === 'inicio' ? 'active' : ''}`} type="button" onClick={() => { setActiveTab('inicio'); setActiveView('home') }}>
              <Home size={27} strokeWidth={2.4} />
              <span>Início</span>
            </button>
            <button className={`nav-item ${activeTab === 'solicitacoes' ? 'active' : ''}`} type="button" onClick={() => { setActiveTab('solicitacoes'); setActiveView('solicitacoes') }}>
              <FileText size={27} strokeWidth={2.2} />
              <span>Solicitações</span>
            </button>
          </nav>
          <p className="copyright">©{year} Desenvolvido por SQUAD 60</p>
          <div className="home-indicator" aria-hidden="true" />
        </footer>
      </div>
    </div>
  )
}
