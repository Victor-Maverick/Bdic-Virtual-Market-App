'use client'
import { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    description: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Omit<CartItem, 'quantity'>) => void;
    updateQuantity: (id: number, change: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: number, change: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            ).filter(item => item.quantity > 0));
    };

    const removeFromCart = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                getTotalItems,
                getTotalPrice
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};