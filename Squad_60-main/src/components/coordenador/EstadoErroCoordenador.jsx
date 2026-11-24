import { AlertTriangle, RefreshCw } from 'lucide-react'
import CabecalhoCoordenador from '@/components/coordenador/CabecalhoCoordenador'
import NavegacaoCoordenador from '@/components/coordenador/NavegacaoCoordenador'

export default function EstadoErroCoordenador({ titulo, voltarPara, ativo, mensagem, recarregar }) {
  return <main className="pagina-coordenador">
    <CabecalhoCoordenador titulo={titulo} voltarPara={voltarPara} />
    <section className="coord-conteudo coord-corpo">
      <div className="coord-estado" role="alert">
        <AlertTriangle size={30} aria-hidden="true" />
        <strong>Não foi possível carregar os dados</strong>
        <p>{mensagem ?? 'Tente novamente em instantes.'}</p>
        {recarregar && <button type="button" className="coord-botao coord-botao-primario" onClick={recarregar}><RefreshCw size={15} aria-hidden="true" /> Tentar novamente</button>}
      </div>
    </section>
    <NavegacaoCoordenador ativo={ativo} />
  </main>
}
