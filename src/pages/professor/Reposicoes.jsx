import './reposicoes.css'
import { Bell, ChevronRight } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import useDados from '@/hooks/useDados'
import { buscarPainelReposicoes } from '@/services/reposicaoService'
import { formatarDataExtensa } from '@/lib/datas'
import CardResumo from '@/components/professor/CardResumo'
import CardReposicao from '@/components/professor/CardReposicao'
import EstadoErro from '@/components/shared/EstadoErro'
const PROFESSOR_LOGADO_ID = 'prof-001'
const HOJE = '2026-09-14'
const buscarPainel = () => buscarPainelReposicoes(PROFESSOR_LOGADO_ID, HOJE)
const RESUMOS = [
  { chave: 'aulasPendentes', rotulo: 'Aulas pendentes' },
  { chave: 'reposicoesAgendadas', rotulo: 'Reposições agendadas' },
  { chave: 'horariosDisponiveis', rotulo: 'Horários disponíveis' },
  { chave: 'solicitacoesPendentes', rotulo: 'Solicitações pendentes' },
]
function Skeleton() {
  return <div className="skeleton-pagina" aria-label="Carregando painel de reposições" role="status"><div className="skeleton skeleton-topo" /><div className="skeleton skeleton-titulo" />{[0, 1, 2].map((i) => <div key={i} className="skeleton skeleton-card" />)}</div>
}
export default function Reposicoes() {
  const [parametros, setParametros] = useSearchParams()
  const estado = parametros.get('estado')
  const { dados, carregando, erro, recarregar } = useDados(buscarPainel)
  if (estado === 'carregando' || (carregando && estado !== 'erro')) return <Skeleton />
  const tentarNovamente = () => {
    if (estado === 'erro') {
      parametros.delete('estado')
      setParametros(parametros, { replace: true })
    }
    recarregar()
  }
  if (estado === 'erro' || erro) return <EstadoErro nome="o painel de reposições" recarregar={tentarNovamente} />
  if (!dados) return null
  const { professor, resumo, proximas } = dados
  return <main className="pagina-reposicoes">
    <header className="reposicoes-topo"><div className="reposicoes-conteudo">
      <div className="saudacao-linha"><div><p className="marca">SEDUC · SERGIPE</p><h1>Olá, {professor.nomeCurto}!</h1><p className="data-extensa">{formatarDataExtensa(HOJE)}</p></div><div className="sino" role="img" aria-label={`${resumo.solicitacoesPendentes} solicitações pendentes`}><Bell size={22} aria-hidden="true" /><span className="sino-contador" aria-hidden="true">{resumo.solicitacoesPendentes}</span></div></div>
      <div className="resumos">{RESUMOS.map((item, indice) => <CardResumo key={item.chave} numero={resumo[item.chave]} rotulo={item.rotulo} destaque={indice === 0} />)}</div>
    </div></header>
    <section className="reposicoes-corpo"><div className="secao-cabecalho"><h2>Próximas reposições</h2><Link to="/professor/reposicoes/todas">Ver todas <ChevronRight size={17} aria-hidden="true" /></Link></div>
      <div className="lista-reposicoes">{proximas.length ? proximas.map((item) => <CardReposicao key={item.id} reposicao={item} />) : <p className="sem-reposicoes">Nenhuma reposição marcada.</p>}</div>
      <Link className="botao-gerenciar" to="/professor/reposicoes/gerenciar">Gerenciar reposições</Link>
    </section>
  </main>
}
