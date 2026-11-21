import { useState } from 'react'
import { ArrowLeft, CalendarDays, Clock3, List, Home, BookOpen, Hourglass } from 'lucide-react'
import { Link } from 'react-router'
import './aula-excepcional.css'

function NavegacaoInferior() {
  return (
    <nav className="aula-nav-inferior" aria-label="Navegação principal">
      <Link to="/" className="aula-nav-item"><Home size={20} /><span>Início</span></Link>
      <Link to="/professor/solicitacoes" className="aula-nav-item ativo"><List size={20} strokeWidth={2.8} /><span>Solicitações</span></Link>
      <Link to="/professor/reposicoes" className="aula-nav-item"><BookOpen size={20} /><span>Registros</span></Link>
    </nav>
  )
}

export default function SolicitacoesAulas() {
  const [solicitacoes] = useState(() => {
    const salvas = JSON.parse(localStorage.getItem('solicitacoesAulasExcepcionais') || '[]')
    return salvas.slice().reverse()
  })

  return (
    <main className="pagina-aula-excepcional pagina-solicitacoes-aula">
      <header className="aula-topo aula-topo-solicitacoes">
        <div className="aula-topo-conteudo">
          <Link to="/" className="aula-voltar" aria-label="Voltar ao início"><ArrowLeft size={22} /></Link>
          <div>
            <p className="aula-marca">SEDUC · SERGIPE</p>
            <h1>Minhas solicitações</h1>
          </div>
        </div>
      </header>
      <section className="aula-corpo">
        {solicitacoes.length === 0 ? (
          <div className="aula-vazio">
            <List size={30} />
            <strong>Nenhuma solicitação ainda</strong>
            <p>Quando você solicitar uma aula excepcional, ela aparecerá aqui.</p>
            <Link to="/professor/aula-excepcional" className="aula-botao-link">Solicitar aula excepcional</Link>
          </div>
        ) : (
          <div className="aula-lista-solicitacoes">
            {solicitacoes.map((item) => (
              <article className="aula-solicitacao-card" key={item.id}>
                <div className="aula-solicitacao-titulo">
                  <div><strong>{item.disciplina}</strong><span>{item.turma} – {item.turno}</span></div>
                  <span className="aula-status-pendente"><Hourglass size={13} /> Em análise</span>
                </div>
                <div className="aula-horario-info">
                  <span><CalendarDays size={15} />{item.horario.data}</span>
                  <span><Clock3 size={15} />{item.horario.inicio} – {item.horario.fim}</span>
                </div>
                <p>Aguardando deferimento ou indeferimento da coordenação.</p>
              </article>
            ))}
          </div>
        )}
      </section>
      <NavegacaoInferior />
    </main>
  )
}
