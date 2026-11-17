import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from "react-router"
import { AuthProvider } from "@/contexts/AuthProvider"
import RotaProtegida from "@/components/shared/RotaProtegida"
import LayoutProfessor from "@/components/professor/LayoutProfessor"
import { Toaster } from "@/components/ui/sonner"
import ConteudoProgramatico from "@/pages/ConteudoProgramatico"
import EditarCadastro from "@/pages/dge/EditarCadastro"
import FichaAluno from "@/pages/dge/FichaAluno"
import GerenciarAlunos from "@/pages/dge/GerenciarAlunos"
import HistoricoAluno from "@/pages/dge/HistoricoAluno"
import MenuDGE from "@/pages/dge/MenuDGE"
import PesquisarAluno from "@/pages/dge/PesquisarAluno"
import DiarioEletronico from "@/pages/professor/DiarioEletronico"
import EmConstrucao from "@/pages/EmConstrucao"
import Login from "@/pages/Login"
import AulasHoje from "@/pages/professor/AulasHoje"
import ListaPresenca from "@/pages/professor/ListaPresenca"
import MenuProfessor from "@/pages/professor/MenuProfessor"
import Reposicoes from "@/pages/professor/Reposicoes"

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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route element={<RotaProtegida perfil="professor" />}>
            <Route path="/professor" element={<MenuProfessor />} />
            <Route
              path="/professor/conteudo-programatico"
              element={<ConteudoProgramatico />}
            />
            <Route path="/professor/reposicoes" element={<Reposicoes />} />
            <Route
              path="/professor/reposicoes/todas"
              element={<EmConstrucao titulo="Todas as reposições" />}
            />
            <Route
              path="/professor/reposicoes/gerenciar"
              element={<EmConstrucao titulo="Gerenciar reposições" />}
            />
            <Route
              path="/professor/aulas-semana"
              element={<EmConstrucao titulo="Aulas da Semana" />}
            />
            <Route element={<LayoutProfessor />}>
              <Route path="/professor/aulas-hoje" element={<AulasHoje />} />
              <Route path="/professor/presenca" element={<ListaPresenca />} />
            </Route>
            <Route path="/professor/diario" element={<DiarioEletronico />} />
            <Route
              path="/professor/solicitacoes"
              element={<EmConstrucao titulo="Solicitações" />}
            />
            <Route
              path="/professor/solicitacoes/nova"
              element={<Navigate to="/professor/reposicoes" replace />}
            />
          </Route>
          <Route path="/coordenador" element={<Navigate to="/dge" replace />} />
          <Route element={<RotaProtegida perfil={["dge", "coordenador"]} />}>
            <Route path="/dge" element={<MenuDGE />} />
            <Route path="/dge/alunos" element={<PesquisarAluno />} />
            <Route path="/dge/alunos/gerenciar" element={<GerenciarAlunos />} />
            <Route path="/dge/alunos/:id/editar" element={<EditarCadastro />} />
            <Route path="/dge/alunos/:id/historico" element={<HistoricoAluno />} />
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
          </Route>
          <Route element={<RotaProtegida perfil="secretaria" />}>
            <Route path="/secretaria" element={<EmConstrucao />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  )
}
