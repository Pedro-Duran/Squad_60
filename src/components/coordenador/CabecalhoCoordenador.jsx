import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router'

export default function CabecalhoCoordenador({ titulo, voltarPara, children }) {
  return <header className="coord-topo">
    <div className="coord-conteudo">
      <div className="coord-topo-linha">
        <div className="coord-topo-marca">
          {voltarPara && <Link to={voltarPara} className="coord-voltar" aria-label="Voltar"><ChevronLeft size={22} aria-hidden="true" /></Link>}
          <span>SEDUC · SERGIPE</span>
        </div>
        <span className="coord-selo">DIÁRIO ELETRÔNICO</span>
      </div>
      <h1 className="coord-titulo">{titulo}</h1>
      {children}
    </div>
  </header>
}
