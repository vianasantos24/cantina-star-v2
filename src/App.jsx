import { useState, useEffect } from 'react'
import { menuAPI, cartAPI, ordersAPI } from './services/api'
import './App.css'

export default function App() {
  const [menudata, setMenudata] = useState([])
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

  useEffect(() => {
    menuAPI.getAll().then(items => {
      const map = {}
      items.forEach(i => {
        if (!map[i.category]) map[i.category] = { category: i.category, items: [] }
        map[i.category].items.push({ id: i._id, name: i.name, price: i.price, desc: i.description })
      })
      setMenudata(Object.values(map))
    })
  }, [])

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id)
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
    } else {
      setCart([...cart, { ...item, qty: 1 }])
    }
    alert(`✅ ${item.name} added to cart!`)
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id))
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id)
    } else {
      setCart(cart.map(c => c.id === id ? { ...c, qty } : c))
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)

  const handlePlaceOrder = async () => {
    if (!customerName || !customerEmail) {
      alert('Please enter name and email')
      return
    }
    if (cart.length === 0) {
      alert('Cart is empty!')
      return
    }

    try {
      const order = await ordersAPI.create({
        items: cart,
        totalPrice: cartTotal,
        customerName,
        customerEmail
      })
      setOrderPlaced(true)
      setCart([])
      setCustomerName('')
      setCustomerEmail('')
      alert(`✅ Order #${order.orderNumber} placed successfully!`)
      setTimeout(() => setOrderPlaced(false), 3000)
    } catch (err) {
      alert('Error placing order: ' + err.message)
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>🍜 Cantina Star Menu</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* MENU SECTION */}
        <div>
          {menudata.map(cat => (
            <div key={cat.category} style={{ marginBottom: '30px' }}>
              <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>{cat.category}</h2>
              {cat.items.map(item => (
                <div key={item.id} style={{ 
                  border: '1px solid #ddd', 
                  padding: '15px', 
                  marginBottom: '10px',
                  borderRadius: '5px'
                }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{item.name} - ${item.price.toFixed(2)}</h3>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>{item.desc}</p>
                  <button 
                    onClick={() => addToCart(item)}
                    style={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      padding: '8px 15px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    + Add to Cart
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* CART SECTION */}
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '5px', height: 'fit-content' }}>
          <h2>🛒 Your Cart</h2>
          
          {cart.length === 0 ? (
            <p style={{ color: '#999' }}>Cart is empty</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} style={{ 
                  borderBottom: '1px solid #ddd', 
                  paddingBottom: '10px', 
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.name}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={{ marginLeft: 'auto', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              
              <div style={{ borderTop: '2px solid #333', paddingTop: '10px', marginTop: '10px' }}>
                <h3>Total: ${cartTotal.toFixed(2)}</h3>
              </div>

              <div style={{ marginTop: '20px' }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
                />
                <button
                  onClick={handlePlaceOrder}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Place Order
                </button>
              </div>

              {orderPlaced && (
                <div style={{ 
                  backgroundColor: '#4CAF50', 
                  color: 'white', 
                  padding: '10px', 
                  marginTop: '10px',
                  borderRadius: '3px',
                  textAlign: 'center'
                }}>
                  ✅ Order placed!
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}