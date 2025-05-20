import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cart';

// Get cart from localStorage
const getLocalCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : { items: [] };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getLocalCart(),
  reducers: {
    addToCart(state, action) {
      const item = state.items.find((item) => item._id === action.payload._id);
      if (item) {
        item.quantity++;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item._id !== action.payload._id);
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCart(state) {
      state.items = [];
      // Clear localStorage
      localStorage.removeItem('cart');
    },
    syncCartWithServer(state, action) {
      state.items = action.payload;
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    }
  },
});

// Async thunks for server operations
export const syncCartToServer = createAsyncThunk(
  'cart/syncToServer',
  async (_, { getState }) => {
    const { cart } = getState();
    const { user } = getState().auth;
    
    if (!user) return;

    try {
      // First, get the current server cart
      const response = await axios.get(`${API_URL}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      // Merge local cart with server cart
      const serverItems = response.data.items || [];
      const localItems = cart.items;
      
      // Create a map of server items for easy lookup
      const serverItemsMap = new Map(serverItems.map(item => [item._id, item]));
      
      // Merge items, preferring local quantities
      const mergedItems = localItems.map(localItem => {
        const serverItem = serverItemsMap.get(localItem._id);
        if (serverItem) {
          return {
            ...localItem,
            quantity: localItem.quantity + serverItem.quantity
          };
        }
        return localItem;
      });
      
      // Add any server items that aren't in local cart
      serverItems.forEach(serverItem => {
        if (!localItems.find(item => item._id === serverItem._id)) {
          mergedItems.push(serverItem);
        }
      });
      
      // Update server cart
      await axios.put(`${API_URL}`, 
        { items: mergedItems },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      return mergedItems;
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  }
);

export const { addToCart, removeFromCart, clearCart, syncCartWithServer } = cartSlice.actions;
export default cartSlice.reducer;