import { useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"

// A sessão vive só na memória: ao iniciar a aplicação, sempre começa no login.
// Remove a sessão que versões anteriores gravavam no navegador.
try {
  localStorage.removeItem("squad60:sessao")
} catch {
  // armazenamento indisponível: nada a limpar
}

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