import { useState } from 'react'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { ExpenseRegister } from './pages/ExpenseRegister'
import { ShoppingLists } from './pages/ShoppingLists'
import { BillsAndInvoices } from './pages/BillsAndInvoices'
import { UserProfile } from './pages/UserProfile'

export function App() {
  const [currentPage, setCurrentPage] = useState<
    'login' | 'register' | 'home' | 'new-expense' | 'shopping-lists' | 'bills' | 'profile'
  >('login')
  const [loggedUser] = useState('OliviaGaona')

  return (
    <div className="min-h-screen bg-chico-dark font-sans selection:bg-chico-gold selection:text-chico-dark">
      {currentPage === 'login' && (
        <div key="login" className="animate-page-entry">
          <Login
            onNavigateToRegister={() => setCurrentPage('register')}
            onLoginSuccess={() => setCurrentPage('home')}
          />
        </div>
      )}

      {currentPage === 'register' && (
        <div key="register" className="animate-page-entry">
          <Register
            onNavigateToLogin={() => setCurrentPage('login')}
            onRegisterSuccess={() => setCurrentPage('home')}
          />
        </div>
      )}

      {currentPage === 'home' && (
        <div key="home" className="animate-page-entry">
          <Dashboard
            username={loggedUser}
            onLogout={() => setCurrentPage('login')}
            onNewExpense={() => setCurrentPage('new-expense')}
            onShoppingLists={() => setCurrentPage('shopping-lists')}
            onBillsAndInvoices={() => setCurrentPage('bills')}
            onProfile={() => setCurrentPage('profile')}
          />
        </div>
      )}

      {currentPage === 'new-expense' && (
        <div key="new-expense" className="animate-page-entry">
          <ExpenseRegister
            onBack={() => setCurrentPage('home')}
            onSave={() => setCurrentPage('home')}
          />
        </div>
      )}

      {currentPage === 'shopping-lists' && (
        <div key="shopping-lists" className="animate-page-entry">
          <ShoppingLists onBack={() => setCurrentPage('home')} />
        </div>
      )}

      {currentPage === 'bills' && (
        <div key="bills" className="animate-page-entry">
          <BillsAndInvoices onBack={() => setCurrentPage('home')} />
        </div>
      )}

      {currentPage === 'profile' && (
        <div key="profile" className="animate-page-entry">
          <UserProfile
            username={loggedUser}
            onBack={() => setCurrentPage('home')}
          />
        </div>
      )}
    </div>
  )
}

export default App