import { useState, useEffect } from 'react'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { ExpenseRegister } from './pages/ExpenseRegister'
import { ShoppingLists } from './pages/ShoppingLists'
import { BillsAndInvoices } from './pages/BillsAndInvoices'
import { UserProfile } from './pages/UserProfile'
import { TransactionsHistory } from './pages/TransactionsHistory'

export function App() {
  const [currentPage, setCurrentPage] = useState<
    'login' | 'register' | 'home' | 'new-expense' | 'shopping-lists' | 'bills' | 'profile' | 'history'
  >('login')
  const [loggedUser] = useState('OliviaGaona')

  // Aplica o tema salvo no localStorage na inicialização global do App
  useEffect(() => {
    const savedTheme = localStorage.getItem('oncoin_app_theme') || 'classic'
    document.documentElement.setAttribute('data-theme', savedTheme)
    document.body.setAttribute('data-theme', savedTheme)
  }, [])

  return (
    <div className="min-h-screen bg-chico-dark font-sans selection:bg-chico-gold selection:text-chico-dark transition-colors duration-300">
      {currentPage === 'login' && (
        <Login
          onNavigateToRegister={() => setCurrentPage('register')}
          onLoginSuccess={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'register' && (
        <Register
          onNavigateToLogin={() => setCurrentPage('login')}
          onRegisterSuccess={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'home' && (
        <Dashboard
          username={loggedUser}
          onLogout={() => setCurrentPage('login')}
          onNewExpense={() => setCurrentPage('new-expense')}
          onShoppingLists={() => setCurrentPage('shopping-lists')}
          onBillsAndInvoices={() => setCurrentPage('bills')}
          onProfile={() => setCurrentPage('profile')}
          onHistory={() => setCurrentPage('history')}
        />
      )}

      {currentPage === 'new-expense' && (
        <ExpenseRegister
          onBack={() => setCurrentPage('home')}
          onSave={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'shopping-lists' && (
        <ShoppingLists onBack={() => setCurrentPage('home')} />
      )}

      {currentPage === 'bills' && (
        <BillsAndInvoices onBack={() => setCurrentPage('home')} />
      )}

      {currentPage === 'profile' && (
        <UserProfile
          username={loggedUser}
          onBack={() => setCurrentPage('home')}
        />
      )}

      {currentPage === 'history' && (
        <TransactionsHistory onBack={() => setCurrentPage('home')} />
      )}
    </div>
  )
}

export default App