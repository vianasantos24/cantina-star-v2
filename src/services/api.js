// API Configuration
const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Session management
let sessionId = localStorage.getItem('sessionId');
if (!sessionId) {
  sessionId = crypto.randomUUID ? crypto.randomUUID() : 'session-' + Date.now();
  localStorage.setItem('sessionId', sessionId);
}

// ===== MENU API =====
export const menuAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/menu`);
    if (!response.ok) throw new Error('Failed to fetch menu');
    return response.json();
  }
};

// ===== CART API =====
export const cartAPI = {
  get: async () => {
    const response = await fetch(`${API_URL}/cart/${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  addItem: async (item) => {
    const response = await fetch(`${API_URL}/cart/${sessionId}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        category: item.category
      })
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  },

  removeItem: async (itemId) => {
    const response = await fetch(`${API_URL}/cart/${sessionId}/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: itemId })
    });
    if (!response.ok) throw new Error('Failed to remove from cart');
    return response.json();
  },

  clear: async () => {
    const response = await fetch(`${API_URL}/cart/${sessionId}/clear`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to clear cart');
    return response.json();
  }
};

// ===== ORDERS API =====
export const ordersAPI = {
  create: async (orderData) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  }
};

export { sessionId };