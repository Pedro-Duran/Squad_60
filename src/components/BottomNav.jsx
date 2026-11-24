import { BookOpen, ClipboardList, Home } from "lucide-react"
import { useNavigate } from "react-router"

const itens = [
  { id: "inicio", label: "Início", icon: Home, to: "/" },
  { id: "solicitacoes", label: "Solicitações", icon: ClipboardList, to: "/" },
  { id: "registros", label: "Registros", icon: BookOpen, to: "/" },
]

export function BottomNav({ ativo = "inicio" }) {
  const navigate = useNavigate()

  return (
    <nav className="curriculum-bottom-nav" aria-label="Navegação inferior">
      {itens.map((item) => {
        const Icon = item.icon
        const selecionado = item.id === ativo
        return (
          <button
            key={item.id}
            type="button"
            className={`curriculum-bottom-nav__item ${selecionado ? "is-active" : ""}`}
            onClick={() => navigate(item.to)}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
