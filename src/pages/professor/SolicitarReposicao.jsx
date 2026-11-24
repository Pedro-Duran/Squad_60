import { useCallback, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "@/hooks/useAuth"
import { useDados } from "@/hooks/useDados"
import RodapeProfessor from "@/components/professor/RodapeProfessor"
import SeletorDataBrasileira from "@/components/professor/SeletorDataBrasileira"
import { buscarProfessor } from "@/services/professorService"
import { criarSolicitacaoReposicao } from "@/services/reposicaoService"

export default function SolicitarReposicao() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [formulario, setFormulario] = useState({
    turma: "",
    turno: "",
    dataAula: "",
    motivo: "",
  })
  const [erroEnvio, setErroEnvio] = useState("")
  const [enviando, setEnviando] = useState(false)
  const buscarProfessorLogado = useCallback(
    () => buscarProfessor(usuario.professorId),
    [usuario.professorId],
  )
  const {
    dados: professor,
    carregando,
    erro,
    recarregar,
  } = useDados(buscarProfessorLogado)
  const atendeFundamental =
    professor?.nivelEnsino.includes("Fundamental") ?? false
  const atendeMedio = professor?.nivelEnsino.includes("Médio") ?? false
  const exemplosTurma = [
    atendeFundamental && "6º Ano A",
    atendeMedio && "1º Ano EM A",
  ].filter(Boolean)
  const etapasAtendidas = [
    atendeFundamental && "6º ao 9º ano do Ensino Fundamental",
    atendeMedio && "1º ao 3º ano do Ensino Médio",
  ].filter(Boolean)

  function atualizarCampo(evento) {
    const { name, value } = evento.target
    setFormulario((atual) => ({ ...atual, [name]: value }))
  }

  async function enviarSolicitacao(evento) {
    evento.preventDefault()
    setErroEnvio("")
    if (!formulario.dataAula) {
      setErroEnvio("Informe uma data válida no formato DD/MM/AAAA.")
      return
    }
    setEnviando(true)
    try {
      await criarSolicitacaoReposicao({
        professorId: usuario.professorId,
        ...formulario,
      })
      navigate("/professor/reposicoes", { replace: true })
    } catch (erroSolicitacao) {
      setErroEnvio(
        erroSolicitacao instanceof Error
          ? erroSolicitacao.message
          : "Não foi possível enviar a solicitação.",
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#dedede] text-[#192a44]">
      <header className="bg-gradient-to-r from-[#001638] to-[#102aa5] px-5 pb-6 pt-5 text-white">
        <div className="mx-auto w-full max-w-[430px]">
          <Link
            to="/professor/reposicoes"
            className="inline-flex size-9 items-center justify-center rounded-full bg-white/10"
            aria-label="Voltar ao painel de reposições"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <p className="mt-4 text-[11px] font-bold tracking-[1.6px] text-white/80">
            SEDUC · SERGIPE
          </p>
          <h1 className="mt-2 text-2xl font-bold">Solicitar aula excepcional</h1>
          <p className="mt-2 text-sm text-white/75">
            Informe os dados da aula que precisa ser reposta.
          </p>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[430px] flex-1 px-4 py-5">
        {carregando ? (
          <p role="status">Carregando dados do professor...</p>
        ) : erro ? (
          <div className="rounded-2xl bg-white p-5 shadow-sm" role="alert">
            <p>Não foi possível carregar os dados do professor.</p>
            <p className="mt-1 text-sm text-slate-500">
              {erro instanceof Error ? erro.message : String(erro)}
            </p>
            <button
              type="button"
              className="mt-3 font-semibold text-blue-800 underline"
              onClick={recarregar}
            >
              Tentar novamente
            </button>
          </div>
        ) : professor ? (
          <form
            className="grid gap-4 rounded-2xl bg-white p-5 shadow-sm"
            onSubmit={enviarSolicitacao}
          >
            <div className="rounded-xl bg-slate-50 p-3 text-sm">
              <p>
                <strong>Professor:</strong> {professor.nome}
              </p>
              <p className="mt-1">
                <strong>Disciplina:</strong> {professor.disciplina}
              </p>
            </div>

            <label className="grid gap-1.5 text-sm font-semibold">
              Turma
              <input
                name="turma"
                required
                value={formulario.turma}
                onChange={atualizarCampo}
                placeholder={`Ex.: ${exemplosTurma.join(" ou ")}`}
                className="min-h-11 rounded-xl border border-slate-300 px-3 font-normal outline-none focus:border-blue-700"
              />
              <span className="font-normal text-slate-500">
                Turmas do {etapasAtendidas.join(" e ")}.
              </span>
            </label>

            <label className="grid gap-1.5 text-sm font-semibold">
              Turno
              <select
                name="turno"
                required
                value={formulario.turno}
                onChange={atualizarCampo}
                className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 font-normal outline-none focus:border-blue-700"
              >
                <option value="">Selecione o turno</option>
                <option value="Tarde">Tarde</option>
              </select>
            </label>

            <div className="grid gap-1.5 text-sm font-semibold">
              <span>Sugestão de data da aula de reposição</span>
              <SeletorDataBrasileira
                value={formulario.dataAula}
                onChange={(dataAula) =>
                  setFormulario((atual) => ({ ...atual, dataAula }))
                }
              />
            </div>

            <label className="grid gap-1.5 text-sm font-semibold">
              Motivo da solicitação
              <textarea
                name="motivo"
                required
                maxLength={500}
                value={formulario.motivo}
                onChange={atualizarCampo}
                placeholder="Descreva o motivo da reposição"
                className="min-h-24 resize-y rounded-xl border border-slate-300 px-3 py-2 font-normal outline-none focus:border-blue-700"
              />
            </label>

            {erroEnvio && (
              <p className="text-sm text-red-700" role="alert">
                {erroEnvio}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="min-h-12 rounded-full bg-[#1026a6] px-4 font-bold text-white disabled:opacity-60"
            >
              {enviando ? "Enviando..." : "Enviar solicitação"}
            </button>
          </form>
        ) : null}
      </section>
      <RodapeProfessor />
    </main>
  )
}
