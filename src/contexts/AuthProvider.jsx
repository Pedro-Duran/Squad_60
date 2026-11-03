import { useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)

  function entrar(sessao) {
    setUsuario(sessao)
  }

  function sair() {
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  )
}
