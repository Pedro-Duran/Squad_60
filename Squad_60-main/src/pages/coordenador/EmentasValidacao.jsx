import './coordenador.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight, EllipsisVertical, Search } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import useDados from '@/hooks/useDados'
import { listarEmentasParaValidacao } from '@/services/ementaService'
import { filtrarEmentas } from '@/lib/ementas'
import { formatarDataCurta } from '@/lib/datas'
import CabecalhoCoordenador from '@/components/coordenador/CabecalhoCoordenador'
import NavegacaoCoordenador from '@/components/coordenador/NavegacaoCoordenador'
import StatusEmenta from '@/components/coordenador/StatusEmenta'
import EstadoErroCoordenador from '@/components/coordenador/EstadoErroCoordenador'

const ROTA_ANALISAR = (id) => `/coordenador/ementas/validacao/${id}`

function Skeleton() {
  return <main className="pagina-coordenador" role="status" aria-label="Carregando ementas para validação">
    <div className="coord-conteudo coord-skeleton">
      <div className="coord-sk coord-sk-linha" />
      <div className="coord-sk coord-sk-titulo" />
      <div className="coord-sk coord-sk-busca" />
      {[0, 1, 2].map((i) => <div key={i} className="coord-sk coord-sk-card" />)}
    </div>
  </main>
}

function MenuAcoes({ id, titulo }) {
  const [aberto, setAberto] = useState(false)
  const raiz = useRef(null)
  useEffect(() => {
    if (!aberto) return undefined
    const fechar = (evento) => { if (evento.type === 'keydown' ? evento.key === 'Escape' : !raiz.current?.contains(evento.target)) setAberto(false) }
    document.addEventListener('mousedown', fechar)
    document.addEventListener('keydown', fechar)
    return () => { document.removeEventListener('mousedown', fechar); document.removeEventListener('keydown', fechar) }
  }, [aberto])
  return <div className="coord-menu" ref={raiz}>
    <button type="button" className="coord-menu-botao" aria-label={`Mais ações de ${titulo}`} aria-haspopup="menu" aria-expanded={aberto} onClick={() => setAberto((v) => !v)}><EllipsisVertical size={20} aria-hidden="true" /></button>
    {aberto && <div className="coord-menu-lista" role="menu"><Link role="menuitem" to={ROTA_ANALISAR(id)}>Analisar proposta</Link></div>}
  </div>
}

export default function EmentasValidacao() {
  const [parametros] = useSearchParams()
  const estado = parametros.get('estado')
  const { dados, carregando, erro, recarregar } = useDados(listarEmentasParaValidacao)
  const [busca, setBusca] = useState('')
  const filtradas = useMemo(() => filtrarEmentas(dados ?? [], busca), [dados, busca])
  if (estado === 'carregando' || (carregando && estado !== 'erro')) return <Skeleton />
  if (estado === 'erro' || erro) return <EstadoErroCoordenador titulo="Ementas para Validação" voltarPara="/coordenador" ativo="solicitacoes" mensagem="Não foi possível carregar as ementas para validação." recarregar={recarregar} />
  if (!dados) return null
  const buscando = busca.trim().length > 0
  return <main className="pagina-coordenador">
    <CabecalhoCoordenador titulo="Ementas para Validação" voltarPara="/coordenador">
      <div className="coord-busca">
        <Search size={20} aria-hidden="true" />
        <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por ementa, disciplina ou coordenador..." aria-label="Buscar por ementa, disciplina ou coordenador" />
      </div>
    </CabecalhoCoordenador>
    <section className="coord-conteudo coord-corpo" aria-label="Lista de ementas">
      {filtradas.length === 0
        ? <p className="coord-vazio" role="status">{buscando ? 'Nenhuma ementa encontrada para a sua busca.' : 'Nenhuma ementa enviada para validação.'}</p>
        : <ul className="coord-lista">{filtradas.map((e) => <li key={e.id} className="coord-card-ementa">
          <div className="coord-card-topo">
            <div><h2>{e.titulo}</h2><p className="coord-card-serie">{e.disciplina} • {e.serie}</p></div>
            <MenuAcoes id={e.id} titulo={e.titulo} />
          </div>
          <p className="coord-card-meta">Criado por: {e.coordenador}<br />Enviado em: {formatarDataCurta(e.dataEnvio)}</p>
          <div className="coord-card-rodape"><StatusEmenta status={e.status} /><Link className="coord-analisar" to={ROTA_ANALISAR(e.id)}>Analisar Proposta <ChevronRight size={17} aria-hidden="true" /></Link></div>
        </li>)}</ul>}
    </section>
    <NavegacaoCoordenador ativo="solicitacoes" />
  </main>
}
