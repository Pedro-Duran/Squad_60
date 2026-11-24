import { BookOpen, ChevronRight, Layers } from "lucide-react"
import { useNavigate } from "react-router"
import { BottomNav } from "@/components/BottomNav"

export function MenuModalidadeDisciplinas() {
  const navigate = useNavigate()

  return (
    <div className="curriculum-page">
      <header className="curriculum-header">
        <div className="curriculum-header-copy">
          <p className="curriculum-brand">SEDUC · SERGIPE</p>
          <h1>Modalidade e Disciplinas</h1>
        </div>
      </header>

      <main className="curriculum-main">
        <p className="curriculum-kicker">SELECIONE UMA OPÇÃO</p>
        <p className="curriculum-support">
          Escolha o que deseja consultar ou editar na estrutura curricular.
        </p>

        <div className="curriculum-option-list">
          <button
            type="button"
            className="curriculum-option-card"
            onClick={() => navigate("/aulas-integrais")}
          >
            <span className="curriculum-option-icon">
              <Layers size={22} />
            </span>
            <span className="curriculum-option-text">
              <span className="curriculum-option-title">Modalidade</span>
              <span className="curriculum-option-subtitle">
                Ensino Fundamental, Médio, Integral e outras modalidades
              </span>
            </span>
            <ChevronRight className="curriculum-option-chevron" size={20} />
          </button>

          <button
            type="button"
            className="curriculum-option-card"
            onClick={() => navigate("/disciplinas")}
          >
            <span className="curriculum-option-icon">
              <BookOpen size={22} />
            </span>
            <span className="curriculum-option-text">
              <span className="curriculum-option-title">Disciplinas</span>
              <span className="curriculum-option-subtitle">
                Disciplinas, carga horária e obrigatoriedade por série
              </span>
            </span>
            <ChevronRight className="curriculum-option-chevron" size={20} />
          </button>
        </div>
      </main>

      <footer className="curriculum-footer-seal">©2026 Desenvolvido por SQUAD 60</footer>
      <BottomNav ativo="inicio" />
    </div>
  )
}
