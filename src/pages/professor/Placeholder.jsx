import { useSearchParams } from "react-router"

// Páginas provisórias (telas de outras tarefas / issues). Mostram o contexto
// recebido pela URL (?aula=) quando houver.
export default function Placeholder({ titulo }) {
  const [params] = useSearchParams()
  const aula = params.get("aula")

  return (
    <div className="placeholder">
      <h1>{titulo}</h1>
      <p>
        Tela ainda não implementada (outra tarefa).
        {aula && (
          <>
            {" "}
            Aula recebida: <code>{aula}</code>
          </>
        )}
      </p>
    </div>
  )
}
