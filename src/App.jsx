import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { AuthProvider } from "@/contexts/AuthProvider"
import ConteudoProgramatico from "@/pages/ConteudoProgramatico"
import CriarGradeCurricular from "@/pages/CriarGradeCurricular"
import EmConstrucao from "@/pages/EmConstrucao"
import Login from "@/pages/Login"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/professor" element={<ConteudoProgramatico />} />
          <Route path="/solicitacoes/criar-grade-curricular" element={<CriarGradeCurricular />} />
          <Route path="/registros" element={<EmConstrucao />} />
          <Route path="/coordenador" element={<EmConstrucao />} />
          <Route path="/dge" element={<EmConstrucao />} />
          <Route path="/secretaria" element={<EmConstrucao />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}