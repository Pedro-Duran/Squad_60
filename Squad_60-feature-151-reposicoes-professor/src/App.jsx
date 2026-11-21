import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router'
import Reposicoes from '@/pages/professor/Reposicoes'
import AulaExcepcional from '@/pages/professor/AulaExcepcional'
import SolicitacoesAulas from '@/pages/professor/SolicitacoesAulas'

function EmDesenvolvimento({ titulo }) {
  return <main className="min-h-screen bg-background p-8 text-foreground">
    <Link className="text-sm underline" to="/">← Voltar ao início</Link>
    <h1 className="mt-6 text-2xl font-bold">{titulo}</h1>
    <p className="mt-3 text-muted-foreground">Esta tela será implementada em outra tarefa.</p>
  </main>
}

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Reposicoes />} />
    <Route path="/professor/aula-excepcional" element={<AulaExcepcional />} />
    <Route path="/professor/solicitacoes" element={<SolicitacoesAulas />} />
    <Route path="/professor/reposicoes" element={<Navigate to="/" replace />} />
    <Route path="/professor/reposicoes/todas" element={<EmDesenvolvimento titulo="Todas as reposições" />} />
    <Route path="/professor/reposicoes/gerenciar" element={<EmDesenvolvimento titulo="Gerenciar reposições" />} />
  </Routes></BrowserRouter>
}
