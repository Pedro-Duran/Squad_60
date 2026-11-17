import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatarSituacao } from "@/lib/texto"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AbasAlunos } from "@/components/dge/AbasAlunos"
import DgeAppShell from "@/components/layout/DgeAppShell"
import CampoFormulario from "@/components/shared/CampoFormulario"
import EstadoErro from "@/components/shared/EstadoErro"
import { formatarCpf } from "@/lib/texto"
import { atualizarAluno, buscarAlunoPorId } from "@/services/alunoService"

const TURNOS = ["Manhã", "Tarde", "Noite"]
const MODALIDADES = ["Ensino Fundamental", "Ensino Médio", "Ensino Médio Integral", "EJA"]
const SITUACOES = ["Matriculado", "Transferido", "Evadido", "Concluído"]
const TURMAS = ["A", "B", "C", "D", "E", "F"]

function seriesDaModalidade(modalidade) {
  const quantidade = modalidade === "Ensino Fundamental" ? 9 : 3
  return Array.from({ length: quantidade }, (_, index) => `${index + 1}º Ano`)
}

function criarDadosFormulario(aluno) {
  return {
    nome: aluno.nome || "",
    dataNascimento: aluno.dataNascimento || "",
    serie: aluno.serie || "",
    turma: aluno.turma || "",
    turno: aluno.turno || "",
    modalidade: aluno.modalidade || "",
    situacao: aluno.situacao || "",
  }
}

function formatarData(dataIso) {
  const correspondencia = dataIso?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return correspondencia ? `${correspondencia[3]}/${correspondencia[2]}/${correspondencia[1]}` : ""
}

function converterDataParaIso(dataTexto) {
  const correspondencia = dataTexto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!correspondencia) return ""

  const [, dia, mes, ano] = correspondencia
  const iso = `${ano}-${mes}-${dia}`
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia))

  if (
    Number.isNaN(data.getTime()) ||
    data.getFullYear() !== Number(ano) ||
    data.getMonth() !== Number(mes) - 1 ||
    data.getDate() !== Number(dia)
  ) {
    return ""
  }

  return iso
}

function aplicarMascaraData(valor) {
  const digitos = valor.replace(/\D/g, "").slice(0, 8)
  if (digitos.length <= 2) return digitos
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`
}

function validarFormulario(dados, dataTexto, turmaOriginal) {
  const erros = {}
  const camposObrigatorios = [
    ["serie", "Selecione a série/ano."],
    ["turma", "Selecione a turma."],
    ["turno", "Selecione o turno."],
    ["modalidade", "Selecione a modalidade."],
    ["situacao", "Selecione a situação."],
  ].filter(([campo]) => campo !== "turma" || turmaOriginal)

  if (!dados.nome.trim()) erros.nome = "Informe o nome completo."
  if (!dataTexto) {
    erros.dataNascimento = "Informe a data de nascimento."
  } else if (!dados.dataNascimento) {
    erros.dataNascimento = "Informe uma data válida no formato dd/mm/aaaa."
  } else {
    const [ano, mes, dia] = dados.dataNascimento.split("-").map(Number)
    const data = new Date(ano, mes - 1, dia)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    if (
      Number.isNaN(data.getTime()) ||
      data.getFullYear() !== ano ||
      data.getMonth() !== mes - 1 ||
      data.getDate() !== dia
    ) {
      erros.dataNascimento = "Informe uma data válida."
    } else if (data > hoje) {
      erros.dataNascimento = "A data não pode ser futura."
    }
  }

  for (const [campo, mensagem] of camposObrigatorios) {
    if (!dados[campo]) erros[campo] = mensagem
  }

  return erros
}

export default function EditarCadastro() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [estado, setEstado] = useState(null)
  const [tentativa, setTentativa] = useState(0)
  const [formulario, setFormulario] = useState(null)
  const [original, setOriginal] = useState(null)
  const [dataNascimentoTexto, setDataNascimentoTexto] = useState("")
  const [erros, setErros] = useState({})
  const [erroSalvar, setErroSalvar] = useState("")
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    let ativo = true

    buscarAlunoPorId(id)
      .then((aluno) => {
        if (!ativo) return
        const dados = criarDadosFormulario(aluno)
        setEstado({ id, aluno })
        setFormulario(dados)
        setOriginal(dados)
        setDataNascimentoTexto(formatarData(dados.dataNascimento))
        setErros({})
      })
      .catch((erro) => {
        if (ativo) setEstado({ id, erro })
      })

    return () => {
      ativo = false
    }
  }, [id, tentativa])

  const estadoAtual = estado?.id === id
  const aluno = estadoAtual ? estado.aluno : null
  const erroCarregamento = estadoAtual ? estado.erro : null
  const alterado = formulario && original && JSON.stringify(formulario) !== JSON.stringify(original)
  const voltarParaFicha = () => {
    navigate(`/dge/alunos/${id}`, {
      state: location.state?.from ? { from: location.state.from } : undefined,
    })
  }

  function atualizarCampo(campo, valor) {
    setFormulario((dados) => ({ ...dados, [campo]: valor }))
    setErros((atuais) => ({ ...atuais, [campo]: undefined }))
    setErroSalvar("")
  }

  function cancelar() {
    if (alterado && !window.confirm("Descartar as alterações não salvas?")) return
    voltarParaFicha()
  }

  async function salvar(event) {
    event.preventDefault()
    const validacao = validarFormulario(formulario, dataNascimentoTexto, original.turma)
    setErros(validacao)
    setErroSalvar("")

    if (Object.keys(validacao).length > 0) return

    setSalvando(true)
    try {
      await atualizarAluno(id, { ...formulario, nome: formulario.nome.trim() })
      navigate(`/dge/alunos/${id}`, {
        replace: true,
        state: {
          ...(location.state?.from ? { from: location.state.from } : {}),
          successMessage: "Cadastro atualizado com sucesso.",
        },
      })
    } catch {
      setErroSalvar("Não foi possível salvar as alterações. Tente novamente.")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <DgeAppShell>
      <div className="sticky top-0 z-10">
        <AbasAlunos ativa="editar" alunoId={id} voltarPara={`/dge/alunos/${id}`} />
        <header className="border-b border-border bg-card px-4 py-4 text-center">
          <h1 className="text-[22px] font-bold leading-7 text-foreground">Editar Cadastro</h1>
        </header>
      </div>

      <main className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col p-4">
        {erroCarregamento && (
          <EstadoErro
            titulo="Erro ao carregar cadastro"
            textoBotao="Tentar novamente"
            onTentarNovamente={() => setTentativa((valor) => valor + 1)}
          />
        )}

        {!erroCarregamento && !aluno && (
          <p role="status" className="text-sm text-muted-foreground">
            Carregando…
          </p>
        )}

        {aluno && formulario && (
          <div className="max-h-[calc(100dvh-300px)] overflow-y-auto rounded-2xl bg-card p-4 shadow-sm">
            <form noValidate onSubmit={salvar} className="space-y-4">
              <CampoFormulario id="nome" label="Nome completo" erro={erros.nome}>
                {(erroId) => (
                  <Input
                    id="nome"
                    value={formulario.nome}
                    onChange={(event) => atualizarCampo("nome", event.target.value)}
                    aria-invalid={Boolean(erros.nome)}
                    aria-describedby={erroId}
                    autoComplete="name"
                    className="h-12 border-slate-300 bg-white text-sm"
                  />
                )}
              </CampoFormulario>

              <CampoFormulario id="cpf" label="CPF">
                {() => (
                  <Input
                    id="cpf"
                    value={formatarCpf(aluno.cpf)}
                    disabled
                    className="h-12 border-transparent bg-slate-200 text-sm text-slate-500 opacity-100 disabled:opacity-100"
                  />
                )}
              </CampoFormulario>

              <CampoFormulario
                id="dataNascimento"
                label="Data de nascimento"
                erro={erros.dataNascimento}
              >
                {(erroId) => (
                  <div className="relative">
                    <Input
                      id="dataNascimento"
                      type="text"
                      inputMode="numeric"
                      placeholder="dd/mm/aaaa"
                      value={dataNascimentoTexto}
                      onChange={(event) => {
                        const texto = aplicarMascaraData(event.target.value)
                        setDataNascimentoTexto(texto)
                        atualizarCampo("dataNascimento", converterDataParaIso(texto))
                      }}
                      aria-invalid={Boolean(erros.dataNascimento)}
                      aria-describedby={erroId}
                      className="h-12 border-slate-300 bg-white pr-12 text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex w-12 items-center justify-center">
                      <CalendarDays
                        aria-hidden="true"
                        className="pointer-events-none size-4 text-slate-500"
                      />
                      <input
                        type="date"
                        aria-label="Abrir calendário da data de nascimento"
                        value={formulario.dataNascimento}
                        onChange={(event) => {
                          const dataIso = event.target.value
                          setDataNascimentoTexto(formatarData(dataIso))
                          atualizarCampo("dataNascimento", dataIso)
                        }}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </div>
                  </div>
                )}
              </CampoFormulario>

              <CampoFormulario id="serie" label="Série/Ano" erro={erros.serie}>
                {(erroId) => (
                  <Select
                    value={formulario.serie}
                    onValueChange={(valor) => atualizarCampo("serie", valor)}
                  >
                    <SelectTrigger
                      id="serie"
                      aria-invalid={Boolean(erros.serie)}
                      aria-describedby={erroId}
                      className="h-12 w-full border-slate-300 bg-white"
                    >
                      <SelectValue placeholder="Selecione a série/ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {seriesDaModalidade(formulario.modalidade).map((serie) => (
                        <SelectItem key={serie} value={serie}>
                          {serie}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </CampoFormulario>

              <CampoFormulario id="turma" label="Turma" erro={erros.turma}>
                {(erroId) => (
                  <Select
                    value={formulario.turma}
                    onValueChange={(valor) => atualizarCampo("turma", valor)}
                  >
                    <SelectTrigger
                      id="turma"
                      aria-invalid={Boolean(erros.turma)}
                      aria-describedby={erroId}
                      className="h-12 w-full border-slate-300 bg-white"
                    >
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {TURMAS.map((turma) => (
                        <SelectItem key={turma} value={turma}>
                          {turma}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </CampoFormulario>

              <CampoFormulario id="turno" label="Turno" erro={erros.turno}>
                {(erroId) => (
                  <Select
                    value={formulario.turno}
                    onValueChange={(valor) => atualizarCampo("turno", valor)}
                  >
                    <SelectTrigger
                      id="turno"
                      aria-invalid={Boolean(erros.turno)}
                      aria-describedby={erroId}
                      className="h-12 w-full border-slate-300 bg-white"
                    >
                      <SelectValue placeholder="Selecione o turno" />
                    </SelectTrigger>
                    <SelectContent>
                      {TURNOS.map((turno) => (
                        <SelectItem key={turno} value={turno}>
                          {turno}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </CampoFormulario>

              <CampoFormulario id="modalidade" label="Modalidade" erro={erros.modalidade}>
                {(erroId) => (
                  <Select
                    value={formulario.modalidade}
                    onValueChange={(valor) => {
                      const series = seriesDaModalidade(valor)
                      setFormulario((dados) => ({
                        ...dados,
                        modalidade: valor,
                        serie: series.includes(dados.serie) ? dados.serie : series[0],
                      }))
                      setErros((atuais) => ({ ...atuais, modalidade: undefined, serie: undefined }))
                      setErroSalvar("")
                    }}
                  >
                    <SelectTrigger
                      id="modalidade"
                      aria-invalid={Boolean(erros.modalidade)}
                      aria-describedby={erroId}
                      className="h-12 w-full border-slate-300 bg-white"
                    >
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {MODALIDADES.map((modalidade) => (
                        <SelectItem key={modalidade} value={modalidade}>
                          {modalidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </CampoFormulario>

              <CampoFormulario id="situacao" label="Situação" erro={erros.situacao}>
                {(erroId) => (
                  <Select
                    value={formatarSituacao(formulario.situacao, aluno.genero)}
                    onValueChange={(valor) => {
                      const situacao = SITUACOES.find(
                        (opcao) => formatarSituacao(opcao, aluno.genero) === valor
                      )
                      atualizarCampo("situacao", situacao || valor)
                    }}
                  >
                    <SelectTrigger
                      id="situacao"
                      aria-invalid={Boolean(erros.situacao)}
                      aria-describedby={erroId}
                      className="h-12 w-full border-slate-300 bg-white"
                    >
                      <SelectValue placeholder="Selecione a situação" />
                    </SelectTrigger>
                    <SelectContent>
                      {SITUACOES.map((situacao) => (
                        <SelectItem
                          key={situacao}
                          value={formatarSituacao(situacao, aluno.genero)}
                        >
                          {formatarSituacao(situacao, aluno.genero)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </CampoFormulario>

              {erroSalvar && (
                <p role="alert" className="text-sm font-medium text-destructive">
                  {erroSalvar}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelar}
                  className="h-12 min-w-0 flex-1 rounded-full border-primary px-3 text-primary hover:bg-primary/5 hover:text-primary"
                >
                  CANCELAR
                </Button>
                <Button
                  type="submit"
                  disabled={salvando}
                  className="h-12 min-w-0 flex-[1.5] rounded-full px-3"
                >
                  {salvando ? "SALVANDO…" : "SALVAR ALTERAÇÕES"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </DgeAppShell>
  )
}
