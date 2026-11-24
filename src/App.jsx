import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { Toaster } from "@/components/ui/sonner"
import { AulasIntegrais } from "@/pages/AulasIntegrais"
import { GerenciarDisciplinas } from "@/pages/GerenciarDisciplinas"
import { MenuModalidadeDisciplinas } from "@/pages/MenuModalidadeDisciplinas"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuModalidadeDisciplinas />} />
        <Route path="/modalidade-disciplinas" element={<Navigate to="/" replace />} />
        <Route path="/disciplinas" element={<GerenciarDisciplinas />} />
        <Route path="/aulas-integrais" element={<AulasIntegrais />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  )
}