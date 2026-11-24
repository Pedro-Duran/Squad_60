import { ArrowLeft, Bell, BookOpen, CalendarDays, House } from "lucide-react"
import { Link } from "react-router"
import "@/pages/dge/reposicaoCalendario.css"

const ITENS_RODAPE = [
  { titulo: "Início", rota: "/dge", icone: House },
  { titulo: "Solicitações", rota: "/dge/solicitacoes", icone: CalendarDays },
  { titulo: "Registros", rota: "/dge/registros", icone: BookOpen },
]

export default function CalendarioReposicaoShell({
  children,
  titulo,
  subtitulo,
  voltarPara,
  aoVoltar,
  pendencias,
}) {
  return (
    <div className="calendario-reposicao">
      <header className="cr-cabecalho">
        <div className="cr-limite">
          <div className="cr-marca-linha">
            {aoVoltar ? (
              <button
                type="button"
                className="cr-voltar"
                aria-label="Voltar à tela anterior"
                onClick={aoVoltar}
              >
                <ArrowLeft size={20} aria-hidden="true" />
              </button>
            ) : voltarPara ? (
              <Link
                to={voltarPara}
                className="cr-voltar"
                aria-label="Voltar"
              >
                <ArrowLeft size={20} aria-hidden="true" />
              </Link>
            ) : null}
            <span className="cr-marca">SEDUC · SERGIPE</span>
            {pendencias !== undefined && (
              <span
                className="cr-sino"
                aria-label={`${pendencias} solicitações pendentes`}
              >
                <Bell size={19} aria-hidden="true" />
                <span className="cr-sino-contagem">{pendencias}</span>
              </span>
            )}
          </div>
          <h1 className="cr-titulo">{titulo}</h1>
          {subtitulo && <p className="cr-subtitulo">{subtitulo}</p>}
        </div>
      </header>

      <main className="cr-conteudo">
        <div className="cr-limite">{children}</div>
      </main>

      <footer className="cr-rodape">
        <nav className="cr-navegacao" aria-label="Navegação da Gestão Escolar">
          {ITENS_RODAPE.map(({ titulo: rotulo, rota, icone: Icone }) => (
            <Link key={rota} to={rota} className="cr-navegacao-item">
              <Icone size={19} aria-hidden="true" />
              <span>{rotulo}</span>
            </Link>
          ))}
        </nav>
        <p>©2026 Desenvolvido por SQUAD 60</p>
      </footer>
    </div>
  )
}
