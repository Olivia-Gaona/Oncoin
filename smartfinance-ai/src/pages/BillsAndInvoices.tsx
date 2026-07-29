import { useState } from 'react'
import chicoImg from '../assets/Chico.png'

interface BillsAndInvoicesProps {
  onBack: () => void
}

interface Bill {
  id: string
  title: string
  amount: number
  dueDate: string
  category: 'Streaming' | 'Contas da Casa' | 'Estudos' | 'Carro' | 'Outros'
  status: 'pending' | 'paid' | 'overdue'
  receiptName?: string
}

export function BillsAndInvoices({ onBack }: BillsAndInvoicesProps) {
  const [bills, setBills] = useState<Bill[]>([
    {
      id: '1',
      title: 'Plano de Internet 500MB',
      amount: 119.90,
      dueDate: '2026-07-29',
      category: 'Contas da Casa',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Mensalidade Faculdade',
      amount: 450.00,
      dueDate: '2026-08-05',
      category: 'Estudos',
      status: 'pending',
    },
    {
      id: '3',
      title: 'Assinatura Netflix & Spotify',
      amount: 55.90,
      dueDate: '2026-07-15',
      category: 'Streaming',
      status: 'paid',
      receiptName: 'comprovante_july.pdf',
    },
    {
      id: '4',
      title: 'IPVA / Seguro Auto',
      amount: 280.00,
      dueDate: '2026-07-20',
      category: 'Carro',
      status: 'overdue',
    },
  ])

  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Campos do formulário de nova conta
  const [newTitle, setNewTitle] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newCategory, setNewCategory] = useState<Bill['category']>('Contas da Casa')

  // Marcar como pago e anexar comprovante
  const handleMarkAsPaid = (id: string) => {
    setBills(
      bills.map((bill) =>
        bill.id === id
          ? { ...bill, status: 'paid', receiptName: `comprovante_${Date.now().toString().slice(-4)}.pdf` }
          : bill
      )
    )
  }

  // Adicionar nova conta
  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newAmount || !newDueDate) return

    const newBill: Bill = {
      id: Date.now().toString(),
      title: newTitle,
      amount: parseFloat(newAmount),
      dueDate: newDueDate,
      category: newCategory,
      status: 'pending',
    }

    setBills([...bills, newBill])
    setShowAddModal(false)
    setNewTitle('')
    setNewAmount('')
    setNewDueDate('')
  }

  const filteredBills = bills.filter((b) => {
    if (filter === 'all') return true
    return b.status === filter
  })

  const categoryIcons = {
    Streaming: '🎬',
    'Contas da Casa': '🏠',
    Estudos: '📚',
    Carro: '🚗',
    Outros: '📄',
  }

  return (
    <div className="min-h-screen bg-chico-dark text-chico-cream p-4 pb-12">
      {/* Header */}
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
        
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-chico-gold">Contas & Faturas 📄</h2>
            <p className="text-xs text-chico-sand mt-0.5">
              Gerencie seus boletos, guarde comprovantes e evite juros com o Chico.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-chico-gold hover:bg-chico-brown text-chico-dark font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
          >
            + Adicionar Fatura
          </button>
        </div>

        {/* Filtros de Status */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'Todas as Contas' },
            { id: 'pending', label: '⏳ Pendentes' },
            { id: 'overdue', label: '🚨 Atrasadas' },
            { id: 'paid', label: '✅ Pagas' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as typeof filter)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filter === item.id
                  ? 'bg-chico-gold text-chico-dark font-bold'
                  : 'bg-chico-cream/5 border border-chico-gold/20 text-chico-sand hover:border-chico-gold/40'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Lista de Faturas */}
        <div className="space-y-3">
          {filteredBills.length === 0 ? (
            <div className="bg-chico-cream/5 border border-chico-gold/20 rounded-2xl p-8 text-center text-chico-slate text-xs">
              Nenhuma conta encontrada neste filtro.
            </div>
          ) : (
            filteredBills.map((bill) => (
              <div
                key={bill.id}
                className="bg-chico-cream/5 border border-chico-gold/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-chico-gold/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-chico-dark/60 border border-chico-gold/30 flex items-center justify-center text-xl">
                    {categoryIcons[bill.category]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-chico-cream">{bill.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-chico-cream/10 border border-chico-gold/20 px-2 py-0.5 rounded-md text-chico-sand">
                        {bill.category}
                      </span>
                      <span className="text-xs text-chico-slate">
                        Vencimento: <strong className="text-chico-sand">{bill.dueDate}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-chico-gold/10">
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-bold text-chico-gold">
                      R$ {bill.amount.toFixed(2)}
                    </p>

                    {/* Status Badge */}
                    {bill.status === 'paid' && (
                      <span className="text-[10px] font-bold text-chico-green bg-chico-green/20 px-2 py-0.5 rounded-md">
                        Pago
                      </span>
                    )}
                    {bill.status === 'pending' && (
                      <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/20 px-2 py-0.5 rounded-md">
                        Pendente
                      </span>
                    )}
                    {bill.status === 'overdue' && (
                      <span className="text-[10px] font-bold text-red-400 bg-red-400/20 px-2 py-0.5 rounded-md">
                        Atrasado
                      </span>
                    )}
                  </div>

                  {/* Ação */}
                  {bill.status !== 'paid' ? (
                    <button
                      onClick={() => handleMarkAsPaid(bill.id)}
                      className="px-3 py-2 bg-chico-green/20 border border-chico-green hover:bg-chico-green text-chico-cream hover:text-chico-dark text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Pagar & Anexar
                    </button>
                  ) : (
                    <div className="text-xs text-chico-sand flex items-center gap-1 border border-chico-gold/20 bg-chico-dark/60 px-2.5 py-1.5 rounded-xl">
                      <span>📎</span>
                      <span className="text-[10px] truncate max-w-[100px]">
                        {bill.receiptName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de Cadastrar Nova Fatura */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-chico-dark border border-chico-gold/40 rounded-2xl p-6 w-full max-w-md space-y-4">
              <h3 className="text-lg font-bold text-chico-gold">Cadastrar Fatura / Conta</h3>

              <form onSubmit={handleAddBill} className="space-y-4">
                <div>
                  <label className="block text-xs text-chico-sand mb-1">Título da Conta</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Conta de Luz"
                    className="w-full px-3 py-2 rounded-xl bg-chico-cream/5 border border-chico-gold/20 text-xs text-chico-cream focus:outline-none focus:border-chico-gold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-chico-sand mb-1">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="0,00"
                      className="w-full px-3 py-2 rounded-xl bg-chico-cream/5 border border-chico-gold/20 text-xs text-chico-cream focus:outline-none focus:border-chico-gold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-chico-sand mb-1">Vencimento</label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-chico-cream/5 border border-chico-gold/20 text-xs text-chico-cream focus:outline-none focus:border-chico-gold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-chico-sand mb-1">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Bill['category'])}
                    className="w-full px-3 py-2 rounded-xl bg-chico-dark border border-chico-gold/20 text-xs text-chico-cream focus:outline-none focus:border-chico-gold cursor-pointer"
                  >
                    <option value="Contas da Casa">🏠 Contas da Casa</option>
                    <option value="Streaming">🎬 Streaming</option>
                    <option value="Estudos">📚 Estudos</option>
                    <option value="Carro">🚗 Carro</option>
                    <option value="Outros">📄 Outros</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 text-xs border border-chico-gold/30 rounded-xl text-chico-sand hover:text-chico-cream cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs bg-chico-gold text-chico-dark font-bold rounded-xl hover:bg-chico-brown cursor-pointer"
                  >
                    Salvar Fatura
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}