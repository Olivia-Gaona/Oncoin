import { useState } from 'react'
import chicoImg from '../assets/Chico.png'

interface RegisterProps {
  onNavigateToLogin: () => void
  onRegisterSuccess: (name: string) => void
}

export function Register({ onNavigateToLogin, onRegisterSuccess }: RegisterProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password) {
      setError('Por favor, preencha todos os campos.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    localStorage.setItem('oncoin_user_name', name.trim())
    onRegisterSuccess(name.trim())
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-chico-dark text-chico-cream">
      <div className="w-full max-w-md bg-chico-cream/5 border border-chico-gold/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-chico-cream/10 border-2 border-chico-gold p-2 flex items-center justify-center shadow-inner animate-gold-glow mb-3">
            <img src={chicoImg} alt="Chico ONcoin" className="w-full h-full object-contain animate-chico-float" />
          </div>
          <h1 className="text-2xl font-bold text-chico-gold">Criar Conta no ONcoin</h1>
          <p className="text-xs text-chico-sand mt-1">Crie seu acesso para testar o assistente financeiro</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-chico-sand mb-1.5 uppercase tracking-wider">
              Seu Nome / Apelido
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Olivia Gaona"
              className="w-full px-4 py-3 rounded-xl bg-chico-dark/80 border border-chico-gold/30 text-xs text-chico-cream focus:outline-none focus:border-chico-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-chico-sand mb-1.5 uppercase tracking-wider">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full px-4 py-3 rounded-xl bg-chico-dark/80 border border-chico-gold/30 text-xs text-chico-cream focus:outline-none focus:border-chico-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-chico-sand mb-1.5 uppercase tracking-wider">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-chico-dark/80 border border-chico-gold/30 text-xs text-chico-cream focus:outline-none focus:border-chico-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-chico-sand mb-1.5 uppercase tracking-wider">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-chico-dark/80 border border-chico-gold/30 text-xs text-chico-cream focus:outline-none focus:border-chico-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-linear-to-r from-chico-brown via-chico-gold to-chico-olive text-chico-dark font-bold text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer mt-2"
          >
            Cadastrar & Entrar 🚀
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-chico-gold/20 text-center">
          <p className="text-xs text-chico-sand">
            Já possui uma conta?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-chico-gold font-bold hover:underline cursor-pointer"
            >
              Fazer Login
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}