import { useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"

const CHAVE = "squad60:sessao"

function lerSessaoSalva() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerSessaoSalva)

  function entrar(sessao) {
    localStorage.setItem(CHAVE, JSON.stringify(sessao))
    setUsuario(sessao)
  }

  function sair() {
    localStorage.removeItem(CHAVE)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  )
}