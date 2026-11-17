import { Navigate, Outlet } from "react-router"
import { useAuth } from "@/hooks/useAuth"

export default function RotaProtegida({ perfil }) {
  const { usuario } = useAuth()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (perfil && usuario.perfil !== perfil) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
