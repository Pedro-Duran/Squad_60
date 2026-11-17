import { Link } from "react-router"
import { useAuth } from "@/hooks/useAuth"
import { ROTA_INICIAL } from "@/lib/rotas"

export default function EmConstrucao({ titulo }) {
  const { usuario, sair } = useAuth()
  const rotaInicio = ROTA_INICIAL[usuario?.perfil] ?? "/login"

  return (
    <main className="flex flex-col items-start gap-3 p-6">
      <p>
        {titulo
          ? `Tela de ${titulo} em construção.`
          : `Tela inicial de ${usuario?.nome} (${usuario?.perfil}) em construção.`}
      </p>
      {titulo && (
        <Link className="underline" to={rotaInicio}>
          Voltar ao início
        </Link>
      )}
      <button type="button" onClick={sair}>
        Sair
      </button>
    </main>
  )
}
