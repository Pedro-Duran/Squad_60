import './coordenador.css'
import { useCallback, useState } from 'react'
import { Check } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import useDados from '@/hooks/useDados'
import { buscarEmenta, recusarEmenta, validarEmenta } from '@/services/ementaService'
import { formatarDataCurta } from '@/lib/datas'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import CabecalhoCoordenador from '@/components/coordenador/CabecalhoCoordenador'
import NavegacaoCoordenador from '@/components/coordenador/NavegacaoCoordenador'
import StatusEmenta from '@/components/coordenador/StatusEmenta'
import EstadoErroCoordenador from '@/components/coordenador/EstadoErroCoordenador'

const ROTA_LISTA = '/coordenador/ementas/validacao'

function Skeleton() {
  return <main className="pagina-coordenador" role="status" aria-label="Carregando ementa">
    <div className="coord-conteudo coord-skeleton">
      <div className="coord-sk coord-sk-linha" />
      <div className="coord-sk coord-sk-titulo" />
      <div className="coord-sk coord-sk-detalhe" />
    </div>
  </main>
}

const Campo = ({ rotulo, valor, className = '' }) => <div className={`coord-campo ${className}`}><dt>{rotulo}</dt><dd>{valor}</dd></div>

export default function AnalisarEmenta() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [parametros] = useSearchParams()
  const estado = parametros.get('estado')
  const simularFalha = parametros.get('simular') === 'erro-acao'
  const buscar = useCallback(() => buscarEmenta(id), [id])
  const { dados: ementa, carregando, erro, recarregar } = useDados(buscar)
  const [dialogo, setDialogo] = useState(null) // null | 'validar' | 'recusar'
  const [justificativa, setJustificativa] = useState('')
  const [erroJustificativa, setErroJustificativa] = useState('')
  const [erroAcao, setErroAcao] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (estado === 'carregando' || (carregando && estado !== 'erro')) return <Skeleton />
  if (estado === 'erro' || erro) return <EstadoErroCoordenador titulo="Analisar Ementa" voltarPara={ROTA_LISTA} ativo="solicitacoes" mensagem={erro?.message === 'Ementa não encontrada' ? 'A ementa solicitada não foi encontrada.' : undefined} recarregar={erro?.message === 'Ementa não encontrada' ? undefined : recarregar} />
  if (!ementa) return null

  const pendente = ementa.status === 'pendente'

  function abrir(tipo) {
    setJustificativa(''); setErroJustificativa(''); setErroAcao(''); setDialogo(tipo)
  }
  function fechar() {
    if (!enviando) setDialogo(null)
  }
  async function concluir(acao, mensagemSucesso) {
    setEnviando(true); setErroAcao('')
    try {
      await acao()
      toast.success(mensagemSucesso)
      navigate(ROTA_LISTA)
    } catch {
      setErroAcao('Não foi possível concluir a ação. O status da ementa não foi alterado. Tente novamente.')
      toast.error('Não foi possível concluir a ação.')
      setEnviando(false)
    }
  }
  const confirmarValidacao = () => concluir(() => validarEmenta(ementa.id, { forcarErro: simularFalha }), 'Ementa validada com sucesso.')
  function confirmarRecusa(evento) {
    evento.preventDefault()
    const texto = justificativa.trim()
    if (!texto) { setErroJustificativa('Informe a justificativa da recusa.'); return }
    concluir(() => recusarEmenta(ementa.id, texto, { forcarErro: simularFalha }), 'Ementa recusada com sucesso.')
  }

  return <main className="pagina-coordenador pagina-coordenador-acoes">
    <CabecalhoCoordenador titulo="Analisar Ementa" voltarPara={ROTA_LISTA} />
    <section className="coord-conteudo coord-corpo" aria-label="Detalhes da ementa">
      <div className="coord-card-detalhe">
        <div className="coord-detalhe-status"><h2>STATUS ATUAL</h2><StatusEmenta status={ementa.status} /></div>
        <dl className="coord-campos">
          <Campo rotulo="Título da Ementa" valor={ementa.titulo} className="coord-campo-inteiro" />
          <Campo rotulo="Coordenador" valor={ementa.coordenador} />
          <Campo rotulo="Disciplina" valor={ementa.disciplina} />
          <Campo rotulo="Série/Ano" valor={ementa.serie} />
          <Campo rotulo="Período" valor={ementa.periodo} />
          <Campo rotulo="Data de Envio" valor={formatarDataCurta(ementa.dataEnvio)} className="coord-campo-inteiro" />
        </dl>
        <div className="coord-conteudos">
          <h3>Conteúdos Programáticos</h3>
          <ol>{ementa.conteudos.map((c, i) => <li key={c}>{i + 1}. {c}</li>)}</ol>
        </div>
        <dl className="coord-campos"><Campo rotulo="Observações" valor={ementa.observacoes || '—'} className="coord-campo-inteiro coord-campo-obs" /></dl>
      </div>
    </section>

    {pendente && <div className="coord-acoes"><div className="coord-conteudo coord-acoes-linha">
      <button type="button" className="coord-botao coord-botao-recusar" onClick={() => abrir('recusar')}>Recusar</button>
      <button type="button" className="coord-botao coord-botao-primario" onClick={() => abrir('validar')}><Check size={19} aria-hidden="true" /> Validar Ementa</button>
    </div></div>}
    <NavegacaoCoordenador ativo="solicitacoes" />

    <Dialog open={dialogo === 'validar'} onOpenChange={(aberto) => { if (!aberto) fechar() }}>
      <DialogContent className="dialogo-coordenador" showCloseButton={false}>
        <DialogHeader><DialogTitle>Validar ementa?</DialogTitle><DialogDescription>A ementa “{ementa.titulo}” será marcada como Deferida.</DialogDescription></DialogHeader>
        {erroAcao && <p className="coord-erro-acao" role="alert">{erroAcao}</p>}
        <div className="dialogo-acoes">
          <button type="button" className="coord-botao coord-botao-contorno" onClick={fechar} disabled={enviando}>Cancelar</button>
          <button type="button" className="coord-botao coord-botao-primario" onClick={confirmarValidacao} disabled={enviando}>{enviando ? 'Validando...' : 'Confirmar validação'}</button>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={dialogo === 'recusar'} onOpenChange={(aberto) => { if (!aberto) fechar() }}>
      <DialogContent className="dialogo-coordenador" showCloseButton={false}>
        <form onSubmit={confirmarRecusa} noValidate>
          <DialogHeader><DialogTitle>Recusar ementa</DialogTitle><DialogDescription>Informe a justificativa. A ementa será marcada como Indeferida.</DialogDescription></DialogHeader>
          <label className="dialogo-rotulo" htmlFor="justificativa">Justificativa <span aria-hidden="true">*</span></label>
          <textarea id="justificativa" className="dialogo-texto" rows={4} value={justificativa} onChange={(e) => { setJustificativa(e.target.value); if (erroJustificativa) setErroJustificativa('') }} aria-invalid={erroJustificativa ? 'true' : undefined} aria-describedby={erroJustificativa ? 'erro-justificativa' : undefined} placeholder="Explique o motivo da recusa" disabled={enviando} />
          {erroJustificativa && <p id="erro-justificativa" className="coord-erro-acao" role="alert">{erroJustificativa}</p>}
          {erroAcao && <p className="coord-erro-acao" role="alert">{erroAcao}</p>}
          <div className="dialogo-acoes">
            <button type="button" className="coord-botao coord-botao-contorno" onClick={fechar} disabled={enviando}>Cancelar</button>
            <button type="submit" className="coord-botao coord-botao-recusar-cheio" disabled={enviando}>{enviando ? 'Recusando...' : 'Confirmar recusa'}</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </main>
}
