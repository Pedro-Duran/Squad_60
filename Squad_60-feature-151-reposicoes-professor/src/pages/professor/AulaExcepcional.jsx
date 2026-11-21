import { useState } from 'react'
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Home, List, MapPin, BookOpen } from 'lucide-react'
import { Link } from 'react-router'
import './aula-excepcional.css'

const HORARIOS = [
  { id: '23-09', dia: 'Quarta', data: '23 Set 2026', inicio: '07:00', fim: '08:40', sala: 'Sala 12' },
  { id: '24-09', dia: 'Quinta', data: '24 Set 2026', inicio: '10:00', fim: '11:40', sala: 'Sala 08' },
  { id: '25-09', dia: 'Sexta', data: '25 Set 2026', inicio: '13:00', fim: '14:40', sala: 'Sala 15' },
  { id: '28-09', dia: 'Segunda', data: '28 Set 2026', inicio: '07:00', fim: '08:40', sala: 'Sala 12' },
]

function NavegacaoInferior() {
  return (
    <nav className="aula-nav-inferior" aria-label="Navegação principal">
      <Link to="/" className="aula-nav-item ativo"><Home size={20} strokeWidth={2.8} /><span>Início</span></Link>
      <Link to="/professor/solicitacoes" className="aula-nav-item"><List size={20} /><span>Solicitações</span></Link>
      <Link to="/professor/reposicoes" className="aula-nav-item"><BookOpen size={20} /><span>Registros</span></Link>
    </nav>
  )
}

export default function AulaExcepcional() {
  const [selecionado, setSelecionado] = useState('25-09')
  const [enviada, setEnviada] = useState(false)

  const horarioSelecionado = HORARIOS.find((horario) => horario.id === selecionado)

  function enviarSolicitacao() {
    const solicitacao = {
      id: `aula-excepcional-${Date.now()}`,
      tipo: 'aula-excepcional',
      disciplina: 'Biologia',
      turma: '3º B',
      turno: 'Manhã',
      professora: 'Juliana Costa',
      horario: horarioSelecionado,
      status: 'Aguardando análise da coordenação',
      criadaEm: new Date().toISOString(),
    }
    const anteriores = JSON.parse(localStorage.getItem('solicitacoesAulasExcepcionais') || '[]')
    localStorage.setItem('solicitacoesAulasExcepcionais', JSON.stringify([...anteriores, solicitacao]))
    setEnviada(true)
  }

  return (
    <main className="pagina-aula-excepcional">
      <header className="aula-topo">
        <div className="aula-topo-conteudo">
          <Link to="/" className="aula-voltar" aria-label="Voltar ao início"><ArrowLeft size={22} /></Link>
          <div>
            <p className="aula-marca">SEDUC · SERGIPE</p>
            <h1>Horários disponíveis</h1>
          </div>
        </div>

        <section className="aula-selecionada" aria-label="Aula selecionada">
          <p className="aula-selecionada-legenda">AULA SELECIONADA</p>
          <div className="aula-selecionada-conteudo">
            <span className="aula-disciplina-icone" aria-hidden="true" />
            <div className="aula-dados">
              <strong>Biologia</strong>
              <span>3º B – Manhã</span>
              <div className="aula-metadados">
                <span><BookOpen size={14} /> Profa. Juliana Costa</span>
                <span><CalendarDays size={14} /> 25/09/2026</span>
              </div>
            </div>
          </div>
        </section>
      </header>

      <section className="aula-corpo">
        <div className="aula-lista-cabecalho">
          <h2>Selecione um horário</h2>
          <p>Escolha uma data para solicitar a aula excepcional.</p>
        </div>

        <div className="aula-lista-horarios">
          {HORARIOS.map((horario) => {
            const ativo = horario.id === selecionado
            return (
              <button
                type="button"
                key={horario.id}
                className={`aula-horario-card${ativo ? ' selecionado' : ''}`}
                onClick={() => { setSelecionado(horario.id); setEnviada(false) }}
                aria-pressed={ativo}
              >
                <div className="aula-horario-topo">
                  <div>
                    <span className="aula-dia">{horario.dia}</span>
                    <strong>{horario.data}</strong>
                  </div>
                  <span className="aula-disponivel">Disponível</span>
                </div>
                <div className="aula-horario-info">
                  <span><Clock3 size={15} />{horario.inicio} – {horario.fim}</span>
                  <span><MapPin size={15} />{horario.sala}</span>
                </div>
              </button>
            )
          })}
        </div>

        {enviada ? (
          <div className="aula-confirmacao" role="status">
            <CheckCircle2 size={21} />
            <div>
              <strong>Solicitação enviada!</strong>
              <span>A coordenação poderá deferir ou indeferir sua solicitação.</span>
              <small>Status: aguardando análise.</small>
            </div>
          </div>
        ) : (
          <button type="button" className="aula-botao-confirmar" onClick={enviarSolicitacao}>
            Solicitar aula excepcional
          </button>
        )}
      </section>

      <NavegacaoInferior />
    </main>
  )
}
