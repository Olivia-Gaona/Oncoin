import { useState } from 'react'
import chicoImg from '../assets/Chico.png'

interface RegisterProps {
  onNavigateToLogin: () => void
  onRegisterSuccess: () => void
}

export function Register({ onNavigateToLogin, onRegisterSuccess }: RegisterProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'form' | 'sms'>('form')
  const [smsCode, setSmsCode] = useState('')
  const [error, setError] = useState('')

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação: Exatamente 6 dígitos numéricos + pelo menos 1 caractere especial
    const isSixDigits = (password.match(/\d/g) || []).length === 6
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!isSixDigits || !hasSpecialChar) {
      setError('A senha deve ter exatamente 6 dígitos numéricos e pelo menos 1 caractere especial (ex: 123456!).')
      return
    }

    setError('')
    setStep('sms')
  }

  const handleSmsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (smsCode.length >= 4) {
      onRegisterSuccess()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-chico-dark">
      <div className="w-full max-w-md bg-chico-dark border-2 border-chico-gold/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Topo com o Chico */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-24 h-24 rounded-full bg-chico-cream/10 border-2 border-chico-gold flex items-center justify-center p-2 mb-3">
            <img src={chicoImg} alt="Mascote Chico" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-chico-gold">
            Crie sua conta no <span className="text-chico-cream">ONcoin</span>
          </h1>
          <p className="text-xs text-chico-sand mt-1">O Chico está pronto para cuidar dos seus dados</p>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-chico-sand uppercase tracking-wider mb-1">
                Nome de Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: OliviaGaona"
                className="w-full px-4 py-3 rounded-xl bg-chico-cream/5 border border-chico-gold/20 text-chico-cream focus:outline-none focus:border-chico-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-chico-sand uppercase tracking-wider mb-1">
                Telefone (WhatsApp ou SMS)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-3 rounded-xl bg-chico-cream/5 border border-chico-gold/20 text-chico-cream focus:outline-none focus:border-chico-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-chico-sand uppercase tracking-wider mb-1">
                Senha (6 números + 1 caractere especial)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ex: 123456!"
                className="w-full px-4 py-3 rounded-xl bg-chico-cream/5 border border-chico-gold/20 text-chico-cream focus:outline-none focus:border-chico-gold"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-900/20 p-2.5 rounded-lg border border-red-500/30">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-chico-gold hover:bg-chico-brown text-chico-dark font-bold rounded-xl transition-all shadow-md cursor-pointer mt-2"
            >
              Enviar confirmação
            </button>
          </form>
        ) : (
          /* Sub-tela de Validação SMS */
          <form onSubmit={handleSmsSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-chico-cream">
                Enviamos um código de confirmação para o número <span className="text-chico-gold font-semibold">{phone}</span>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-chico-sand uppercase tracking-wider mb-1 text-center">
                Código de Confirmação
              </label>
              <input
                type="text"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                placeholder="1234"
                className="w-full px-4 py-3 rounded-xl bg-chico-cream/5 border border-chico-gold/20 text-chico-cream text-center text-xl tracking-widest focus:outline-none focus:border-chico-gold"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-chico-gold hover:bg-chico-brown text-chico-dark font-bold rounded-xl transition-all cursor-pointer"
            >
              Confirmar e Entrar
            </button>

            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-full text-xs text-chico-sand hover:underline cursor-pointer mt-2"
            >
              Voltar e alterar dados
            </button>
          </form>
        )}

        <div className="mt-6 text-center pt-4 border-t border-chico-gold/10">
          <p className="text-xs text-chico-slate">
            Já tem uma conta?{' '}
            <button onClick={onNavigateToLogin} className="text-chico-gold font-semibold hover:underline cursor-pointer">
              Fazer Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}