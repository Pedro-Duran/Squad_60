import { useState } from "react"
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react"
import { Navigate, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { ROTA_INICIAL } from "@/lib/rotas"
import { login } from "@/services/authService"

export default function Login() {
  const { usuario, entrar } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ usuario: "", senha: "" })
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")

  if (usuario) {
    return <Navigate to={ROTA_INICIAL[usuario.perfil] ?? "/login"} replace />
  }

  function atualizarCampo(evento) {
    const { name, value } = evento.target
    setForm((atual) => ({ ...atual, [name]: value }))
  }

  async function handleSubmit(evento) {
    evento.preventDefault()

    if (!form.usuario.trim() || !form.senha) {
      setErro("Preencha usuário e senha.")
      return
    }

    setErro("")
    setEnviando(true)

    try {
      const sessao = await login(form.usuario, form.senha)
      entrar(sessao)
      navigate(ROTA_INICIAL[sessao.perfil], { replace: true })
    } catch (erroLogin) {
      setErro(
        erroLogin instanceof Error
          ? erroLogin.message
          : "Falha de conexão. Tente novamente.",
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <p className="login-orgao">
          Secretaria de Estado da
          <br />
          Educação de Sergipe
        </p>
        <img
          className="login-logo"
          src="/src/assets/seduc-logo-branco.png"
          alt="Logo da SEDUC Sergipe"
        />
      </header>

      <main className="login-main">
        <h1>Efetue seu login:</h1>

        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-field">
            <Label htmlFor="usuario">USUÁRIO</Label>
            <div className="login-input-wrap">
              <UserRound className="login-input-icon" aria-hidden="true" />
              <Input
                className="login-input"
                id="usuario"
                name="usuario"
                type="text"
                autoComplete="username"
                value={form.usuario}
                onChange={atualizarCampo}
                aria-describedby={erro ? "login-erro" : undefined}
              />
            </div>
          </div>

          <div className="login-field">
            <Label htmlFor="senha">SENHA</Label>
            <div className="login-input-wrap">
              <LockKeyhole className="login-input-icon" aria-hidden="true" />
              <Input
                className="login-input login-input-senha"
                id="senha"
                name="senha"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="current-password"
                value={form.senha}
                onChange={atualizarCampo}
                aria-describedby={erro ? "login-erro" : undefined}
              />
              <button
                className="login-toggle-senha"
                type="button"
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setMostrarSenha((visivel) => !visivel)}
              >
                {mostrarSenha ? (
                  <EyeOff aria-hidden="true" />
                ) : (
                  <Eye aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {erro && (
            <p className="login-error" id="login-erro" role="alert">
              {erro}
            </p>
          )}

          <Button className="login-submit" type="submit" disabled={enviando}>
            {enviando ? "Entrando…" : "Acessar"}
          </Button>
        </form>
      </main>

      <footer className="login-footer">
        ©2026 Desenvolvido por SQUAD 60
      </footer>
    </div>
  )
}