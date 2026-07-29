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
    <div>
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
    </div>
  )
}

export default App