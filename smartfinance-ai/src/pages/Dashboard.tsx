import { useState, useEffect } from 'react'
import chicoImg from '../assets/Chico.png'
import type { ExpenseItem } from './ExpenseRegister'
import type { Bill } from './BillsAndInvoices'

interface DashboardProps {
  username?: string
  onLogout: () => void
  onNewExpense?: () => void
  onShoppingLists?: () => void
  onBillsAndInvoices?: () => void
  onProfile?: () => void
}

export function Dashboard({
  username = 'OliviaGaona',
  onLogout,
  onNewExpense,
  onShoppingLists,
  onBillsAndInvoices,
  onProfile,
}: DashboardProps) {
  const [favoriteAssets] = useState([
    { symbol: 'BTC/BRL', name: 'Bitcoin', price: 'R$ 385.420,00', change: '+2.4%' },
    { symbol: 'USD/BRL', name: 'Dólar Comercial', price: 'R$ 5,45', change: '-0.3%' },
    { symbol: 'PETR4', name: 'Petrobras PN', price: 'R$ 37,80', change: '+1.1%' },
  ])

  const [weeklyExpenseTotal, setWeeklyExpenseTotal] = useState(680.5)
  const [pendingBillsTotal, setPendingBillsTotal] = useState(210.0)
  const [topCategory, setTopCategory] = useState('Mercado')

  useEffect(() => {
    const savedExpenses: ExpenseItem[] = JSON.parse(localStorage.getItem('oncoin_expenses') || '[]')
    if (savedExpenses.length > 0) {
      const total = savedExpenses
        .filter((item) => item.type === 'comum')
        .reduce((sum, item) => sum + item.amount, 0)
      setWeeklyExpenseTotal(total > 0 ? total : 680.5)

      const categoriesCount: Record<string, number> = {}
      savedExpenses.forEach((item) => {
        categoriesCount[item.category] = (categoriesCount[item.category] || 0) + item.amount
      })
      const highestCategory = Object.keys(categoriesCount).reduce((a, b) =>
        categoriesCount[a] > categoriesCount[b] ? a : b
      , 'Mercado')
      setTopCategory(highestCategory)
    }

    const savedBills: Bill[] = JSON.parse(localStorage.getItem('oncoin_bills') || '[]')
    if (savedBills.length > 0) {
      const pendingTotal = savedBills
        .filter((bill) => bill.status === 'pending' || bill.status === 'overdue')
        .reduce((sum, bill) => sum + bill.amount, 0)
      setPendingBillsTotal(pendingTotal)
    }
  }, [])

  return (
    <div className="min-h-screen bg-chico-dark text-chico-cream pb-12">
      {/* Topo / Header da Aplicação */}
      <header className="bg-chico-dark/80 backdrop-blur-md border-b border-chico-gold/20 sticky top-0 z-10 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-chico-cream/10 border border-chico-gold p-1 flex items-center justify-center animate-gold-glow">
              <img src={chicoImg} alt="Chico" className="w-full h-full object-contain animate-chico-float" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-chico-gold leading-tight">
                ON<span className="text-chico-cream">coin</span>
              </h1>
              <p className="text-[10px] text-chico-sand">Painel Financeiro</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="text-xs text-chico-sand hover:text-chico-gold border border-chico-gold/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        
        {/* Banner de Boas-Vindas com o Chico */}
        <section className="bg-gradient-to-r from-chico-olive/30 via-chico-dark to-chico-brown/20 border border-chico-gold/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-chico-gold font-semibold">Resumo do Dia</span>
              <h2 className="text-2xl md:text-3xl font-bold text-chico-cream mt-1">
                Olá, <span className="text-chico-gold">{username}</span>! 🐆
              </h2>
              <p className="text-sm text-chico-sand mt-1">
                O Chico preparou seu balanço da semana. Vamos dar uma olhada?
              </p>
            </div>

            <div className="bg-chico-cream/10 border border-chico-gold/30 rounded-2xl p-4 flex items-center gap-4 min-w-[220px]">
              <div>
                <p className="text-xs text-chico-sand uppercase tracking-wider">Saldo Total</p>
                <p className="text-2xl font-bold text-chico-gold">R$ 4.250,80</p>
              </div>
            </div>
          </div>
        </section>

        {/* Grade do Resumo Semanal */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-chico-cream/5 border border-chico-gold/20 rounded-2xl p-5 hover:border-chico-gold/50 hover:bg-chico-cream/10 transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs text-chico-sand uppercase font-semibold">Gastos Cadastrados</span>
              <span className="text-xl">💸</span>
            </div>
            <p className="text-2xl font-bold text-chico-cream">R$ {weeklyExpenseTotal.toFixed(2)}</p>
            <div className="mt-3 pt-3 border-t border-chico-gold/10 text-xs text-chico-slate flex justify-between">
              <span>Maior categoria:</span>
              <span className="text-chico-sand font-medium">{topCategory}</span>
            </div>
          </div>

          <div className="bg-chico-cream/5 border border-chico-gold/20 rounded-2xl p-5 hover:border-chico-gold/50 hover:bg-chico-cream/10 transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs text-chico-sand uppercase font-semibold">A Pagar em Faturas</span>
              <span className="text-xl">⏳</span>
            </div>
            <p className="text-2xl font-bold text-chico-gold">R$ {pendingBillsTotal.toFixed(2)}</p>
            <div className="mt-3 pt-3 border-t border-chico-gold/10 text-xs text-chico-slate flex justify-between">
              <span>Status geral:</span>
              <span className="text-chico-sand font-medium">Sincronizado no navegador</span>
            </div>
          </div>

          <div className="bg-chico-cream/5 border border-chico-gold/20 rounded-2xl p-5 hover:border-chico-gold/50 hover:bg-chico-cream/10 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-chico-gold uppercase font-bold">Lembrete do Chico</span>
                <span className="text-xl animate-bounce">💡</span>
              </div>
              <p className="text-xs text-chico-cream leading-relaxed">
                "Seus dados estão salvos localmente com segurança! Continue monitorando suas metas."
              </p>
            </div>
            <div className="mt-3 w-full bg-chico-cream/10 h-2 rounded-full overflow-hidden">
              <div className="bg-chico-green h-full w-[70%]" />
            </div>
          </div>

        </section>

        {/* Widget de Cotação de Ações e Moedas */}
        <section className="bg-chico-cream/5 border border-chico-gold/20 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-chico-gold">Mercado & Cotações</h3>
              <p className="text-xs text-chico-sand">Seus 3 ativos acompanhados em tempo real</p>
            </div>
            <button className="text-xs text-chico-gold hover:underline cursor-pointer">
              Gerenciar ativos (3/3)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {favoriteAssets.map((asset, idx) => (
              <div
                key={idx}
                className="bg-chico-dark border border-chico-gold/20 rounded-2xl p-4 flex flex-col justify-between hover:border-chico-gold/60 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-chico-sand">{asset.symbol}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      asset.change.startsWith('+')
                        ? 'bg-chico-green/20 text-chico-green'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {asset.change}
                  </span>
                </div>
                <p className="text-xs text-chico-slate">{asset.name}</p>
                <p className="text-lg font-bold text-chico-cream mt-1">{asset.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ações Rápidas do App */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button 
            onClick={onNewExpense}
            className="bg-chico-gold/10 border border-chico-gold/30 hover:bg-chico-gold/20 hover:border-chico-gold text-chico-cream p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer group hover:-translate-y-1 shadow-lg"
          >
            <span className="text-2xl group-hover:scale-125 transition-transform duration-200">➕</span>
            <span className="text-xs font-bold text-chico-gold">Novo Gasto</span>
          </button>

          <button 
            onClick={onShoppingLists}
            className="bg-chico-gold/10 border border-chico-gold/30 hover:bg-chico-gold/20 hover:border-chico-gold text-chico-cream p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer group hover:-translate-y-1 shadow-lg"
          >
            <span className="text-2xl group-hover:scale-125 transition-transform duration-200">🛒</span>
            <span className="text-xs font-bold text-chico-gold">Listas de Compras</span>
          </button>

          <button 
            onClick={onBillsAndInvoices}
            className="bg-chico-gold/10 border border-chico-gold/30 hover:bg-chico-gold/20 hover:border-chico-gold text-chico-cream p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group hover:-translate-y-1 shadow-lg"
          >
            <span className="text-2xl group-hover:scale-125 transition-transform duration-200">📄</span>
            <span className="text-xs font-bold text-chico-gold">Contas & Faturas</span>
          </button>

          <button 
            onClick={onProfile}
            className="bg-chico-gold/10 border border-chico-gold/30 hover:bg-chico-gold/20 hover:border-chico-gold text-chico-cream p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group hover:-translate-y-1 shadow-lg"
          >
            <span className="text-2xl group-hover:scale-125 transition-transform duration-200">👤</span>
            <span className="text-xs font-bold text-chico-gold">Meu Perfil</span>
          </button>
        </section>

      </main>
    </div>
  )
}