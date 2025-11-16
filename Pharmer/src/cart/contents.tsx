// src/context/CartContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define the structure of a single item in the cart
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

// Define the structure of the context's state and functions
interface CartContextType {
    cartItems: CartItem[];
    addToCart: (drug: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getItemQuantity: (itemId: string) => number;
}

// Default value for the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props for the CartProvider component
interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (drug: Omit<CartItem, 'quantity'>) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === drug.id);

            if (existingItem) {
                // If item exists, increase quantity
                return prevItems.map(item =>
                    item.id === drug.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // If item is new, add it with quantity 1
                return [...prevItems, { ...drug, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (itemId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, newQuantity: number) => {
        setCartItems(prevItems => {
            if (newQuantity <= 0) {
                return prevItems.filter(item => item.id !== itemId);
            }
            return prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
        });
    };
    
    const getItemQuantity = (itemId: string): number => {
        const item = cartItems.find(item => item.id === itemId);
        return item ? item.quantity : 0;
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = (): number => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getItemQuantity
        }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the cart context easily
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};