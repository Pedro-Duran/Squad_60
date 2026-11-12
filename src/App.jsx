import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { GerenciarReposicoes, ProfessorHome } from "@/pages/ProfessorHome"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/coordenador" replace />} />
        <Route path="/coordenador" element={<ProfessorHome />} />
        <Route path="/coordenador/reposicoes" element={<GerenciarReposicoes />} />
        <Route path="*" element={<Navigate to="/coordenador" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
