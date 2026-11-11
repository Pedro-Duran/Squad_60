import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  Home,
  MoreVertical,
  Plus,
  Trash2,
} from 'lucide-react'

const STORAGE_KEY = 'squad60:modalidades'

const regionalData = {
  regional: 'Regional de Sergipe',
  modalities: [
    { name: 'Educação Infantil', abbreviation: 'EI' },
    { name: 'Ensino Fundamental', abbreviation: 'EF' },
    { name: 'Ensino Médio', abbreviation: 'EM' },
    { name: 'Educação de Jovens e Adultos', abbreviation: 'EJA' },
    { name: 'Educação Especial', abbreviation: 'EE' },
  ],
}

const years = ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano']
const shifts = [
  { name: 'Manhã', abbreviation: 'M' },
  { name: 'Tarde', abbreviation: 'T' },
  { name: 'Integral', abbreviation: 'I' },
  { name: 'Noite', abbreviation: 'N' },
]

function readRegistrations() {
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) return []

  const registrations = JSON.parse(saved)
  if (
    !Array.isArray(registrations) ||
    registrations.some(
      (item) =>
        !item ||
        typeof item.id !== 'string' ||
        typeof item.code !== 'string' ||
        typeof item.modality !== 'string' ||
        typeof item.year !== 'string' ||
        typeof item.shift !== 'string',
    )
  ) {
    throw new Error('Os dados salvos das modalidades estão inválidos.')
  }

  return registrations
}

function loadInitialRegistrations() {
  try {
    return { registrations: readRegistrations(), error: '' }
  } catch {
    return {
      registrations: [],
      error: 'Não foi possível carregar as modalidades salvas neste dispositivo.',
    }
  }
}

function App() {
  const [initialData] = useState(loadInitialRegistrations)
  const [registrations, setRegistrations] = useState(initialData.registrations)
  const [page, setPage] = useState('list')
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [modalities, setModalities] = useState([])
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedModality, setSelectedModality] = useState('')
  const [selectedShift, setSelectedShift] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState(initialData.error)
  const [openMenuId, setOpenMenuId] = useState('')

  useEffect(() => {
    if (page !== 'form') return undefined

    const timer = window.setTimeout(() => {
      setModalities(regionalData.modalities)
      setOptionsLoading(false)
    }, 250)

    return () => window.clearTimeout(timer)
  }, [page])

  const resetSelection = () => {
    setSelectedYear('')
    setSelectedModality('')
    setSelectedShift('')
  }

  const openForm = () => {
    setNotice('')
    setError('')
    setPage('form')
  }

  const returnToList = () => {
    resetSelection()
    setNotice('')
    setError('')
    setPage('list')
  }

  const selectedModalityData = modalities.find(
    (modality) => modality.name === selectedModality,
  )
  const selectedShiftData = shifts.find((shift) => shift.name === selectedShift)
  const yearNumber = selectedYear.match(/^\d+/)?.[0]
  const reviewCode =
    selectedModalityData && yearNumber && selectedShiftData
      ? `${selectedModalityData.abbreviation} - ${yearNumber}A - ${selectedShiftData.abbreviation}`
      : '—'

  const registerModality = (event) => {
    event.preventDefault()
    if (!selectedYear || !selectedModalityData || !selectedShiftData) return

    const registration = {
      id: `${Date.now()}`,
      code: reviewCode,
      modality: selectedModalityData.name,
      year: selectedYear,
      shift: selectedShiftData.name,
    }
    const updatedRegistrations = [...registrations, registration]

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRegistrations))
    } catch {
      setError('Não foi possível salvar a modalidade neste dispositivo. Tente novamente.')
      return
    }

    setRegistrations(updatedRegistrations)
    resetSelection()
    setError('')
    setNotice('Modalidade cadastrada com sucesso.')
    setPage('list')
  }

  const removeRegistration = (registrationId) => {
    const updatedRegistrations = registrations.filter(
      (registration) => registration.id !== registrationId,
    )

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRegistrations))
    } catch {
      setError('Não foi possível remover a modalidade salva. Tente novamente.')
      setOpenMenuId('')
      return
    }

    setRegistrations(updatedRegistrations)
    setOpenMenuId('')
    setError('')
    setNotice('Modalidade removida.')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-toolbar">
          <button
            aria-label={page === 'form' ? 'Voltar para modalidades' : 'Voltar'}
            className="back-button"
            onClick={page === 'form' ? returnToList : () => window.history.back()}
            type="button"
          >
            <ArrowLeft aria-hidden="true" size={21} />
          </button>
          <span className="brand">SEDUC · SERGIPE</span>
          <span className="header-spacer" aria-hidden="true" />
        </div>
        <h1>Cadastro de Modalidade</h1>
      </header>

      <main className="main-content">
        {error && (
          <p className="feedback feedback-error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="feedback feedback-success" role="status">
            {notice}
          </p>
        )}

        {page === 'form' ? (
          <form className="form-content" onSubmit={registerModality}>
            {optionsLoading ? (
              <LoadingCard />
            ) : (
              <>
                <SelectionCard
                  title="Selecionar Ano"
                  description="Escolha o ano da turma."
                  options={years}
                  selected={selectedYear}
                  onSelect={setSelectedYear}
                />
                <SelectionCard
                  title="Selecione a Modalidade"
                  description="Escolha uma única modalidade de ensino para vincular ao registro atual."
                  options={modalities.map((modality) => modality.name)}
                  selected={selectedModality}
                  onSelect={setSelectedModality}
                />
                <SelectionCard
                  title="Selecionar Turno"
                  description="Escolha o turno da turma."
                  options={shifts.map((shift) => shift.name)}
                  selected={selectedShift}
                  onSelect={setSelectedShift}
                />

                <section aria-labelledby="review-title" className="review-card">
                  <h2 id="review-title" className="review-heading">
                    REVISÃO DA MODALIDADE
                  </h2>
                  <div className="review-row">
                    <span className="class-avatar">{yearNumber ? `${yearNumber}A` : '—'}</span>
                    <div className="review-copy">
                      <strong>{reviewCode}</strong>
                      <span>
                        {selectedModality && selectedYear && selectedShift
                          ? `${selectedModality} · ${selectedYear} · ${selectedShift}`
                          : 'Selecione ano, modalidade e turno'}
                      </span>
                    </div>
                    <button
                      aria-label="Limpar seleções"
                      className="icon-button"
                      onClick={resetSelection}
                      type="button"
                    >
                      <MoreVertical aria-hidden="true" size={20} />
                    </button>
                  </div>
                  <button
                    className="primary-button"
                    disabled={!selectedYear || !selectedModality || !selectedShift}
                    type="submit"
                  >
                    Cadastrar modalidade
                  </button>
                  <button className="secondary-button" onClick={returnToList} type="button">
                    Cancelar
                  </button>
                </section>
              </>
            )}
          </form>
        ) : (
          <section aria-label="Modalidades cadastradas" className="list-content">
            {registrations.length === 0 ? (
              <div className="empty-card">
                <span className="empty-icon">
                  <BookOpen aria-hidden="true" size={23} />
                </span>
                <h2>Sem modalidades disponíveis</h2>
                <p>Nenhuma modalidade de ensino cadastrada ou liberada para sua regional.</p>
                <button className="primary-button empty-action" onClick={openForm} type="button">
                  <Plus aria-hidden="true" size={18} />
                  Cadastrar modalidade
                </button>
              </div>
            ) : (
              <>
                <div className="list-heading">
                  <div>
                    <h2>Modalidades cadastradas</h2>
                    <p>{registrations.length} registro(s) nesta regional</p>
                  </div>
                  <button
                    aria-label="Cadastrar nova modalidade"
                    className="add-button"
                    onClick={openForm}
                    type="button"
                  >
                    <Plus aria-hidden="true" size={21} />
                  </button>
                </div>
                {registrations.map((registration) => (
                  <article className="registration-card" key={registration.id}>
                    <span className="class-avatar">{registration.code.split(' - ')[1]}</span>
                    <div className="review-copy">
                      <strong>{registration.code}</strong>
                      <span>
                        {registration.modality} · {registration.year} · {registration.shift}
                      </span>
                    </div>
                    <div className="menu-wrap">
                      <button
                        aria-expanded={openMenuId === registration.id}
                        aria-label={`Ações para ${registration.code}`}
                        className="icon-button"
                        onClick={() =>
                          setOpenMenuId(openMenuId === registration.id ? '' : registration.id)
                        }
                        type="button"
                      >
                        <MoreVertical aria-hidden="true" size={20} />
                      </button>
                      {openMenuId === registration.id && (
                        <button
                          className="menu-action"
                          onClick={() => removeRegistration(registration.id)}
                          type="button"
                        >
                          <Trash2 aria-hidden="true" size={15} />
                          Remover modalidade
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </>
            )}
          </section>
        )}
      </main>

      <nav aria-label="Navegação principal" className="bottom-navigation">
        <span className="nav-item">
          <Home aria-hidden="true" size={20} />
          Início
        </span>
        <span className="nav-item">
          <CalendarDays aria-hidden="true" size={20} />
          Solicitações
        </span>
        <button
          aria-current="page"
          className="nav-item nav-item-active"
          onClick={returnToList}
          type="button"
        >
          <BookOpen aria-hidden="true" size={20} />
          Registros
        </button>
      </nav>
      <footer className="app-footer">©2026 Desenvolvido por SQUAD 60</footer>
    </div>
  )
}

function SelectionCard({ title, description, options, selected, onSelect }) {
  return (
    <section className="selection-card">
      <div className="selection-copy">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div aria-label={title} className="option-list" role="group">
        {options.map((option) => (
          <button
            aria-pressed={selected === option}
            className={`option-button${selected === option ? ' option-selected' : ''}`}
            key={option}
            onClick={() => onSelect(option)}
            type="button"
          >
            <span>{option}</span>
            {selected === option && <Check aria-hidden="true" size={17} strokeWidth={2.5} />}
          </button>
        ))}
      </div>
    </section>
  )
}

function LoadingCard() {
  return (
    <section aria-label="Carregando modalidades" aria-busy="true" className="selection-card">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-description" />
      <div className="skeleton-options">
        {Array.from({ length: 5 }, (_, index) => (
          <div className="skeleton skeleton-option" key={index} />
        ))}
      </div>
      <div className="skeleton skeleton-button" />
    </section>
  )
}

export default App
