import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import CardDataAula from "@/components/professor/CardDataAula"
import { buscarAula } from "@/services/aulaService"
import { Home, ClipboardList, NotebookPen, ArrowLeft, Trash2 } from "lucide-react"

const AULA_ATUAL_ID = "aula-001"

export default function DiarioEletronico() {
  const [aula, setAula] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    let ativo = true

    const carregarAula = async () => {
      const estado = new URLSearchParams(window.location.search).get("estado")
      if (estado === "carregando") {
        setCarregando(true)
      }

      try {
        const resposta = await buscarAula(AULA_ATUAL_ID)
        if (ativo) {
          setAula(resposta)
          setErro(false)
        }
      } catch {
        if (ativo) {
          setErro(true)
          setAula(null)
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    carregarAula()

    return () => {
      ativo = false
    }
  }, [])

  const listaTarefas = useMemo(() => aula?.tarefas ?? [], [aula])
  const listaTopicos = useMemo(() => aula?.topicos ?? [], [aula])

  const atualizarLista = (tipo, index, valor) => {
    if (!aula) return

    const listaAtual = tipo === "topicos" ? aula.topicos : aula.tarefas
    const proximo = [...listaAtual]
    proximo[index] = valor

    setAula({
      ...aula,
      [tipo]: proximo,
    })
  }

  const adicionarItem = (tipo) => {
    if (!aula) return

    const listaAtual = tipo === "topicos" ? aula.topicos : aula.tarefas

    setAula({
      ...aula,
      [tipo]: [...listaAtual, ""],
    })
  }

  const removerItem = (tipo, index) => {
    if (!aula) return

    const listaAtual = tipo === "topicos" ? aula.topicos : aula.tarefas
    const proximo = listaAtual.filter((_, itemIndex) => itemIndex !== index)

    setAula({
      ...aula,
      [tipo]: proximo,
    })
  }

  const atualizarDataAula = (data) => {
    setAula((atual) => (atual ? { ...atual, data } : atual))
  }

  const atualizarHorarioAula = (horario) => {
    setAula((atual) => (atual ? { ...atual, horario } : atual))
  }

  if (carregando) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-[color:var(--panel)] p-4 text-[color:var(--title)]">
        <div className="w-full max-w-[390px] p-6 text-center">
          Carregando...
        </div>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-[color:var(--panel)] p-4 text-[color:var(--title)]">
        <div className="w-full max-w-[390px] p-6 text-center">
          <p className="text-lg font-semibold text-[color:var(--title)]">Não foi possível carregar a aula.</p>
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 h-12 w-full rounded-[18px] bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-hover)]"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  if (!aula) {
    return null
  }

  return (
    <div className="min-h-dvh w-full bg-[color:var(--panel)]">
      <div className="flex min-h-dvh w-full flex-col overflow-hidden bg-[color:var(--panel)]">
        <div className="bg-[color:var(--panel)] px-4 pb-3 pt-5">
          <div className="flex items-center gap-3 px-1">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-[color:var(--title)] transition hover:bg-black/5"
              aria-label="Voltar"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted-text)]">
              SEDUC · SERGIPE
            </div>
          </div>
          <h1 className="mt-2 px-1 text-[32px] font-bold leading-none text-[color:var(--title)] sm:text-[40px]">
            Diário eletrônico
          </h1>
          <div className="mt-4">
            <CardDataAula
              data={aula.data}
              horario={aula.horario}
              onDataChange={atualizarDataAula}
              onHorarioChange={atualizarHorarioAula}
            />
          </div>
        </div>

        <main className="flex-1 space-y-4 px-4 pb-4 pt-3">
          <section className="rounded-[18px] bg-[color:var(--card)] p-3 shadow-[0_2px_8px_rgba(15,23,42,0.06)] ring-1 ring-black/5">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[color:var(--muted-text)]">
              Tópicos ministrados
            </h2>
            <div className="space-y-2">
              {listaTopicos.map((topico, index) => (
                <div key={index} className="flex items-start gap-2 rounded-[12px] bg-white/20">
                  <span className="mt-[10px] text-lg leading-none text-[color:var(--title)]">→</span>
                  <textarea
                    aria-label={`Tópico ministrado ${index + 1}`}
                    value={topico}
                    onChange={(event) => atualizarLista("topicos", index, event.target.value)}
                    rows={2}
                    className="min-h-[40px] w-full resize-none border-0 bg-transparent px-1 py-2 text-[14px] leading-snug text-[color:var(--title)] outline-none placeholder:text-[color:var(--muted-text)]"
                    placeholder="Descreva o tópico"
                  />
                  <button
                    type="button"
                    aria-label={`Excluir tópico ${index + 1}`}
                    onClick={() => removerItem("topicos", index)}
                    className="mt-2 rounded-full p-1 text-[color:var(--muted-text)] transition hover:bg-black/5 hover:text-[color:var(--danger)]"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => adicionarItem("topicos")}
              className="mt-3 w-full rounded-full border border-dashed border-[color:var(--muted-border)] bg-transparent px-3 py-2 text-[12px] font-medium text-[color:var(--muted-text)]"
            >
              + Adicionar tópico
            </button>
          </section>

          <section className="rounded-[18px] bg-[color:var(--card)] p-3 shadow-[0_2px_8px_rgba(15,23,42,0.06)] ring-1 ring-black/5">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[color:var(--muted-text)]">
              Tarefas para casa
            </h2>
            <div className="space-y-2">
              {listaTarefas.map((tarefa, index) => (
                <div key={index} className="flex items-start gap-2 rounded-[12px] bg-white/20">
                  <span className="mt-[10px] text-lg leading-none text-[color:var(--title)]">→</span>
                  <textarea
                    aria-label={`Tarefa para casa ${index + 1}`}
                    value={tarefa}
                    onChange={(event) => atualizarLista("tarefas", index, event.target.value)}
                    rows={2}
                    className="min-h-[40px] w-full resize-none border-0 bg-transparent px-1 py-2 text-[14px] leading-snug text-[color:var(--title)] outline-none placeholder:text-[color:var(--muted-text)]"
                    placeholder="Descreva a tarefa"
                  />
                  <button
                    type="button"
                    aria-label={`Excluir tarefa ${index + 1}`}
                    onClick={() => removerItem("tarefas", index)}
                    className="mt-2 rounded-full p-1 text-[color:var(--muted-text)] transition hover:bg-black/5 hover:text-[color:var(--danger)]"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => adicionarItem("tarefas")}
              className="mt-3 w-full rounded-full border border-dashed border-[color:var(--muted-border)] bg-transparent px-3 py-2 text-[12px] font-medium text-[color:var(--muted-text)]"
            >
              + Adicionar tarefa
            </button>
          </section>
        </main>

        <div className="px-4 pb-6 pt-2">
          <button
            type="button"
            className="flex h-[56px] w-full items-center justify-center rounded-full bg-[color:var(--primary)] text-base font-bold text-white shadow-[0_10px_18px_rgba(26,74,179,0.25)] transition-colors hover:bg-[color:var(--primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)]"
          >
            <span>Enviar</span>
          </button>
        </div>

        <nav
          aria-label="Navegação principal"
          className="grid grid-cols-3 border-t border-[color:var(--nav-border)] bg-[color:var(--nav-bg)] px-2 py-3 text-[11px] text-[color:var(--nav-text)]"
        >
          <div className="flex min-w-0 flex-col items-center gap-1">
            <Home size={18} />
            <span className="whitespace-nowrap">Início</span>
          </div>
          <div className="flex min-w-0 flex-col items-center gap-1 text-[color:var(--nav-active)]">
            <ClipboardList size={18} />
            <span className="whitespace-nowrap">Solicitações</span>
          </div>
          <div className="flex min-w-0 flex-col items-center gap-1">
            <NotebookPen size={18} />
            <span className="whitespace-nowrap">Registros</span>
          </div>
        </nav>
      </div>
    </div>
  )
}
