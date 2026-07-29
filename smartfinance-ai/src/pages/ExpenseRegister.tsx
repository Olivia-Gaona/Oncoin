import { useState } from 'react'
import chicoImg from '../assets/Chico.png'

interface ExpenseRegisterProps {
  onBack: () => void
  onSave: () => void
}

export interface ExpenseItem {
  id: string
  type: 'comum' | 'meta' | 'desejo' | 'cofrinho' | 'limite'
  title: string
  amount: number
  category: string
  period?: 'semanal' | 'mensal'
  createdAt: string
}

export function ExpenseRegister({ onBack, onSave }: ExpenseRegisterProps) {
  const [expenseType, setExpenseType] = useState<ExpenseItem['type']>('comum')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Mercado')
  const [period, setPeriod] = useState<'semanal' | 'mensal'>('mensal')
  const [successMsg, setSuccessMsg] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !amount) return

    const newExpense: ExpenseItem = {
      id: Date.now().toString(),
      type: expenseType,
      title,
      amount: parseFloat(amount),
      category,
      period: (expenseType === 'limite' || expenseType === 'meta') ? period : undefined,
      createdAt: new Date().toISOString(),
    }

    // Carrega registros existentes, adiciona o novo e salva no localStorage
    const savedExpenses: ExpenseItem[] = JSON.parse(localStorage.getItem('oncoin_expenses') || '[]')
    const updatedExpenses = [newExpense, ...savedExpenses]
    localStorage.setItem('oncoin_expenses', JSON.stringify(updatedExpenses))

    setSuccessMsg(true)
    setTimeout(() => {
      setSuccessMsg(false)
      onSave()
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-chico-dark text-chico-cream p-4 pb-12">
      {/* Topo / Header */}
      <div className="max-w-2xl mx-auto flex items-center justify-between py-4 border-b border-chico-gold/20">
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

      <main className="max-w-2xl mx-auto mt-6">
        <div className="bg-chico-cream/5 border border-chico-gold/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-chico-gold">Cadastrar Registro 🐆</h2>
            <p className="text-xs text-chico-sand mt-1">
              Escolha o tipo de registro financeiro que deseja adicionar.
            </p>
          </div>

          {/* Seleção do Tipo de Registro */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
            {[
              { id: 'comum', label: 'Gasto', icon: '💸' },
              { id: 'meta', label: 'Meta', icon: '🎯' },
              { id: 'desejo', label: 'Desejo', icon: '✨' },
              { id: 'cofrinho', label: 'Cofrinho', icon: '🐷' },
              { id: 'limite', label: 'Limite', icon: '⚠️' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setExpenseType(item.id as ExpenseItem['type'])}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  expenseType === item.id
                    ? 'bg-chico-gold/20 border-chico-gold text-chico-cream font-bold shadow-md'
                    : 'bg-chico-dark/50 border-chico-gold/10 text-chico-slate hover:border-chico-gold/30'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Valor */}
            <div>
              <label className="block text-xs font-semibold text-chico-sand uppercase tracking-wider mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full px-4 py-3 text-2xl font-bold text-chico-gold rounded-xl bg-chico-cream/5 border border-chico-gold/20 focus:outline-none focus:border-chico-gold"
                required
              />
            </div>

            {/* Descrição / Título */}
            <div>
              <label className="block text-xs font-semibold text-chico-sand uppercase tracking-wider mb-1">
                {expenseType === 'desejo'
                  ? 'O que você quer comprar?'
                  : expenseType === 'cofrinho'
                  ? 'Nome do objetivo'
                  : 'Descrição do registro'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  expenseType === 'desejo'
                    ? 'Ex: Fone Bluetooth'
                    : expenseType === 'cofrinho'
                    ? 'Ex: Viagem de Fim de Ano'
                    : 'Ex: Almoço de Domingo'
                }
                className="w-full px-4 py-3 rounded-xl bg-chico-cream/5 border border-chico-gold/20 text-chico-cream focus:outline-none focus:border-chico-gold"
                required
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-xs font-semibold text-chico-sand uppercase tracking-wider mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-chico-dark border border-chico-gold/20 text-chico-cream focus:outline-none focus:border-chico-gold cursor-pointer"
              >
                <option value="Mercado">🛒 Mercado</option>
                <option value="Estudos">📚 Estudos</option>
                <option value="Streaming">🎬 Streaming & Lazer</option>
                <option value="Carro">🚗 Carro / Transporte</option>
                <option value="Contas">🏠 Contas da Casa</option>
                <option value="Saúde">💊 Farmácia & Saúde</option>
              </select>
            </div>

            {/* Configuração adicional para Limites/Metas */}
            {(expenseType === 'limite' || expenseType === 'meta') && (
              <div>
                <label className="block text-xs font-semibold text-chico-sand uppercase tracking-wider mb-1">
                  Período do Limite/Meta
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPeriod('semanal')}
                    className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      period === 'semanal'
                        ? 'bg-chico-gold text-chico-dark border-chico-gold'
                        : 'bg-chico-cream/5 text-chico-sand border-chico-gold/20'
                    }`}
                  >
                    Semanal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPeriod('mensal')}
                    className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      period === 'mensal'
                        ? 'bg-chico-gold text-chico-dark border-chico-gold'
                        : 'bg-chico-cream/5 text-chico-sand border-chico-gold/20'
                    }`}
                  >
                    Mensal
                  </button>
                </div>
              </div>
            )}

            {/* Alerta de confirmação */}
            {successMsg && (
              <div className="bg-chico-green/20 border border-chico-green text-chico-cream p-3 rounded-xl text-center text-xs font-bold">
                🐆 Chico registrou e salvou com sucesso!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-chico-gold hover:bg-chico-brown text-chico-dark font-bold rounded-xl transition-all shadow-md cursor-pointer mt-4"
            >
              Salvar Registro
            </button>
          </form>

        </div>
      </main>
    </div>
  )
}