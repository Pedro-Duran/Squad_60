import { STATUS_EMENTA } from '@/lib/ementas'

export default function StatusEmenta({ status }) {
  const item = STATUS_EMENTA[status] ?? { texto: status, classe: 'status-ementa-pendente' }
  return <span className={`status-ementa ${item.classe}`}>{item.texto}</span>
}
