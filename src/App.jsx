import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import LayoutProfessor from "@/components/professor/LayoutProfessor"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/AuthProvider"
import EmConstrucao from "@/pages/EmConstrucao"
import Login from "@/pages/Login"
import AulasHoje from "@/pages/professor/AulasHoje"
import ListaPresenca from "@/pages/professor/ListaPresenca"
import Placeholder from "@/pages/professor/Placeholder"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/professor" element={<EmConstrucao />} />
          <Route element={<LayoutProfessor />}>
            <Route path="/professor/aulas-hoje" element={<AulasHoje />} />
            <Route path="/professor/presenca" element={<ListaPresenca />} />
            <Route
              path="/professor/diario"
              element={<Placeholder titulo="Diário Eletrônico" />}
            />
            <Route
              path="/professor/solicitacoes"
              element={<Placeholder titulo="Solicitações" />}
            />
            <Route
              path="/professor/registros"
              element={<Placeholder titulo="Registros" />}
            />
          </Route>
          <Route path="/coordenador" element={<EmConstrucao />} />
          <Route path="/dge" element={<EmConstrucao />} />
          <Route path="/secretaria" element={<EmConstrucao />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </AuthProvider>
  )
}
