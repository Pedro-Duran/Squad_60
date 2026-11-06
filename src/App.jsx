import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { AuthProvider } from "@/contexts/AuthProvider"
import EmConstrucao from "@/pages/EmConstrucao"
import Login from "@/pages/Login"
import { GerenciarReposicoes, ProfessorHome } from "@/pages/ProfessorHome"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/coordenador" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/professor" element={<ProfessorHome />} />
          <Route path="/coordenador" element={<GerenciarReposicoes />} />
          <Route path="/professor/gerenciar" element={<GerenciarReposicoes />} />
          <Route path="/dge" element={<EmConstrucao />} />
          <Route path="/secretaria" element={<EmConstrucao />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
