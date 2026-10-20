import { useAuth } from "@/hooks/useAuth"

export default function EmConstrucao() {
  const { usuario, sair } = useAuth()

  return (
    <main className="p-6">
      <p>
        Tela inicial de {usuario?.nome} ({usuario?.perfil}) em construção.
      </p>
      <button type="button" onClick={sair}>
        Sair
      </button>
    </main>
  )
}