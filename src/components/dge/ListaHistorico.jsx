import ItemHistorico from "@/components/dge/ItemHistorico"

export default function ListaHistorico({ registros, genero }) {
  return (
    <div className="space-y-3">
      {registros.map((registro) => (
        <ItemHistorico key={registro.id} registro={registro} genero={genero} />
      ))}
    </div>
  )
}
