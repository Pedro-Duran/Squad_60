import { useAuth } from "@/hooks/useAuth"

export default function EmConstrucao({ titulo }) {
  const { usuario, sair } = useAuth()

  return (
    <main className="p-6">
      <p>
        {titulo
          ? `Tela de ${titulo} em construção.`
          : `Tela inicial de ${usuario?.nome} (${usuario?.perfil}) em construção.`}
      </p>
      <button type="button" onClick={sair}>
        Sair
      </button>
    </main>
  )
}