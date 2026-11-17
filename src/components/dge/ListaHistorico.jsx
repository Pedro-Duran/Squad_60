import ItemHistorico from "@/components/dge/ItemHistorico"

export default function ListaHistorico({ registros }) {
  return (
    <div className="space-y-3">
      {registros.map((registro) => (
        <ItemHistorico key={registro.id} registro={registro} />
      ))}
    </div>
  )
}
