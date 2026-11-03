import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import RotaProtegida from "@/components/shared/RotaProtegida"
import { AuthProvider } from "@/contexts/AuthProvider"
import EmConstrucao from "@/pages/EmConstrucao"
import Login from "@/pages/Login"
import MenuProfessor from "@/pages/professor/MenuProfessor"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route element={<RotaProtegida perfil="professor" />}>
            <Route path="/professor" element={<MenuProfessor />} />
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
      </BrowserRouter>
    </AuthProvider>
  )
}
