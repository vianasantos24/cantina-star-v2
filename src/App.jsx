import { useState, useEffect } from 'react'
import { menuAPI } from './services/api'
import './App.css'

export default function App() {
  const [menudata, setMenudata] = useState([])

  useEffect(() => {
    menuAPI.getAll().then(items => {
      const map = {}
      items.forEach(i => {
        if (!map[i.category]) map[i.category] = { category: i.category, items: [] }
        map[i.category].items.push({ name: i.name, price: i.price, desc: i.description })
      })
      setMenudata(Object.values(map))
    })
  }, [])

  return (
    <div>
      <h1>Cantina Star Menu</h1>
      {menudata.map(cat => (
        <div key={cat.category}>
          <h2>{cat.category}</h2>
          {cat.items.map(item => (
            <div key={item.name}>
              <h3>{item.name} - ${item.price}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}