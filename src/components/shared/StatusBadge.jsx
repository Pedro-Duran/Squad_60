const STATUS = {
  pendente: { texto: 'Pendente', classe: 'status-pendente' },
  aprovada: { texto: 'Aprovada', classe: 'status-aprovada' },
  recusada: { texto: 'Recusada', classe: 'status-recusada' },
}
export default function StatusBadge({ status }) {
  const item = STATUS[status] ?? { texto: status, classe: 'status-desconhecido' }
  return <span className={`status-badge ${item.classe}`}><span className="status-dot" aria-hidden="true" />{item.texto}</span>
}
