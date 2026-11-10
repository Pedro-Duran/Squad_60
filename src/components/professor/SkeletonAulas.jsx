// Placeholder animado enquanto as aulas carregam.
export default function Skeleton() {
  return (
    <div className="skeleton" aria-busy="true" aria-label="Carregando aulas">
      <div className="skeleton__bloco skeleton__bloco--resumo" />
      <div className="skeleton__bloco" />
      <div className="skeleton__bloco" />
      <div className="skeleton__bloco" />
    </div>
  )
}
