import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { BookOpen, CalendarDays, House, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AbasAlunos } from "@/components/dge/AbasAlunos"
import { ItemAluno } from "@/components/dge/ItemAluno"
import { pesquisarAlunos } from "@/services/alunoService"

function NavegacaoInferior() {
  const itens = [
    { label: "Início", Icone: House },
    { label: "Solicitações", Icone: CalendarDays, ativa: true },
    { label: "Registros", Icone: BookOpen },
  ]

  return (
    <footer className="mt-auto">
      <nav
        aria-label="Navegação principal"
        className="grid grid-cols-3 items-center bg-white px-4 py-2"
      >
        {itens.map(({ label, Icone, ativa }) => (
          <a
            key={label}
            href="#"
            aria-current={ativa ? "page" : undefined}
            className={`mx-auto flex min-w-[96px] flex-col items-center justify-center gap-0.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
              ativa ? "bg-footer-active text-primary" : "text-footer-muted"
            }`}
          >
            <Icone className="size-[19px]" aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <p className="bg-navy px-4 py-3 text-center text-[11px] text-white/50">
        ©2026 Desenvolvido por SQUAD 60
      </p>
    </footer>
  )
}

export default function PesquisarAluno() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [termo, setTermo] = useState(searchParams.get("busca") || "")
  const [resultado, setResultado] = useState(null)
  const [buscando, setBuscando] = useState(false)
  const [avisoVazio, setAvisoVazio] = useState(false)
  const [erroBusca, setErroBusca] = useState("")
  const [tentativaPesquisa, setTentativaPesquisa] = useState(0)
  const busca = searchParams.get("busca") || ""
  const navigate = useNavigate()

  useEffect(() => {
    let ativo = true

    if (!busca) {
      return () => {
        ativo = false
      }
    }

    Promise.resolve()
      .then(() => {
        if (!ativo) return null
        setBuscando(true)
        setErroBusca("")
        return pesquisarAlunos(busca)
      })
      .then((encontrados) => {
        if (!ativo || !encontrados) return
        if (encontrados.length === 1) {
          navigate(`/dge/alunos/${encontrados[0].id}`)
          return
        }
        setResultado(encontrados)
      })
      .catch(() => {
        if (ativo) setErroBusca("Não foi possível pesquisar agora. Tente novamente.")
      })
      .finally(() => {
        if (ativo) setBuscando(false)
      })

    return () => {
      ativo = false
    }
  }, [busca, navigate, tentativaPesquisa])

  function handleSubmit(event) {
    event.preventDefault()
    const textoBusca = termo.trim()

    if (!textoBusca) {
      setAvisoVazio(true)
      setResultado(null)
      setSearchParams({})
      return
    }

    setAvisoVazio(false)
    setBuscando(true)
    setTentativaPesquisa((tentativa) => tentativa + 1)
    setSearchParams({ busca: textoBusca })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AbasAlunos ativa="pesquisar" />

      <div className="border-b border-slate-300 bg-white px-4 py-4 text-center">
        <h1 className="text-[22px] font-bold leading-7 text-slate-900">Pesquisar Aluno</h1>
      </div>

      <main className="mx-auto w-full max-w-xl flex-1 space-y-4 p-4">
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <form onSubmit={handleSubmit} role="search" className="space-y-3">
            <p className="text-[13px] leading-5 text-slate-500">
              Digite o nome completo ou CPF do aluno para localizar o cadastro.
            </p>

            <div className="relative">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-500"
              />
              <Input
                type="text"
                value={termo}
                onChange={(event) => {
                  setTermo(event.target.value)
                  if (avisoVazio && event.target.value.trim()) setAvisoVazio(false)
                }}
                placeholder="Digite o nome ou CPF..."
                aria-label="Nome ou CPF do aluno"
                aria-invalid={avisoVazio}
                aria-describedby={avisoVazio ? "aviso-pesquisa-vazia" : undefined}
                className="h-12 rounded-lg border-slate-300 bg-white pl-10 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
              />
            </div>

            {avisoVazio && (
              <p id="aviso-pesquisa-vazia" className="text-xs font-medium text-amber-700">
                Digite um nome ou CPF para pesquisar.
              </p>
            )}

            <Button
              type="submit"
              disabled={buscando}
              className="h-[46px] w-full rounded-full bg-primary text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Search aria-hidden="true" className="size-4" />
              {buscando ? "Buscando…" : "BUSCAR"}
            </Button>
          </form>
        </section>

        {erroBusca && (
          <p role="alert" className="rounded-xl bg-white p-4 text-center text-sm text-destructive">
            {erroBusca}
          </p>
        )}

        {resultado !== null && (
          <section aria-live="polite" className="space-y-3">
            {resultado.length === 0 ? (
              <p className="rounded-xl bg-white p-4 text-center text-sm text-slate-500">
                Nenhum aluno encontrado.
              </p>
            ) : (
              <>
                <p className="px-1 text-xs font-semibold text-slate-600">
                  {resultado.length}{" "}
                  {resultado.length === 1 ? "aluno encontrado" : "alunos encontrados"}
                </p>
                <div className="space-y-2">
                  {resultado.map((aluno) => (
                    <ItemAluno key={aluno.id} aluno={aluno} />
                  ))}
                </div>
              </>
            )}
          </section>
        )}
      </main>

      <NavegacaoInferior />
    </div>
  )
}
