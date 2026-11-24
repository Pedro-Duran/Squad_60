import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router'
import HubCoordenador from '@/pages/coordenador/HubCoordenador'
import EmentasValidacao from '@/pages/coordenador/EmentasValidacao'
import AnalisarEmenta from '@/pages/coordenador/AnalisarEmenta'
import { Toaster } from '@/components/ui/sonner'

function EmDesenvolvimento({ titulo, voltarPara = '/' }) {
  return <main className="min-h-screen bg-background p-8 text-foreground">
    <Link className="text-sm underline" to={voltarPara}>← Voltar ao início</Link>
    <h1 className="mt-6 text-2xl font-bold">{titulo}</h1>
    <p className="mt-3 text-muted-foreground">Esta tela será implementada em outra tarefa.</p>
  </main>
}

export default function App() {
  return <BrowserRouter>
    <Toaster position="top-center" richColors />
    <Routes>
      <Route path="/" element={<Navigate to="/coordenador" replace />} />
      <Route path="/coordenador" element={<HubCoordenador />} />
      <Route path="/coordenador/ementas/nova" element={<EmDesenvolvimento titulo="Criar Ementa Pedagógica" voltarPara="/coordenador" />} />
      <Route path="/coordenador/ementas" element={<EmDesenvolvimento titulo="Ementas Criadas" voltarPara="/coordenador" />} />
      <Route path="/coordenador/ementas/validacao" element={<EmentasValidacao />} />
      <Route path="/coordenador/ementas/validacao/:id" element={<AnalisarEmenta />} />
      <Route path="/coordenador/registros" element={<EmDesenvolvimento titulo="Registros" voltarPara="/coordenador" />} />
    </Routes>
  </BrowserRouter>
}
