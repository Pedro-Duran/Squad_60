import { BrowserRouter, Route, Routes } from "react-router"
import { Toaster } from "@/components/ui/sonner"
import DiarioEletronico from "@/pages/professor/DiarioEletronico"
import ListaPresenca from "@/pages/professor/ListaPresenca"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DiarioEletronico />} />
        <Route path="/professor/presenca" element={<ListaPresenca />} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  )
}