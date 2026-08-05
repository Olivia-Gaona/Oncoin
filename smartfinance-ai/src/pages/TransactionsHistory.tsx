import { useState, useEffect } from 'react'
import chicoImg from '../assets/Chico.png'
import type { ExpenseItem } from './ExpenseRegister'

interface TransactionsHistoryProps {
  onBack: () => void
}

export function TransactionsHistory({ onBack }: TransactionsHistoryProps) {
  const [transactions, setTransactions] = useState<ExpenseItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent')

  useEffect(() => {
    const saved: ExpenseItem[] = JSON.parse(localStorage.getItem('oncoin_expenses') || '[]')
    
    // Dados padrão caso o usuário ainda não tenha muitos lançamentos
    const defaults: ExpenseItem[] = [
      { id: '1', type: 'comum', title: 'Conta de Luz', amount: 250.0, category: 'Contas', createdAt: new Date(Date.now() - 86400000 * 1).toISOString() },
      { id: '2', type: 'comum', title: 'Assinatura Lazer', amount: 39.9, category: 'Streaming', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: '3', type: 'cofrinho', title: 'Reserva para Viagem', amount: 500.0, category: 'Estudos', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: '4', type: 'meta', title: 'Meta de Economia Mensal', amount: 1000.0, category: 'Contas', period: 'mensal', createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
    ]

    setTransactions(saved.length > 0 ? saved : defaults)
  }, [])

  // Função para deletar uma transação
  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id)
    setTransactions(updated)
    localStorage.setItem('oncoin_expenses', JSON.stringify(updated))
  }

  // Filtragem e Busca
  const filteredTransactions = transactions
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === 'all' || item.type === selectedType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      if (sortBy === 'highest') return b.amount - a.amount
      if (sortBy === 'lowest') return a.amount - b.amount
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const typeLabels: Record<string, { label: string; icon: string }> = {
    comum: { label: 'Gasto', icon: '💸' },
    meta: { label: 'Meta', icon: '🎯' },
    desejo: { label: 'Desejo', icon: '✨' },
    cofrinho: { label: 'Cofrinho', icon: '🐷' },
    limite: { label: 'Limite', icon: '⚠️' },
  }

  const totalFilteredSum = filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="min-h-screen bg-chico-dark text-chico-cream p-4 pb-12">
      {/* Topo / Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between py-4 border-b border-chico-gold/20">
        <button
          onClick={onBack}
          className="text-xs text-chico-sand hover:text-chico-gold border border-chico-gold/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          ← Voltar ao Dashboard
        </button>
        <div className="flex items-center gap-2">
          <img src={chicoImg} alt="Chico" className="w-8 h-8 object-contain" />
          <span className="text-sm font-bold text-chico-gold">ONcoin</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto mt-6 space-y-6">
        
        {/* Título e Resumo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-chico-gold flex items-center gap-2">
              <span>📜</span> Extrato & Histórico Financeiro
            </h2>
            <p className="text-xs text-chico-sand mt-0.5">
              Pesquise, filtre e consulte todos os seus lançamentos salvos pelo Chico.
            </p>
          </div>

          <div className="bg-chico-cream/10 border border-chico-gold/30 px-4 py-2 rounded-2xl flex items-center gap-2">
            <span className="text-xs text-chico-sand uppercase tracking-wider">Total Filtrado:</span>
            <span className="text-lg font-bold text-chico-gold">R$ {totalFilteredSum.toFixed(2)}</span>
          </div>
        </div>

        {/* Barra de Pesquisa e Filtros */}
        <div className="bg-chico-cream/5 border border-chico-gold/20 rounded-2xl p-4 space-y-4">
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Campo de Busca por Palavra-chave */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Buscar por título ou categoria (ex: Luz, Mercado)..."
                className="w-full px-4 py-2.5 rounded-xl bg-chico-dark/80 border border-chico-gold/20 text-xs text-chico-cream focus:outline-none focus:border-chico-gold"
              />
            </div>

            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2.5 rounded-xl bg-chico-dark/80 border border-chico-gold/20 text-xs text-chico-cream focus:outline-none focus:border-chico-gold cursor-pointer"
            >
              <option value="recent">📅 Mais Recentes</option>
              <option value="highest">💰 Maior Valor</option>
              <option value="lowest">📉 Menor Valor</option>
            </select>
          </div>

          {/* Botões de Filtro por Tipo */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'Todos os Lançamentos' },
              { id: 'comum', label: '💸 Gastos' },
              { id: 'meta', label: '🎯 Metas' },
              { id: 'cofrinho', label: '🐷 Cofrinhos' },
              { id: 'desejo', label: '✨ Desejos' },
              { id: 'limite', label: '⚠️ Limites' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedType(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === f.id
                    ? 'bg-chico-gold text-chico-dark font-bold'
                    : 'bg-chico-dark/60 border border-chico-gold/20 text-chico-sand hover:border-chico-gold/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Transações */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="bg-chico-cream/5 border border-chico-gold/20 rounded-2xl p-8 text-center text-chico-slate text-xs space-y-2">
              <span className="text-2xl block">🔍</span>
              <p>Nenhum lançamento encontrado para esta busca ou filtro.</p>
            </div>
          ) : (
            filteredTransactions.map((item) => (
              <div
                key={item.id}
                className="bg-chico-cream/5 border border-chico-gold/20 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-chico-gold/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-chico-dark/80 border border-chico-gold/20 flex items-center justify-center text-lg">
                    {typeLabels[item.type]?.icon || '💸'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-chico-cream">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] bg-chico-cream/10 border border-chico-gold/20 px-2 py-0.5 rounded-md text-chico-sand font-medium">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-chico-slate">
                        {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-bold text-chico-gold block">
                      R$ {item.amount.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-chico-sand capitalize">
                      {typeLabels[item.type]?.label || item.type}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteTransaction(item.id)}
                    className="text-xs text-red-400 opacity-60 hover:opacity-100 hover:bg-red-400/20 p-2 rounded-lg transition-all cursor-pointer"
                    title="Excluir lançamento"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  )
}