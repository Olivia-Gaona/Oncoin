import { useState, useEffect } from 'react'
import chicoImg from '../assets/Chico.png'

interface ShoppingListsProps {
  onBack: () => void
}

interface Item {
  id: string
  name: string
  price: number
  completed: boolean
}

interface ShoppingList {
  id: string
  title: string
  icon: string
  items: Item[]
}

const defaultLists: ShoppingList[] = [
  {
    id: '1',
    title: 'Compras Mercado',
    icon: '🛒',
    items: [
      { id: '101', name: 'Café em grãos', price: 32.5, completed: true },
      { id: '102', name: 'Leite vegetal', price: 14.0, completed: false },
      { id: '103', name: 'Frutas da estação', price: 45.0, completed: false },
    ],
  },
  {
    id: '2',
    title: 'Compras Amazon',
    icon: '📦',
    items: [
      { id: '201', name: 'Livro de Finanças', price: 59.9, completed: false },
      { id: '202', name: 'Cabo USB-C', price: 29.0, completed: true },
    ],
  },
  {
    id: '3',
    title: 'Compras Farmácia',
    icon: '💊',
    items: [
      { id: '301', name: 'Protetor Solar', price: 68.0, completed: false },
      { id: '302', name: 'Vitamina C', price: 35.0, completed: true },
    ],
  },
]

export function ShoppingLists({ onBack }: ShoppingListsProps) {
  const [lists, setLists] = useState<ShoppingList[]>(() => {
    const saved = localStorage.getItem('oncoin_shopping_lists')
    return saved ? JSON.parse(saved) : defaultLists
  })

  const [activeListId, setActiveListId] = useState<string>('1')
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newListTitle, setNewListTitle] = useState('')
  const [showAddListModal, setShowAddListModal] = useState(false)

  // Atualiza localStorage sempre que as listas mudarem
  useEffect(() => {
    localStorage.setItem('oncoin_shopping_lists', JSON.stringify(lists))
  }, [lists])

  const activeList = lists.find((l) => l.id === activeListId) || lists[0]

  const toggleItem = (itemId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== activeListId) return list
        return {
          ...list,
          items: list.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        }
      })
    )
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName) return

    const newItem: Item = {
      id: Date.now().toString(),
      name: newItemName,
      price: parseFloat(newItemPrice) || 0,
      completed: false,
    }

    setLists((prev) =>
      prev.map((list) =>
        list.id === activeListId
          ? { ...list, items: [...list.items, newItem] }
          : list
      )
    )

    setNewItemName('')
    setNewItemPrice('')
  }

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListTitle) return

    const newList: ShoppingList = {
      id: Date.now().toString(),
      title: newListTitle,
      icon: '🛍️',
      items: [],
    }

    setLists((prev) => [...prev, newList])
    setActiveListId(newList.id)
    setNewListTitle('')
    setShowAddListModal(false)
  }

  const totalListValue = activeList.items.reduce((acc, item) => acc + item.price, 0)
  const totalCompletedValue = activeList.items
    .filter((i) => i.completed)
    .reduce((acc, item) => acc + item.price, 0)

  return (
    <div className="min-h-screen bg-chico-dark text-chico-cream p-4 pb-12">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-chico-gold">Listas de Compras 🛒</h2>
            <p className="text-xs text-chico-sand mt-0.5">
              O Chico ajuda a controlar o carrinho e não estourar o orçamento.
            </p>
          </div>

          <button
            onClick={() => setShowAddListModal(true)}
            className="px-4 py-2 bg-chico-gold hover:bg-chico-brown text-chico-dark font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
          >
            + Criar Nova Lista
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {lists.map((list) => (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeListId === list.id
                  ? 'bg-chico-gold/20 border-chico-gold text-chico-cream shadow-md'
                  : 'bg-chico-cream/5 border-chico-gold/10 text-chico-slate hover:border-chico-gold/30'
              }`}
            >
              <span>{list.icon}</span>
              <span>{list.title}</span>
              <span className="bg-chico-dark/60 text-chico-gold text-[10px] px-2 py-0.5 rounded-full border border-chico-gold/20">
                {list.items.length}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <form
              onSubmit={handleAddItem}
              className="bg-chico-cream/5 border border-chico-gold/20 rounded-2xl p-4 flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Nome do item (ex: Detergente)"
                className="flex-1 px-3 py-2 rounded-xl bg-chico-dark/60 border border-chico-gold/20 text-xs text-chico-cream focus:outline-none focus:border-chico-gold"
              />
              <input
                type="number"
                step="0.01"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="R$ Estimado"
                className="w-full sm:w-28 px-3 py-2 rounded-xl bg-chico-dark/60 border border-chico-gold/20 text-xs text-chico-cream focus:outline-none focus:border-chico-gold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-chico-gold text-chico-dark font-bold text-xs rounded-xl hover:bg-chico-brown cursor-pointer transition-all"
              >
                Adicionar
              </button>
            </form>

            <div className="bg-chico-cream/5 border border-chico-gold/20 rounded-2xl p-4 space-y-2">
              {activeList.items.length === 0 ? (
                <p className="text-xs text-chico-slate text-center py-6">
                  Nenhum item na lista ainda. Adicione um acima!
                </p>
              ) : (
                activeList.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      item.completed
                        ? 'bg-chico-green/10 border-chico-green/30 opacity-60'
                        : 'bg-chico-dark/40 border-chico-gold/10 hover:border-chico-gold/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {}}
                        className="w-4 h-4 accent-chico-gold cursor-pointer"
                      />
                      <span
                        className={`text-sm ${
                          item.completed ? 'line-through text-chico-slate' : 'text-chico-cream font-medium'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-chico-gold">
                      R$ {item.price.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-chico-cream/10 to-chico-dark border border-chico-gold/30 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-chico-gold uppercase tracking-wider flex items-center gap-2">
                <span>{activeList.icon}</span> Total da Lista
              </h3>

              <div className="space-y-2 border-t border-b border-chico-gold/10 py-3">
                <div className="flex justify-between text-xs text-chico-sand">
                  <span>Valor Total Estimado:</span>
                  <span className="font-bold text-chico-cream">R$ {totalListValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-chico-sand">
                  <span>Já Comprado:</span>
                  <span className="font-bold text-chico-green">R$ {totalCompletedValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-chico-sand">
                  <span>Falta Comprar:</span>
                  <span className="font-bold text-red-400">
                    R$ {(totalListValue - totalCompletedValue).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-chico-dark/60 p-3 rounded-xl border border-chico-gold/20 flex gap-2 items-start">
                <span className="text-base">🐆</span>
                <p className="text-[11px] text-chico-sand leading-relaxed">
                  Marque os itens no carrinho para ver o valor restante diminuir em tempo real!
                </p>
              </div>
            </div>
          </div>
        </div>

        {showAddListModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-chico-dark border border-chico-gold/40 rounded-2xl p-6 w-full max-w-sm space-y-4">
              <h3 className="text-lg font-bold text-chico-gold">Criar Nova Lista</h3>
              <form onSubmit={handleCreateList} className="space-y-4">
                <div>
                  <label className="block text-xs text-chico-sand mb-1">Nome da Lista</label>
                  <input
                    type="text"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Ex: Compras de Natal"
                    className="w-full px-3 py-2 rounded-xl bg-chico-cream/5 border border-chico-gold/20 text-xs text-chico-cream focus:outline-none focus:border-chico-gold"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddListModal(false)}
                    className="flex-1 py-2 text-xs border border-chico-gold/30 rounded-xl text-chico-sand hover:text-chico-cream cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs bg-chico-gold text-chico-dark font-bold rounded-xl hover:bg-chico-brown cursor-pointer"
                  >
                    Criar Lista
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}