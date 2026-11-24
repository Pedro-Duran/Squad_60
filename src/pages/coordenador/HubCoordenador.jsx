import './coordenador.css'
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { useDados } from '@/hooks/useDados'
import { buscarCoordenadorLogado } from '@/services/ementaService'
import NavegacaoCoordenador from '@/components/coordenador/NavegacaoCoordenador'
import EstadoErroCoordenador from '@/components/coordenador/EstadoErroCoordenador'

const COORDENADOR_LOGADO_ID = 'coord-001'
const buscarUsuario = () => buscarCoordenadorLogado(COORDENADOR_LOGADO_ID)

function Skeleton() {
  return <main className="pagina-coordenador" role="status" aria-label="Carregando hub do coordenador">
    <div className="coord-conteudo coord-skeleton">
      <div className="coord-sk coord-sk-linha" />
      <div className="coord-sk coord-sk-titulo" />
      <div className="coord-sk coord-sk-texto" />
      <div className="coord-sk coord-sk-card" />
      <div className="coord-sk coord-sk-item" />
      <div className="coord-sk coord-sk-item" />
    </div>
  </main>
}

export default function HubCoordenador() {
  const [parametros] = useSearchParams()
  const estado = parametros.get('estado')
  const { dados: usuario, carregando, erro, recarregar } = useDados(buscarUsuario)
  if (estado === 'carregando' || (carregando && estado !== 'erro')) return <Skeleton />
  if (estado === 'erro' || erro) return <EstadoErroCoordenador titulo="Hub do Coordenador" ativo="inicio" recarregar={recarregar} />
  if (!usuario) return null
  return <main className="pagina-coordenador">
    <header className="coord-topo">
      <div className="coord-conteudo">
        <div className="coord-topo-linha"><div className="coord-topo-marca"><Link to="/dge" className="coord-voltar" aria-label="Voltar ao menu da gestão escolar"><ChevronLeft size={22} aria-hidden="true" /></Link><span>SEDUC · SERGIPE</span></div><span className="coord-selo">DIÁRIO ELETRÔNICO</span></div>
        <h1 className="coord-titulo">Hub do Coordenador</h1>
        <p className="coord-cargo">{usuario.cargo}</p>
        <p className="coord-saudacao">Olá, {usuario.nome}</p>
      </div>
    </header>
    <section className="coord-conteudo coord-corpo">
      <div className="coord-card-destaque">
        <p className="coord-rotulo">PLANEJAMENTO 2026</p>
        <h2>Ementas Pedagógicas</h2>
        <p>Crie ou gerencie ementas curriculares e envie para validação direta da diretoria regional de ensino.</p>
        <Link className="coord-botao coord-botao-primario coord-botao-bloco" to="/coordenador/ementas/nova"><Plus size={20} aria-hidden="true" /> Criar Ementa Pedagógica</Link>
      </div>
      <h2 className="coord-secao">Acesso Rápido</h2>
      <div className="coord-acessos">
        <Link className="coord-acesso" to="/coordenador/ementas">
          <span className="coord-acesso-icone"><BookOpen size={21} aria-hidden="true" /></span>
          <span className="coord-acesso-texto"><strong>Ver Ementas Criadas</strong><small>Histórico de propostas</small></span>
          <ChevronRight size={20} aria-hidden="true" />
        </Link>
        <Link className="coord-acesso" to="/coordenador/ementas/validacao">
          <span className="coord-acesso-icone"><CheckCircle2 size={21} aria-hidden="true" /></span>
          <span className="coord-acesso-texto"><strong>Acompanhar Validações</strong><small>Acompanhe pareceres</small></span>
          <ChevronRight size={20} aria-hidden="true" />
        </Link>
      </div>
    </section>
    <NavegacaoCoordenador ativo="inicio" />
  </main>
}
