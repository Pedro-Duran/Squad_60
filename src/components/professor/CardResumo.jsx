export default function CardResumo({ numero, rotulo, destaque }) {
  return <div className={`card-resumo${destaque ? ' card-resumo-destaque' : ''}`}><strong>{numero}</strong><span>{rotulo}</span></div>
}
