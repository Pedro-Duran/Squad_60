import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Link } from 'react-router'

export default function EstadoErro({ nome, recarregar }) {
  return <main className="pagina-erro">
    <header className="erro-cabecalho">
      <div className="erro-cabecalho-interno">
        <Link to="/" className="erro-voltar" aria-label="Voltar ao menu do professor"><ArrowLeft size={21} /></Link>
        <div><strong>SEDUC · SERGIPE</strong><span>Dados para reposições</span></div>
      </div>
    </header>
    <section className="estado-erro" role="alert" aria-live="polite" aria-label={`Erro ao carregar ${nome}`}>
      <div className="erro-icone"><AlertTriangle size={30} strokeWidth={2} aria-hidden="true" /></div>
      <h1>Não foi possível carregar os dados</h1>
      <p>Não foi possível carregar os dados disponíveis para reposições de aulas. Tente novamente.</p>
      <button type="button" onClick={recarregar}><RefreshCw size={15} aria-hidden="true" /> Tentar novamente</button>
    </section>
  </main>
}
