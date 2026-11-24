import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ModalAdicionarAluno({
  open,
  termo,
  candidatos,
  carregando,
  onBuscar,
  onAdicionar,
  processandoId,
  erro,
  onFechar,
}) {
  return (
    <Dialog open={open} onOpenChange={(estaAberto) => !estaAberto && onFechar()}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50"
        className="flex max-h-[min(80dvh,560px)] flex-col gap-0 rounded-2xl px-5 pb-5 pt-2 sm:max-w-[350px]"
      >
        <div aria-hidden="true" className="mx-auto mb-5 h-1 w-12 shrink-0 rounded-full bg-foreground" />
        <DialogTitle className="mb-5 text-center text-base font-bold uppercase">
          Adicionar novo aluno
        </DialogTitle>
        <div className="relative mb-4 shrink-0">
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground"
          />
          <Input
            value={termo}
            onChange={(event) => onBuscar(event.target.value)}
            placeholder="Buscar por nome ou matrícula..."
            aria-label="Buscar por nome ou matrícula"
            className="h-12 rounded-xl border-transparent bg-muted pl-11 text-sm shadow-sm"
          />
        </div>
        {erro && <p role="alert" className="mb-3 text-sm text-destructive">{erro}</p>}
        <div aria-live="polite" className="min-h-0 flex-1 space-y-2 overflow-y-auto">
          {carregando ? (
            <p role="status" className="py-3 text-center text-sm text-muted-foreground">
              Carregando alunos…
            </p>
          ) : candidatos.length === 0 ? (
            <p className="py-3 text-center text-sm text-muted-foreground">
              Nenhum aluno disponível.
            </p>
          ) : (
            candidatos.map((aluno) => (
              <article
                key={aluno.id}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">{aluno.nome}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Matrícula: {aluno.matricula}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  aria-label={`Adicionar ${aluno.nome}`}
                  disabled={Boolean(processandoId)}
                  onClick={() => onAdicionar(aluno)}
                  className="size-10 shrink-0 p-0 text-navy hover:bg-muted"
                >
                  <Plus aria-hidden="true" className="size-7" strokeWidth={3} />
                </Button>
              </article>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
