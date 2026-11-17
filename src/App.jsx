import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { AuthProvider } from "@/contexts/AuthProvider"
import RotaProtegida from "@/components/shared/RotaProtegida"
import LayoutProfessor from "@/components/professor/LayoutProfessor"
import { Toaster } from "@/components/ui/sonner"
import ConteudoProgramatico from "@/pages/ConteudoProgramatico"
import DiarioEletronico from "@/pages/professor/DiarioEletronico"
import EmConstrucao from "@/pages/EmConstrucao"
import Login from "@/pages/Login"
import ListaPresenca from "@/pages/professor/ListaPresenca"
import MenuProfessor from "@/pages/professor/MenuProfessor"
import Reposicoes from "@/pages/professor/Reposicoes"

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
              path="/professor/aulas-hoje"
              element={<EmConstrucao titulo="Aulas de Hoje" />}
            />
            <Route
              path="/professor/aulas-semana"
              element={<EmConstrucao titulo="Aulas da Semana" />}
            />
            <Route element={<LayoutProfessor />}>
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
          <Route element={<RotaProtegida perfil="coordenador" />}>
            <Route path="/coordenador" element={<EmConstrucao />} />
          </Route>
          <Route element={<RotaProtegida perfil="dge" />}>
            <Route path="/dge" element={<EmConstrucao />} />
          </Route>
          <Route element={<RotaProtegida perfil="secretaria" />}>
            <Route path="/secretaria" element={<EmConstrucao />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  )
}