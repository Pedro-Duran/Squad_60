import { BrowserRouter, Navigate, Route, Routes, Link, useParams } from "react-router"
import PesquisarAluno from "@/pages/dge/PesquisarAluno"
import FichaAluno from "@/pages/dge/FichaAluno"
import EditarCadastro from "@/pages/dge/EditarCadastro"
import MenuDGE from "@/pages/dge/MenuDGE"

function DestinoPendente({ titulo }) {
  const { alunoId, secao } = useParams()
  const rotaVoltar = alunoId && secao ? `/dge/alunos/${alunoId}` : "/dge"
  const textoVoltar = alunoId && secao ? "Voltar para a ficha do aluno" : "Voltar para a Gestão Escolar"
  const tituloTela =
    titulo || (alunoId && !secao ? "Ficha do Aluno" : "Esta tela ainda não está disponível.")

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background p-6 text-center">
      <h1 className="text-xl font-bold">{tituloTela}</h1>
      {alunoId && !secao && <p className="text-sm text-muted-foreground">Aluno: {alunoId}</p>}
      <Link to={rotaVoltar} className="text-sm font-semibold text-primary underline">
        {textoVoltar}
      </Link>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dge" replace />} />
        <Route path="/dge" element={<MenuDGE />} />
        <Route path="/dge/alunos" element={<PesquisarAluno />} />
        <Route
          path="/dge/alunos/gerenciar"
          element={<DestinoPendente titulo="Gerenciar Alunos" />}
        />
        <Route path="/dge/alunos/:id/editar" element={<EditarCadastro />} />
        <Route path="/dge/alunos/:id" element={<FichaAluno />} />
        <Route path="/dge/grade" element={<DestinoPendente titulo="Grade Curricular" />} />
        <Route
          path="/dge/modalidades"
          element={<DestinoPendente titulo="Modalidade e Disciplinas" />}
        />
        <Route path="/dge/ementas" element={<DestinoPendente titulo="Controle de Ementas" />} />
        <Route
          path="/dge/reposicao"
          element={<DestinoPendente titulo="Calendário de Reposição" />}
        />
        <Route
          path="/dge/conteudo"
          element={<DestinoPendente titulo="Conteúdo Programático" />}
        />
        <Route path="/dge/solicitacoes" element={<DestinoPendente titulo="Solicitações" />} />
        <Route path="/dge/registros" element={<DestinoPendente titulo="Registros" />} />
        <Route path="/dge/alunos/:alunoId/:secao" element={<DestinoPendente />} />
        <Route path="*" element={<Navigate to="/dge" replace />} />
      </Routes>
    </BrowserRouter>
  )
}