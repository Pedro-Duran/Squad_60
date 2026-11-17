import { Navigate, Outlet } from "react-router"
import { useAuth } from "@/hooks/useAuth"

// `perfil` pode ser um perfil ou uma lista de perfis com acesso à rota.
export default function RotaProtegida({ perfil }) {
  const { usuario } = useAuth()
  const perfisPermitidos = perfil ? [perfil].flat() : null

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (perfisPermitidos && !perfisPermitidos.includes(usuario.perfil)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
