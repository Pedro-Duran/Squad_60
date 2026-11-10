import { useEffect, useMemo, useState } from "react"
import { Check } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import CardDataAula from "@/components/professor/CardDataAula"
import { calcularFrequencia, FREQUENCIA_MINIMA, situacaoFrequencia } from "@/lib/frequencia"
import { buscarChamada, salvarPresencas } from "@/services/aulaService"
import { toast } from "sonner"

const AULA_ATUAL_ID = "aula-001"

function getEstadoPesquisa() {
  if (typeof window === "undefined") return "normal"
  return new URLSearchParams(window.location.search).get("estado") ?? "normal"
}

export default function ListaPresenca() {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(getEstadoPesquisa() === "carregando")
  const [erro, setErro] = useState(getEstadoPesquisa() === "erro")
  const [modoEdicao, setModoEdicao] = useState(false)
  const [mudancas, setMudancas] = useState({})
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(getEstadoPesquisa() === "carregando")
        setErro(getEstadoPesquisa() === "erro")
        const resposta = await buscarChamada(AULA_ATUAL_ID)
        setDados(resposta)
      } catch {
        setErro(true)
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  const alertas = useMemo(() => {
    if (!dados?.alunos) return []

    return dados.alunos
      .map((aluno) => {
        const percentual = calcularFrequencia(aluno)
        const situacao = situacaoFrequencia(percentual)

        if (situacao === "atencao") {
          return `${aluno.nome} está perto de atingir o limite permitido de faltas.`
        }

        if (situacao === "limite") {
          return `${aluno.nome} já atingiu o limite permitido de faltas.`
        }

        return null
      })
      .filter(Boolean)
  }, [dados])

  const atualizarPresenca = (alunoId, presente) => {
    if (!modoEdicao) return
    setMudancas((anterior) => ({ ...anterior, [alunoId]: presente }))
  }

  const cancelarEdicao = () => {
    setMudancas({})
    setModoEdicao(false)
  }

  const enviarPresencas = async () => {
    if (!dados || !modoEdicao) return

    setEnviando(true)

    try {
      const presencas = dados.alunos.map((aluno) => ({
        alunoId: aluno.id,
        presente: mudancas[aluno.id] ?? aluno.presente,
      }))

      if (getEstadoPesquisa() === "erro") {
        throw new Error("Erro ao salvar presença")
      }

      await salvarPresencas(AULA_ATUAL_ID, presencas)
      toast.success("Presença enviada.")
      setMudancas({})
      setModoEdicao(false)
    } catch {
      toast.error("Não foi possível enviar a presença.")
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return <div className="p-6 text-center">Carregando presença...</div>
  }

  if (erro || !dados) {
    return (
      <div className="p-6 text-center">
        <p>Não foi possível carregar a presença da turma.</p>
        <Button type="button" className="mt-4" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[color:var(--page-bg)] p-4 text-[color:var(--title)]">
      <div className="mx-auto max-w-[390px] overflow-hidden rounded-[26px] bg-[color:var(--panel)] shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
        <div className="bg-[color:var(--panel)] p-4">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.13em] text-[color:var(--muted-text)]">
            <span>SEDUC · SERGIPE</span>
          </div>

          <div className="mb-3 text-[26px] font-semibold text-[color:var(--title)]">Lista de presença</div>

          <CardDataAula data={dados.aula.data} horario={dados.aula.horario} />
        </div>

        <div className="space-y-3 bg-[color:var(--surface)] p-4">
          <div className="overflow-hidden rounded-[18px] bg-[color:var(--card)] ring-1 ring-black/5">
            <div className="grid grid-cols-[1.9fr_0.8fr_1.1fr] gap-2 border-b border-black/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted-text)]">
              <span>Nome</span>
              <span className="text-center">P</span>
              <span className="text-center">Freq.</span>
            </div>

            {dados.alunos.map((aluno) => {
              const percentual = calcularFrequencia(aluno)
              const situacao = situacaoFrequencia(percentual)
              const presente = mudancas[aluno.id] ?? aluno.presente
              const corTexto =
                situacao === "normal"
                  ? "var(--text-strong)"
                  : situacao === "atencao"
                    ? "var(--warning)"
                    : "var(--danger)"

              return (
                <div key={aluno.id} className="grid grid-cols-[1.9fr_0.8fr_1.1fr] items-center gap-2 border-b border-black/5 px-3 py-3 last:border-b-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar className="h-8 w-8 rounded-full bg-[color:var(--avatar-bg)] text-[12px] font-semibold text-[color:var(--title)]">
                      <AvatarFallback>{aluno.nome[0]}</AvatarFallback>
                    </Avatar>
                    <span
                      className="truncate text-[14px] font-medium text-[color:var(--title)]"
                      style={{ color: situacao === "normal" ? undefined : corTexto, fontWeight: situacao !== "normal" ? 700 : 500 }}
                    >
                      {aluno.nome}
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      aria-label={`Presença de ${aluno.nome}`}
                      aria-pressed={presente}
                      disabled={!modoEdicao}
                      onClick={() => atualizarPresenca(aluno.id, !presente)}
                      className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${
                        presente
                          ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-white"
                          : "border-[color:var(--muted-border)] bg-transparent text-[color:var(--muted-text)]"
                      } ${modoEdicao ? "cursor-pointer" : "cursor-default opacity-100"}`}
                    >
                      {presente ? <Check size={14} /> : null}
                    </button>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="h-1.5 w-[72px] overflow-hidden rounded-full bg-[color:var(--progress-bg)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentual}%`,
                          backgroundColor:
                            situacao === "normal"
                              ? "var(--primary)"
                              : situacao === "atencao"
                                ? "var(--warning)"
                                : "var(--danger)",
                        }}
                      />
                    </div>
                    <div className="mt-1 text-[11px] font-semibold" style={{ color: corTexto }}>
                      {percentual}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-full border-[color:var(--muted-border)] bg-transparent text-[color:var(--title)]"
            onClick={() => (modoEdicao ? cancelarEdicao() : setModoEdicao(true))}
          >
            {modoEdicao ? "Cancelar edição" : "Editar presença"}
          </Button>

          <div className="rounded-[18px] bg-[color:var(--card)] p-3 ring-1 ring-black/5">
            <div className="mb-2 text-[12px] font-semibold text-[color:var(--muted-text)]">Observações</div>
            <div className="space-y-2 text-[13px] text-[color:var(--title)]">
              {alertas.length > 0 ? (
                <>
                  <p>{`A frequência mínima exigida é de ${FREQUENCIA_MINIMA}%.`}</p>
                  {alertas.map((alerta) => (
                    <p key={alerta}>{alerta}</p>
                  ))}
                </>
              ) : (
                <p>Nenhum aluno perto do limite de faltas.</p>
              )}
            </div>
          </div>

          <Button
            type="button"
            className="h-14 w-full rounded-[18px] bg-[color:var(--primary)] text-base font-bold text-white disabled:opacity-60"
            onClick={enviarPresencas}
            disabled={!modoEdicao || enviando}
          >
            {enviando ? "Enviando…" : "Enviar"}
          </Button>
        </div>
      </div>
    </div>
  )
}
