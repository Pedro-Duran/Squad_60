import { BrowserRouter, Navigate, Route, Routes, Link, useParams } from "react-router"
import PesquisarAluno from "@/pages/dge/PesquisarAluno"
import FichaAluno from "@/pages/dge/FichaAluno"

function DestinoPendente({ titulo }) {
  const { alunoId, secao } = useParams()
  const tituloTela =
    titulo || (alunoId && !secao ? "Ficha do Aluno" : "Esta tela ainda não está disponível.")

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background p-6 text-center">
      <h1 className="text-xl font-bold">{tituloTela}</h1>
      {alunoId && !secao && <p className="text-sm text-muted-foreground">Aluno: {alunoId}</p>}
      <Link to="/dge/alunos" className="text-sm font-semibold text-primary underline">
        Voltar para pesquisar alunos
      </Link>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dge/alunos" replace />} />
        <Route path="/dge/alunos" element={<PesquisarAluno />} />
        <Route
          path="/dge/alunos/gerenciar"
          element={<DestinoPendente titulo="Gerenciar Alunos" />}
        />
        <Route path="/dge/alunos/:id" element={<FichaAluno />} />
        <Route path="/dge/alunos/:alunoId/:secao" element={<DestinoPendente />} />
        <Route path="*" element={<Navigate to="/dge/alunos" replace />} />
      </Routes>
    </BrowserRouter>
  )
}