import { BrowserRouter, Navigate, Route, Routes } from "react-router"
<<<<<<< HEAD
import MenuProfessor from "@/pages/professor/MenuProfessor"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/professor" replace />} />
        <Route path="/professor" element={<MenuProfessor />} />
      </Routes>
    </BrowserRouter>
  )
}
=======
import { AuthProvider } from "@/contexts/AuthProvider"
import EmConstrucao from "@/pages/EmConstrucao"
import Login from "@/pages/Login"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/professor" element={<EmConstrucao />} />
          <Route path="/coordenador" element={<EmConstrucao />} />
          <Route path="/dge" element={<EmConstrucao />} />
          <Route path="/secretaria" element={<EmConstrucao />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
>>>>>>> develop
