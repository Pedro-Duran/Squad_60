import { Link } from "react-router"

export function AbasAlunos({ ativa = "pesquisar", alunoId }) {
  const abas = [
    { id: "pesquisar", label: "Pesquisar", path: "/dge/alunos", habilitada: true },
    {
      id: "ficha",
      label: "Ficha",
      path: alunoId ? `/dge/alunos/${alunoId}` : "#",
      habilitada: Boolean(alunoId),
    },
    {
      id: "editar",
      label: "Editar",
      path: alunoId ? `/dge/alunos/${alunoId}/editar` : "#",
      habilitada: Boolean(alunoId),
    },
    {
      id: "historico",
      label: "Histórico",
      path: alunoId ? `/dge/alunos/${alunoId}/historico` : "#",
      habilitada: Boolean(alunoId),
    },
    {
      id: "gerenciar",
      label: "Gerenciar",
      path: "/dge/alunos/gerenciar",
      habilitada: true,
    },
  ]

  return (
    <header className="bg-navy text-white">
      <div className="flex items-center px-4 pb-1 pt-4 text-xs font-semibold tracking-wider">
        <span>SEDUC · SERGIPE</span>
      </div>
      <nav
        aria-label="Navegação de alunos"
        className="flex gap-2 overflow-x-auto px-4 pb-3 pt-2 whitespace-nowrap"
      >
        {abas.map((aba) => {
          const classes =
            "inline-flex shrink-0 items-center rounded-full px-2 py-1.5 text-xs font-semibold transition-colors"

          if (!aba.habilitada) {
            return (
              <span
                key={aba.id}
                aria-disabled="true"
                className={`${classes} cursor-not-allowed bg-white/15 text-white/60`}
              >
                {aba.label}
              </span>
            )
          }

          if (aba.id === ativa) {
            return (
              <span key={aba.id} aria-current="page" className={`${classes} bg-primary text-white`}>
                {aba.label}
              </span>
            )
          }

          return (
            <Link
              key={aba.id}
              to={aba.path}
              className={`${classes} bg-white/15 text-white hover:bg-white/25`}
            >
              {aba.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
