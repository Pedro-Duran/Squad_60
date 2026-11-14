import { Link, useLocation } from "react-router"
import { useAuth } from "@/hooks/useAuth"

export default function EmConstrucao() {
  const { usuario, sair } = useAuth()
  const { pathname } = useLocation()

  return (
    <main className="p-6">
      <p>
        Tela inicial de {usuario?.nome} ({usuario?.perfil}) em construção.
      </p>
      {pathname === "/coordenador" && (
        <Link className="block my-3 underline" to="/solicitacoes/criar-grade-curricular" state={{ origem: pathname }}>
          Criar Grade Curricular
        </Link>
      )}
      {pathname === "/registros" && (
        <Link className="block my-3 underline" to="/coordenador">Início</Link>
      )}
      <button type="button" onClick={sair}>
        Sair
      </button>
    </main>
  )
}