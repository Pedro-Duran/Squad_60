import { Link, Outlet, useLocation, useNavigate } from "react-router"
import { ArrowLeft, Home, ClipboardList, BookOpen } from "lucide-react"

import "@/pages/professor/professor.css"

// Layout das telas internas do professor (header + tab bar + rodapé).
// O /professor (menu) tem o próprio layout, da tarefa #141.

// Título do header por rota.
const TITULOS = {
  "/professor/aulas-hoje": "Aulas de hoje",
  "/professor/solicitacoes": "Solicitações",
  "/professor/registros": "Registros",
  "/professor/presenca": "Lista de Presença",
  "/professor/diario": "Diário Eletrônico",
}

// Abas da barra inferior.
const ABAS = [
  {
    to: "/professor",
    rotulo: "Início",
    icone: <Home size={20} aria-hidden="true" />,
    chave: "inicio",
  },
  {
    to: "/professor/solicitacoes",
    rotulo: "Solicitações",
    icone: <ClipboardList size={20} aria-hidden="true" />,
    chave: "solicitacoes",
  },
  {
    to: "/professor/registros",
    rotulo: "Registros",
    icone: <BookOpen size={20} aria-hidden="true" />,
    chave: "registros",
  },
]

function abaAtiva(caminho) {
  if (caminho.startsWith("/professor/solicitacoes")) return "solicitacoes"
  if (caminho.startsWith("/professor/registros")) return "registros"
  return "inicio"
}

export default function LayoutProfessor() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const titulo = TITULOS[pathname] ?? "SEDUC Sergipe"
  const ativa = abaAtiva(pathname)

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-header__orgao">SEDUC · SERGIPE</span>
        <div className="app-header__linha">
          <button
            type="button"
            className="app-header__voltar"
            aria-label="Voltar"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <h1 className="app-header__titulo">{titulo}</h1>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <div className="barra-inferior">
        <nav className="tabbar" aria-label="Navegação principal">
          {ABAS.map(({ to, rotulo, icone, chave }) => {
            const ativo = ativa === chave
            return (
              <Link
                key={chave}
                to={to}
                className={`tabbar__item ${ativo ? "tabbar__item--ativo" : ""}`}
                aria-current={ativo ? "page" : undefined}
              >
                <span className="tabbar__ponto" aria-hidden="true" />
                {icone}
                <span className="tabbar__rotulo">{rotulo}</span>
              </Link>
            )
          })}
        </nav>
        <footer className="rodape">©2026 Desenvolvido por SQUAD 60</footer>
      </div>
    </div>
  )
}
