import { useState, useMemo } from "react";

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (item, color) => {
    setCart(prev => {
      // If it's a booking (no color, unique instance), just add it
      if (item.type === 'booking') {
        return [...prev, { ...item, qty: 1 }];
      }

      const existing = prev.find(i => i.id === item.id && i.color === color);
      if (existing)
        return prev.map(i =>
          i.id === item.id && i.color === color
            ? { ...i, qty: i.qty + 1 }
            : i
        );

      return [...prev, { ...item, color, qty: 1 }];
    });
    setIsOpen(true);
  };

  const updateQty = (id, color, delta) =>
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.color === color
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );

  const removeItem = (id, color) =>
    setCart(prev =>
      prev.filter(item => {
        if (item.type === 'booking') return item.id !== id;
        return !(item.id === id && item.color === color);
      })
    );

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cart]
  );

  return { cart, isOpen, setIsOpen, addItem, updateQty, removeItem, total };
};
