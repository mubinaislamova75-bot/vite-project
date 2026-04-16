import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import FavoritesPage from './pages/FavoritesPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [cart, setCart] = useLocalStorage('cart', []);
  const [orders, setOrders] = useLocalStorage('orders', []);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const updateCartQuantity = (id, delta) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const addToFavorites = (item) => {
    setFavorites(prev => {
      if (!prev.find(fav => fav.id === item.id)) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const removeFromFavorites = (id) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const placeOrder = (address) => {
    if (cart.length === 0) return;
    
    const newOrder = {
      id: Date.now(),
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      address: address,
      date: new Date().toISOString(),
      status: 'Доставляется'
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    alert(`Заказ оформлен! Сумма: ${newOrder.total} ₽\nАдрес: ${address}\nСпасибо за заказ!`);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const favoritesCount = favorites.length;

  return (
    <Router>
      <Header 
        cartItemsCount={cartItemsCount} 
        favoritesCount={favoritesCount} 
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <HomePage 
            addToCart={addToCart}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            favorites={favorites}
          />
        } />
        <Route path="/favorites" element={
          <PrivateRoute>
            <FavoritesPage 
              favorites={favorites}
              removeFromFavorites={removeFromFavorites}
              addToCart={addToCart}
            />
          </PrivateRoute>
        } />
        <Route path="/cart" element={
          <PrivateRoute>
            <CartPage 
              cart={cart}
              updateQuantity={updateCartQuantity}
              removeFromCart={removeFromCart}
              placeOrder={placeOrder}
            />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage orders={orders} />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;