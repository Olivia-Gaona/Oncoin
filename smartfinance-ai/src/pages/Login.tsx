import { useState } from 'react'
import chicoImg from '../assets/Chico.png'

interface LoginProps {
  onNavigateToRegister: () => void
  onLoginSuccess: () => void
}

export function Login({ onNavigateToRegister, onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username && password) {
      onLoginSuccess()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-chico-dark">
      <div className="w-full max-w-md bg-chico-dark border-2 border-chico-gold/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-28 h-28 rounded-full bg-chico-cream/10 border-2 border-chico-gold flex items-center justify-center p-2 mb-3">
            <img src={chicoImg} alt="Mascote Chico" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-chico-gold">
            ON<span className="text-chico-cream">coin</span>
          </h1>
          <p className="text-xs text-chico-sand mt-1">Seu controle financeiro com a agilidade do Chico</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-chico-sand uppercase tracking-wider mb-2">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              className="w-full px-4 py-3 rounded-xl bg-chico-cream/5 border border-chico-gold/20 text-chico-cream focus:outline-none focus:border-chico-gold"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-chico-sand uppercase tracking-wider">
                Senha
              </label>
              <button type="button" className="text-xs text-chico-gold hover:underline cursor-pointer">
                Esqueceu a senha?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-chico-cream/5 border border-chico-gold/20 text-chico-cream focus:outline-none focus:border-chico-gold"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-chico-gold hover:bg-chico-brown text-chico-dark font-bold rounded-xl transition-all shadow-md cursor-pointer mt-2"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-chico-gold/10">
          <p className="text-sm text-chico-slate">
            Ainda não tem uma conta?{' '}
            <button onClick={onNavigateToRegister} className="text-chico-gold font-semibold hover:underline cursor-pointer">
              Criar cadastro
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}