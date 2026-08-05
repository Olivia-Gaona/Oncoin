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
  onHistory?: () => void
}

interface CategoryBreakdown {
  category: string
  total: number
  percentage: number
  icon: string
  color: string
}

export function Dashboard({
  username = 'OliviaGaona',
  onLogout,
  onNewExpense,
  onShoppingLists,
  onBillsAndInvoices,
  onProfile,
  onHistory,
}: DashboardProps) {
  const [favoriteAssets] = useState([
    { symbol: 'BTC/BRL', name: 'Bitcoin', price: 'R$ 385.420,00', change: '+2.4%' },
    { symbol: 'USD/BRL', name: 'Dólar Comercial', price: 'R$ 5,45', change: '-0.3%' },
    { symbol: 'PETR4', name: 'Petrobras PN', price: 'R$ 37,80', change: '+1.1%' },
  ])

  const [weeklyExpenseTotal, setWeeklyExpenseTotal] = useState(289.9)
  const [pendingBillsTotal, setPendingBillsTotal] = useState(210.0)
  const [topCategory, setTopCategory] = useState('Contas')
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([])

  const categoryPalette: Record<string, { icon: string; color: string }> = {
    Mercado: { icon: '🛒', color: '#bd9f4a' },
    Estudos: { icon: '📚', color: '#a0ad68' },
    Streaming: { icon: '🎬', color: '#d4bda9' },
    Carro: { icon: '🚗', color: '#7e6236' },
    Contas: { icon: '🏠', color: '#e7e0c7' },
    Saúde: { icon: '💊', color: '#958164' },
    Outros: { icon: '💸', color: '#918d85' },
  }

  const weeklyHistory = [
    { day: 'Seg', amount: 45.0 },
    { day: 'Ter', amount: 120.0 },
    { day: 'Qua', amount: 30.0 },
    { day: 'Qui', amount: 85.0 },
    { day: 'Sex', amount: 15.0 },
    { day: 'Sáb', amount: 90.0 },
    { day: 'Dom', amount: 68.5 },
  ]
  const maxWeeklyAmount = Math.max(...weeklyHistory.map((h) => h.amount), 1)

  useEffect(() => {
    const savedExpenses: ExpenseItem[] = JSON.parse(localStorage.getItem('oncoin_expenses') || '[]')
    
    const defaultExpenses: ExpenseItem[] = [
      { id: '1', type: 'comum', title: 'Conta de Luz', amount: 250.0, category: 'Contas', createdAt: new Date().toISOString() },
      { id: '2', type: 'comum', title: 'Assinatura', amount: 39.9, category: 'Streaming', createdAt: new Date().toISOString() },
    ]

    const listToAnalyze = savedExpenses.length > 0 ? savedExpenses : defaultExpenses

    const totalExpenses = listToAnalyze
      .filter((item) => item.type === 'comum')
      .reduce((sum, item) => sum + item.amount, 0)

    setWeeklyExpenseTotal(totalExpenses)

    const categoriesMap: Record<string, number> = {}
    listToAnalyze
      .filter((item) => item.type === 'comum')
      .forEach((item) => {
        categoriesMap[item.category] = (categoriesMap[item.category] || 0) + item.amount
      })

    const highestCategory = Object.keys(categoriesMap).reduce(
      (a, b) => (categoriesMap[a] > categoriesMap[b] ? a : b),
      'Contas'
    )
    setTopCategory(highestCategory)

    const breakdown: CategoryBreakdown[] = Object.keys(categoriesMap).map((cat) => ({
      category: cat,
      total: categoriesMap[cat],
      percentage: totalExpenses > 0 ? Math.round((categoriesMap[cat] / totalExpenses) * 100) : 0,
      icon: categoryPalette[cat]?.icon || '💸',
      color: categoryPalette[cat]?.color || '#bd9f4a',
    })).sort((a, b) => b.total - a.total)

    setCategoryBreakdown(breakdown)

    const savedBills: Bill[] = JSON.parse(localStorage.getItem('oncoin_bills') || '[]')
    if (savedBills.length > 0) {
      const pendingTotal = savedBills
        .filter((bill) => bill.status === 'pending' || bill.status === 'overdue')
        .reduce((sum, bill) => sum + bill.amount, 0)
      setPendingBillsTotal(pendingTotal)
    }
  }, [])

  let accumulatedAngle = 0

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

          <div className="flex items-center gap-2">
            <button
              onClick={onHistory}
              className="text-xs text-chico-gold bg-chico-gold/10 hover:bg-chico-gold/20 border border-chico-gold/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-semibold"
            >
              📜 Extrato
            </button>
            <button
              onClick={onLogout}
              className="text-xs text-chico-sand hover:text-chico-gold border border-chico-gold/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Sair
            </button>
          </div>
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

        {/* SEÇÃO DE GRÁFICOS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-chico-cream/5 border border-chico-gold/20 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-chico-gold flex items-center gap-2">
                  <span>🍕</span> Gráfico de Pizza por Categoria
                </h3>
                <p className="text-xs text-chico-sand">Distribuição proporcional dos seus gastos</p>
              </div>
              <span className="text-xs font-bold text-chico-gold bg-chico-gold/10 border border-chico-gold/20 px-2.5 py-1 rounded-full">
                R$ {weeklyExpenseTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {categoryBreakdown.map((item, index) => {
                    const strokeDasharray = `${item.percentage} ${100 - item.percentage}`
                    const strokeDashoffset = -accumulatedAngle
                    accumulatedAngle += item.percentage
                    return (
                      <circle
                        key={index}
                        cx="18"
                        cy="18"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth="3.8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-700 hover:opacity-80"
                      />
                    )
                  })}
                </svg>
                <div className="absolute text-center">
                  <span className="block text-[10px] text-chico-sand uppercase tracking-wider">Total</span>
                  <span className="text-sm font-bold text-chico-gold">100%</span>
                </div>
              </div>

              <div className="space-y-2 w-full sm:w-auto">
                {categoryBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-chico-cream font-medium">
                        {item.icon} {item.category}
                      </span>
                    </div>
                    <span className="font-bold text-chico-gold">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-chico-cream/5 border border-chico-gold/20 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-chico-gold flex items-center gap-2">
                  <span>📊</span> Crescimento dos Gastos na Semana
                </h3>
                <p className="text-xs text-chico-sand">Acompanhamento diário de oscilação</p>
              </div>
              <span className="text-[10px] text-chico-green bg-chico-green/20 border border-chico-green/30 px-2 py-0.5 rounded-md font-bold">
                Semana Atual
              </span>
            </div>

            <div className="flex items-end justify-between gap-2 h-40 pt-6 px-2 border-b border-chico-gold/20">
              {weeklyHistory.map((h, idx) => {
                const heightPercent = Math.round((h.amount / maxWeeklyAmount) * 100)
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[9px] font-bold text-chico-gold opacity-0 group-hover:opacity-100 transition-opacity">
                      R${h.amount}
                    </span>
                    
                    <div className="w-full bg-black/30 rounded-t-lg h-full max-h-[110px] flex items-end p-0.5 overflow-hidden border border-chico-gold/10">
                      <div
                        className="w-full rounded-t-md transition-all duration-700 group-hover:brightness-125"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: 'var(--chico-gold)',
                          backgroundImage: 'linear-gradient(to top, var(--chico-brown), var(--chico-gold))',
                        }}
                      />
                    </div>
                    
                    <span className="text-[10px] text-chico-sand font-semibold">{h.day}</span>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between items-center text-[11px] text-chico-slate">
              <span>Dia com menor gasto: <strong className="text-chico-green">Sexta (R$15.00)</strong></span>
              <span>Dia pico: <strong className="text-chico-gold">Terça (R$120.00)</strong></span>
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
        <section className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button 
            onClick={onNewExpense}
            className="bg-chico-gold/10 border border-chico-gold/30 hover:bg-chico-gold/20 hover:border-chico-gold text-chico-cream p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer group hover:-translate-y-1 shadow-lg"
          >
            <span className="text-2xl group-hover:scale-125 transition-transform duration-200">➕</span>
            <span className="text-xs font-bold text-chico-gold">Novo Gasto</span>
          </button>

          <button 
            onClick={onHistory}
            className="bg-chico-gold/10 border border-chico-gold/30 hover:bg-chico-gold/20 hover:border-chico-gold text-chico-cream p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer group hover:-translate-y-1 shadow-lg"
          >
            <span className="text-2xl group-hover:scale-125 transition-transform duration-200">📜</span>
            <span className="text-xs font-bold text-chico-gold">Extrato</span>
          </button>

          <button 
            onClick={onShoppingLists}
            className="bg-chico-gold/10 border border-chico-gold/30 hover:bg-chico-gold/20 hover:border-chico-gold text-chico-cream p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer group hover:-translate-y-1 shadow-lg"
          >
            <span className="text-2xl group-hover:scale-125 transition-transform duration-200">🛒</span>
            <span className="text-xs font-bold text-chico-gold">Listas</span>
          </button>

          <button 
            onClick={onBillsAndInvoices}
            className="bg-chico-gold/10 border border-chico-gold/30 hover:bg-chico-gold/20 hover:border-chico-gold text-chico-cream p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group hover:-translate-y-1 shadow-lg"
          >
            <span className="text-2xl group-hover:scale-125 transition-transform duration-200">📄</span>
            <span className="text-xs font-bold text-chico-gold">Faturas</span>
          </button>

          <button 
            onClick={onProfile}
            className="bg-chico-gold/10 border border-chico-gold/30 hover:bg-chico-gold/20 hover:border-chico-gold text-chico-cream p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group hover:-translate-y-1 shadow-lg col-span-2 sm:col-span-1"
          >
            <span className="text-2xl group-hover:scale-125 transition-transform duration-200">👤</span>
            <span className="text-xs font-bold text-chico-gold">Perfil</span>
          </button>
        </section>

      </main>
    </div>
  )
}