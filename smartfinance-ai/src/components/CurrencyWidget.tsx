import { useEffect, useState } from 'react'

interface CurrencyData {
  code: string
  name: string
  bid: string
  pctChange: string
}

export function CurrencyWidget() {
  const [currencies, setCurrencies] = useState<CurrencyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchRates = async () => {
    try {
      setLoading(true)
      setError(false)
      // Requisição HTTP real para API externa (Front-end <-> Back-end)
      const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL')
      if (!response.ok) throw new Error('Falha ao buscar cotações')
      
      const data = await response.json()
      setCurrencies([
        {
          code: 'USD',
          name: 'Dólar Comercial',
          bid: parseFloat(data.USDBRL.bid).toFixed(2),
          pctChange: parseFloat(data.USDBRL.pctChange).toFixed(2)
        },
        {
          code: 'EUR',
          name: 'Euro',
          bid: parseFloat(data.EURBRL.bid).toFixed(2),
          pctChange: parseFloat(data.EURBRL.pctChange).toFixed(2)
        }
      ])
    } catch (err) {
      console.error('Erro na requisição da API:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
  }, [])

  return (
    <div className="bg-chico-cream/5 border border-chico-gold/20 rounded-2xl p-4 my-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-chico-gold uppercase tracking-wider flex items-center gap-1.5">
          🌐 Mercado Financeiro (API Ao Vivo)
        </h3>
        <button
          onClick={fetchRates}
          className="text-[10px] text-chico-sand hover:text-chico-gold transition-colors cursor-pointer"
        >
          🔄 Atualizar
        </button>
      </div>

      {loading ? (
        <div className="text-xs text-chico-sand text-center py-2 animate-pulse">
          Carregando cotações via API...
        </div>
      ) : error ? (
        <div className="text-xs text-red-400 text-center py-2">
          Não foi possível carregar as cotações.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {currencies.map((coin) => (
            <div key={coin.code} className="bg-chico-dark/60 rounded-xl p-3 border border-chico-gold/10">
              <span className="text-[10px] text-chico-sand block font-semibold">{coin.name} ({coin.code})</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-base font-bold text-chico-cream">R\$ {coin.bid}</span>
                <span className={`text-[10px] font-bold ${Number(coin.pctChange) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {Number(coin.pctChange) >= 0 ? `+${coin.pctChange}%` : `${coin.pctChange}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}