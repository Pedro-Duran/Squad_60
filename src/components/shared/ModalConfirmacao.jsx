import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function ModalConfirmacao({
  open,
  aluno,
  onCancelar,
  onConfirmar,
  processando = false,
  erro,
}) {
  return (
    <Dialog open={open} onOpenChange={(estaAberto) => !estaAberto && onCancelar()}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/50"
        className="gap-0 rounded-2xl px-6 pb-5 pt-2 sm:max-w-[350px]"
      >
        <div aria-hidden="true" className="mx-auto mb-2 h-1 w-12 rounded-full bg-muted-foreground/70" />
        <AlertTriangle aria-hidden="true" className="mx-auto size-9 fill-destructive text-white" />
        <DialogTitle className="mt-2 text-center text-base font-bold uppercase">
          Remover aluno da turma?
        </DialogTitle>
        <DialogDescription className="mt-5 text-center text-sm font-semibold uppercase leading-6 text-muted-foreground">
          Tem certeza que deseja remover{" "}
          <span className="font-extrabold text-foreground">{aluno?.nome}</span> da turma?
        </DialogDescription>
        <p className="mt-5 text-center text-sm font-semibold uppercase leading-6 text-muted-foreground">
          Esta ação atualizará a lista imediatamente.
        </p>
        {erro && <p role="alert" className="mt-3 text-center text-sm text-destructive">{erro}</p>}
        <div className="mt-5 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            disabled={processando}
            onClick={onCancelar}
            className="px-2 font-semibold text-destructive hover:bg-transparent hover:text-destructive"
          >
            CANCELAR
          </Button>
          <Button
            type="button"
            disabled={processando}
            onClick={onConfirmar}
            className="rounded-full bg-destructive px-4 font-semibold text-white hover:bg-destructive/90"
          >
            {processando ? "REMOVENDO…" : "CONFIRMAR REMOÇÃO"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
