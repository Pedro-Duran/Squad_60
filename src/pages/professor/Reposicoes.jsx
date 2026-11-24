import './reposicoes.css'
import { useCallback } from 'react'
import { ArrowLeft, Bell, ChevronRight, Plus } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useDados } from '@/hooks/useDados'
import { buscarPainelReposicoes } from '@/services/reposicaoService'
import { formatarDataExtensa } from '@/lib/datas'
import CardResumo from '@/components/professor/CardResumo'
import CardReposicao from '@/components/professor/CardReposicao'
import RodapeProfessor from '@/components/professor/RodapeProfessor'
import EstadoErro from '@/components/shared/EstadoErro'
const HOJE = new Date().toLocaleDateString('en-CA')
const RESUMOS = [
  { chave: 'aulasPendentes', rotulo: 'Aulas pendentes' },
  { chave: 'reposicoesAgendadas', rotulo: 'Reposições agendadas' },
  { chave: 'horariosDisponiveis', rotulo: 'Horários disponíveis' },
  { chave: 'solicitacoesPendentes', rotulo: 'Solicitações pendentes' },
]
function Skeleton() {
  return <div className="skeleton-pagina" aria-label="Carregando painel de reposições" role="status"><div className="skeleton skeleton-topo" /><div className="skeleton skeleton-titulo" />{[0, 1, 2].map((i) => <div key={i} className="skeleton skeleton-card" />)}</div>
}

function PaginaComRodape({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#dedede]">
      {children}
      <RodapeProfessor />
    </div>
  )
}

export default function Reposicoes() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [parametros, setParametros] = useSearchParams()
  const estado = parametros.get('estado')
  const buscarPainel = useCallback(
    () => buscarPainelReposicoes(usuario.professorId, HOJE),
    [usuario.professorId],
  )
  const { dados, carregando, erro, recarregar } = useDados(buscarPainel)
  if (estado === 'carregando' || (carregando && estado !== 'erro')) return <PaginaComRodape><div className="flex-1"><Skeleton /></div></PaginaComRodape>
  const tentarNovamente = () => {
    if (estado === 'erro') {
      parametros.delete('estado')
      setParametros(parametros, { replace: true })
    }
    recarregar()
  }
  if (estado === 'erro' || erro) return <PaginaComRodape><div className="flex flex-1 flex-col"><EstadoErro nome="o painel de reposições" recarregar={tentarNovamente} /></div></PaginaComRodape>
  if (!dados) return <PaginaComRodape />
  const { professor, resumo, proximas } = dados
  return <PaginaComRodape><main className="pagina-reposicoes flex-1">
    <header className="reposicoes-topo"><div className="reposicoes-conteudo">
      <div className="saudacao-linha">
        <div className="flex items-start gap-3">
          <button
            aria-label="Voltar à tela anterior"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={() => navigate(-1)}
            type="button"
          >
            <ArrowLeft aria-hidden="true" size={20} />
          </button>
          <div>
            <p className="marca">SEDUC · SERGIPE</p>
            <h1>Olá, {professor.nomeCurto}!</h1>
            <p className="data-extensa">{formatarDataExtensa(HOJE)}</p>
          </div>
        </div>
        <div className="sino" role="img" aria-label={`${resumo.solicitacoesPendentes} solicitações pendentes`}>
          <Bell size={22} aria-hidden="true" />
          <span className="sino-contador" aria-hidden="true">{resumo.solicitacoesPendentes}</span>
        </div>
      </div>
      <div className="resumos">{RESUMOS.map((item, indice) => <CardResumo key={item.chave} numero={resumo[item.chave]} rotulo={item.rotulo} destaque={indice === 0} />)}</div>
    </div></header>
    <section className="reposicoes-corpo"><div className="secao-cabecalho"><h2>Próximas reposições</h2><Link to="/professor/reposicoes/todas">Ver todas <ChevronRight size={17} aria-hidden="true" /></Link></div>
      <div className="lista-reposicoes">{proximas.length ? proximas.map((item) => <CardReposicao key={item.id} reposicao={item} />) : <p className="sem-reposicoes">Nenhuma reposição marcada.</p>}</div>
      <Link className="botao-gerenciar" to="/professor/solicitacoes/nova"><Plus size={18} aria-hidden="true" /> Solicitar nova reposição</Link>
    </section>
  </main></PaginaComRodape>
}
