import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    updateQty,
    removeItem,
    subtotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
