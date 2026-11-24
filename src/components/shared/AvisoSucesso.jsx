import { CircleCheck } from "lucide-react"

export default function AvisoSucesso({ children }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-2xl border border-success-border bg-success px-4 py-4 text-success-foreground shadow-sm sm:px-5"
    >
      <CircleCheck aria-hidden="true" className="size-7 shrink-0" strokeWidth={2.8} />
      <p className="text-base font-bold leading-snug sm:text-lg">{children}</p>
    </div>
  )
}
