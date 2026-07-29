import { useState } from 'react'
import chicoImg from '../assets/Chico.png'
import type { ExpenseItem } from './ExpenseRegister'
import type { Bill } from './BillsAndInvoices'

interface UserProfileProps {
  username?: string
  onBack: () => void
}

export function UserProfile({ username = 'OliviaGaona', onBack }: UserProfileProps) {
  const [bio, setBio] = useState('tentando meu melhor 🐆✨')
  const [isEditingBio, setIsEditingBio] = useState(false)

  // Estados do Simulador de Investimentos (Usando string no input)
  const [monthlyContribution, setMonthlyContribution] = useState<string>('300')
  const [simulationMonths, setSimulationMonths] = useState<number>(12)
  const [cdiRate] = useState<number>(0.105)

  // Conversão para número
  const numContribution = parseFloat(monthlyContribution) || 0

  const calculateInvestment = () => {
    let total = 0
    const monthlyRate = cdiRate / 12
    for (let i = 0; i < simulationMonths; i++) {
      total = (total + numContribution) * (1 + monthlyRate)
    }
    return total
  }

  const simulatedTotal = calculateInvestment()
  const totalInvested = numContribution * simulationMonths
  const totalProfit = simulatedTotal - totalInvested

  // Metas de Economia
  const [savedAmount] = useState(3500.0)
  const [targetAmount] = useState(5000.0)
  const progressPercentage = Math.min(Math.round((savedAmount / targetAmount) * 100), 100)

  // Recados do Chico
  const [alerts] = useState([
    {
      id: '1',
      type: 'warning',
      icon: '⚠️',
      title: 'Atenção aos gastos com Mercado',
      desc: 'Você atingiu 85% do limite definido para esta categoria este mês.',
      date: 'Hoje',
    },
    {
      id: '2',
      type: 'success',
      icon: '🎉',
      title: 'Meta de Economia da Semana!',
      desc: 'Parabéns! Você guardou R$ 150,00 no cofrinho da Viagem.',
      date: 'Ontem',
    },
    {
      id: '3',
      type: 'info',
      icon: '📄',
      title: 'Conta prestes a vencer',
      desc: 'Sua fatura de Internet vence em breve. Não se esqueça de anexar o comprovante!',
      date: '2 dias atrás',
    },
  ])

  // Função para exportar os dados em CSV
  const handleExportCSV = () => {
    const savedExpenses: ExpenseItem[] = JSON.parse(localStorage.getItem('oncoin_expenses') || '[]')
    const savedBills: Bill[] = JSON.parse(localStorage.getItem('oncoin_bills') || '[]')

    let csvContent = 'data:text/csv;charset=utf-8,Tipo,Titulo,Valor,Categoria,Data_ou_Status\n'

    savedExpenses.forEach((exp) => {
      csvContent += `Gasto,${exp.title},${exp.amount},${exp.category},${exp.createdAt.split('T')[0]}\n`
    })

    savedBills.forEach((bill) => {
      csvContent += `Fatura,${bill.title},${bill.amount},${bill.category},${bill.status}\n`
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `relatorio_oncoin_${username}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
        
        {/* Card do Perfil */}
        <section className="bg-gradient-to-br from-chico-cream/10 via-chico-dark to-chico-brown/20 border border-chico-gold/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-chico-cream/10 border-2 border-chico-gold p-1 flex items-center justify-center overflow-hidden shadow-inner animate-gold-glow">
                <img
                  src={chicoImg}
                  alt="Avatar"
                  className="w-full h-full object-contain animate-chico-float"
                />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-2xl font-bold text-chico-gold">{username}</h2>
                <div className="flex gap-2 justify-center sm:justify-start">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-chico-green bg-chico-green/20 px-3 py-1 rounded-full border border-chico-green/30">
                    Membro ONcoin
                  </span>
                  <button
                    onClick={handleExportCSV}
                    className="text-[10px] uppercase font-bold tracking-wider text-chico-gold bg-chico-gold/10 hover:bg-chico-gold/20 px-3 py-1 rounded-full border border-chico-gold/40 cursor-pointer transition-all"
                    title="Baixar relatórios de gastos em CSV"
                  >
                    📥 Exportar CSV
                  </button>
                </div>
              </div>

              <div className="pt-1">
                {isEditingBio ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-chico-dark border border-chico-gold text-xs text-chico-cream focus:outline-none w-full"
                    />
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="px-3 py-1.5 bg-chico-gold text-chico-dark text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Salvar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-chico-sand text-xs italic">
                    <span>"{bio}"</span>
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="text-[10px] text-chico-gold hover:underline not-italic cursor-pointer"
                    >
                      ✏️ editar
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Progresso de Economia */}
        <section className="bg-chico-cream/5 border border-chico-gold/20 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-lg font-bold text-chico-gold">Progresso da Meta de Economia 🎯</h3>
              <p className="text-xs text-chico-sand">Acompanhe seu objetivo acumulado</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-chico-slate">Objetivo Total: </span>
              <span className="text-sm font-bold text-chico-cream">R$ {targetAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-chico-sand">Já economizado: <strong className="text-chico-gold">R$ {savedAmount.toFixed(2)}</strong></span>
              <span className="text-chico-green">{progressPercentage}% alcançado</span>
            </div>
            
            <div className="w-full bg-chico-dark/80 h-4 rounded-full border border-chico-gold/20 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-chico-brown via-chico-gold to-chico-green h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </section>

        {/* Simulador do Cofrinho Rendendo */}
        <section className="bg-chico-cream/5 border border-chico-gold/20 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-chico-gold flex items-center gap-2">
                <span>🐷</span> Simulador do Cofrinho Rendendo
              </h3>
              <p className="text-xs text-chico-sand">Veja quanto o seu dinheiro pode render guardando mensalmente</p>
            </div>
            <span className="text-xs bg-chico-green/20 text-chico-green border border-chico-green/30 px-2.5 py-1 rounded-full font-semibold">
              Rendimento ~10.5% a.a.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4 bg-chico-dark/50 p-4 rounded-2xl border border-chico-gold/10">
              <div>
                <label className="block text-xs text-chico-sand mb-1">Aporte Mensal (R$)</label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl bg-chico-cream/5 border border-chico-gold/20 text-xs text-chico-cream focus:outline-none focus:border-chico-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-chico-sand mb-1">Prazo em Meses ({simulationMonths} meses)</label>
                <input
                  type="range"
                  min="1"
                  max="36"
                  value={simulationMonths}
                  onChange={(e) => setSimulationMonths(Number(e.target.value))}
                  className="w-full accent-chico-gold cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-chico-dark/80 p-4 rounded-2xl border border-chico-gold/20 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-chico-sand">
                  <span>Total Investido:</span>
                  <span className="font-bold text-chico-cream">R$ {totalInvested.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-chico-sand">
                  <span>Rendimento Estimado:</span>
                  <span className="font-bold text-chico-green">+ R$ {totalProfit.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-chico-gold/10 flex justify-between items-end">
                <span className="text-xs uppercase font-semibold text-chico-sand">Valor Final Estimado:</span>
                <span className="text-xl font-bold text-chico-gold">R$ {simulatedTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Central de Alertas e Recados do Chico */}
        <section className="bg-chico-cream/5 border border-chico-gold/20 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-chico-gold flex items-center gap-2">
                <span>🐆</span> Alertas & Recados do Chico
              </h3>
              <p className="text-xs text-chico-sand">Notificações automáticas do seu assistente financeiro</p>
            </div>
            <span className="text-xs bg-chico-gold/20 text-chico-gold border border-chico-gold/30 px-2.5 py-1 rounded-full font-semibold">
              {alerts.length} recados
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-chico-dark/60 border border-chico-gold/10 hover:border-chico-gold/30 rounded-2xl p-4 flex items-start gap-3 transition-all"
              >
                <span className="text-xl p-2 bg-chico-cream/5 rounded-xl border border-chico-gold/10">
                  {alert.icon}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-bold text-chico-cream">{alert.title}</h4>
                    <span className="text-[10px] text-chico-slate">{alert.date}</span>
                  </div>
                  <p className="text-xs text-chico-sand leading-relaxed">{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}