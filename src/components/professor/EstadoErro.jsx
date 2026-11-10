// Versão mínima do estado de erro (a tarefa da tela de erro substitui depois).
export default function EstadoErro({
  mensagem = "Não foi possível carregar as aulas.",
  aoTentar,
}) {
  return (
    <div className="estado-erro">
      <p className="estado-erro__msg">{mensagem}</p>
      {aoTentar && (
        <button type="button" className="estado-erro__botao" onClick={aoTentar}>
          Tentar novamente
        </button>
      )}
    </div>
  )
}
