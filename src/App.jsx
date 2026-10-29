import { BrowserRouter, Link, Route, Routes } from 'react-router'
import Reposicoes from '@/pages/professor/Reposicoes'

function Inicio() {
  return <main className="min-h-screen bg-background p-8 text-foreground">
    <h1 className="text-3xl font-bold">SQUAD 60</h1>
    <p className="mt-3 text-muted-foreground">Projeto do grupo</p>
    <Link className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-primary-foreground" to="/professor/reposicoes">Solicitar Aula Excepcional</Link>
  </main>
}
function EmDesenvolvimento({ titulo }) {
  return <main className="min-h-screen bg-background p-8 text-foreground">
    <Link className="text-sm underline" to="/professor/reposicoes">← Voltar às reposições</Link>
    <h1 className="mt-6 text-2xl font-bold">{titulo}</h1>
    <p className="mt-3 text-muted-foreground">Esta tela será implementada em outra tarefa.</p>
  </main>
}
export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Inicio />} />
    <Route path="/professor/reposicoes" element={<Reposicoes />} />
    <Route path="/professor/reposicoes/todas" element={<EmDesenvolvimento titulo="Todas as reposições" />} />
    <Route path="/professor/reposicoes/gerenciar" element={<EmDesenvolvimento titulo="Gerenciar reposições" />} />
  </Routes></BrowserRouter>
}
