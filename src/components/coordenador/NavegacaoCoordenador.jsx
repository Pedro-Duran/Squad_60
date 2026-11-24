import { FileText, Folder, Home } from 'lucide-react'
import { Link } from 'react-router'

const ITENS = [
  { chave: 'inicio', rotulo: 'Início', to: '/coordenador', Icone: Home },
  { chave: 'solicitacoes', rotulo: 'Solicitações', to: '/coordenador/ementas/validacao', Icone: FileText },
  { chave: 'registros', rotulo: 'Registros', to: '/coordenador/registros', Icone: Folder },
]

export default function NavegacaoCoordenador({ ativo }) {
  return <nav className="coord-nav" aria-label="Navegação principal">
    <div className="coord-nav-itens">
      {ITENS.map(({ chave, rotulo, to, Icone }) => (
        <Link key={chave} to={to} className={`coord-nav-item${ativo === chave ? ' ativo' : ''}`} aria-current={ativo === chave ? 'page' : undefined}>
          <Icone size={22} strokeWidth={ativo === chave ? 2.4 : 2} aria-hidden="true" />
          <span>{rotulo}</span>
        </Link>
      ))}
    </div>
    <p className="coord-nav-rodape">©2026 Desenvolvido por SQUAD 60</p>
  </nav>
}
