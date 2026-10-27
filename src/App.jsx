import { BrowserRouter, Navigate, Route, Routes } from "react-router"
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
