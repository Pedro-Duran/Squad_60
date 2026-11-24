import coordenadores from '@/mocks/coordenadores.json'
import ementasBase from '@/mocks/ementas.json'
import { simularRequisicao } from '@/services/mockUtils'
import { ordenarPorEnvioDesc } from '@/lib/ementas'

// Simula a persistência da API: as decisões ficam salvas no navegador (e em memória, caso o storage falhe).
const CHAVE_ALTERACOES = 'ementasDecisoes'

function lerAlteracoes() {
  try { return JSON.parse(localStorage.getItem(CHAVE_ALTERACOES) || '{}') } catch { return {} }
}
function salvarAlteracoes(alteracoes) {
  try { localStorage.setItem(CHAVE_ALTERACOES, JSON.stringify(alteracoes)) } catch { /* mantém só em memória */ }
}

let alteracoes = lerAlteracoes()

function todasAsEmentas() {
  return ementasBase.map((e) => ({ ...e, ...(alteracoes[e.id] ?? {}) }))
}

export function buscarCoordenadorLogado(coordenadorId) {
  return simularRequisicao(() => {
    const coordenador = coordenadores.find((c) => c.id === coordenadorId)
    if (!coordenador) throw new Error('Usuário não encontrado')
    return coordenador
  })
}

export function listarEmentasParaValidacao() {
  return simularRequisicao(() => ordenarPorEnvioDesc(todasAsEmentas()))
}

export function buscarEmenta(id) {
  return simularRequisicao(() => {
    const ementa = todasAsEmentas().find((e) => e.id === id)
    if (!ementa) throw new Error('Ementa não encontrada')
    return ementa
  })
}

function decidir(id, status, extra, { forcarErro = false } = {}) {
  return simularRequisicao(() => {
    if (forcarErro) throw new Error('Falha simulada ao salvar a decisão')
    const ementa = todasAsEmentas().find((e) => e.id === id)
    if (!ementa) throw new Error('Ementa não encontrada')
    if (ementa.status !== 'pendente') throw new Error('Somente ementas pendentes podem ser analisadas')
    alteracoes = { ...alteracoes, [id]: { status, ...extra } }
    salvarAlteracoes(alteracoes)
    return { ...ementa, status, ...extra }
  })
}

export const validarEmenta = (id, opcoes) => decidir(id, 'deferida', {}, opcoes)
export const recusarEmenta = (id, justificativa, opcoes) => decidir(id, 'indeferida', { justificativa }, opcoes)
