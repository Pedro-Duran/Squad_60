export default function CampoFormulario({ id, label, erro, children }) {
  const erroId = erro ? `${id}-erro` : undefined

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      {children(erroId)}
      {erro && (
        <p id={erroId} className="text-xs font-medium text-destructive">
          {erro}
        </p>
      )}
    </div>
  )
}
