'use client'
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import {
    addToCart as apiAddToCart,
    getCart as apiGetCart,
    updateCartItem as apiUpdateCartItem,
    removeFromCart as apiRemoveFromCart,
    checkoutCart as apiCheckoutCart,
    CartItem,
    CheckoutResponse
} from "@/app/services/cartService";

interface CheckoutData {
    buyerEmail: string;
    deliveryOption: 'pickup' | 'delivery';
    address: string;
}

interface CartContextType {
    cartId: string | null;
    cartItems: CartItem[];
    loading: boolean;
    error: string | null;
    addToCart: (product: Omit<CartItem, 'itemId' | 'quantity'>, quantity?: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeFromCart: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    fetchCart: () => Promise<void>;
    checkout: (checkoutData: CheckoutData) => Promise<CheckoutResponse>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children, authToken: initialAuthToken }: { children: ReactNode, authToken?: string }) => {
    const [cartId, setCartId] = useState<string | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authToken, setAuthToken] = useState(initialAuthToken);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch('/api/auth/session');
                const session = await response.json();
                console.log("Token here: ", session.accessToken)
                setAuthToken(session?.accessToken);
                localStorage.setItem("token", session.accessToken)
            } catch (err) {
                console.error('Error fetching session:', err);
            }
        };

        fetchSession();
    }, []);

    // Initialize cart from localStorage or create new one
    useEffect(() => {
        const initializeCart = async () => {
            try {
                setLoading(true);
                // Try to get cartId from localStorage
                const savedCartId = localStorage.getItem('cartId');

                if (savedCartId) {
                    // Verify if cart exists on server
                    try {
                        const cart = await apiGetCart(savedCartId);
                        setCartId(savedCartId);
                        setCartItems(cart.items);
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (error) {
                        // If cart doesn't exist on server, create new one
                        localStorage.removeItem('cartId');
                        createNewCart();
                    }
                } else {
                    createNewCart();
                }
            } catch (err) {
                console.error('Error initializing cart:', err);
            } finally {
                setLoading(false);
            }
        };

        const createNewCart = async () => {
            const newCartId = 'cart-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
            localStorage.setItem('cartId', newCartId);
            setCartId(newCartId);
            setCartItems([]);
        };

        if (authToken !== undefined) {
            initializeCart();
        }
    }, [authToken]);

    const fetchCart = useCallback(async () => {
        if (!cartId) return;

        try {
            setLoading(true);
            const response = await apiGetCart(cartId);
            setCartItems(response.items);
            // Update cartId if server returned a different one
            if (response.cartId && response.cartId !== cartId) {
                setCartId(response.cartId);
                localStorage.setItem('cartId', response.cartId);
            }
        } catch (err) {
            setError('Failed to fetch cart');
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    }, [cartId]); // Removed authToken dependency

    const addToCart = useCallback(async (product: Omit<CartItem, 'itemId' | 'quantity'>, quantity: number = 1) => {
        try {
            setLoading(true);
            let currentCartId = cartId;

            // If no cart exists, create one by adding the first item
            if (!currentCartId) {
                currentCartId = 'cart-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
                localStorage.setItem('cartId', currentCartId);
                setCartId(currentCartId);
            }

            const response = await apiAddToCart(
                currentCartId,
                product.productId,
                quantity
            );

            setCartItems(response.items);
            // Update cartId if server returned a different one
            if (response.cartId && response.cartId !== currentCartId) {
                setCartId(response.cartId);
                localStorage.setItem('cartId', response.cartId);
            }
        } catch (err) {
            setError('Failed to add item to cart');
            console.error('Error adding to cart:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [cartId]); // Removed authToken dependency

    const updateQuantity = useCallback(async (itemId: number, quantityDelta: number) => {
        if (!cartId) return;

        try {
            setLoading(true);
            const currentItem = cartItems.find(item => item.itemId === itemId);
            if (!currentItem) throw new Error('Item not found in cart');

            const newQuantity = currentItem.quantity + quantityDelta;
            if (newQuantity < 1) throw new Error('Quantity cannot be less than 1');

            const response = await apiUpdateCartItem(
                cartId,
                itemId,
                newQuantity,
            );

            setCartItems(response.items);
        } catch (err) {
            setError('Failed to update quantity');
            console.error('Error updating quantity:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [cartId, cartItems]); // Removed authToken dependency

    const removeFromCart = useCallback(async (itemId: number) => {
        if (!cartId) return;

        try {
            setLoading(true);
            const response = await apiRemoveFromCart(
                cartId,
                itemId,
            );
            setCartItems(response.items);
        } catch (err) {
            setError('Failed to remove item from cart');
            console.error('Error removing from cart:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [cartId]); // Removed authToken dependency

    const clearCart = useCallback(async () => {
        setCartItems([]);
    }, []);

    const checkout = useCallback(async (checkoutData: CheckoutData): Promise<CheckoutResponse> => {
        const currentCartId = cartId || localStorage.getItem('cartId');
        if (!currentCartId) throw new Error('No cart ID');

        try {
            setLoading(true);
            const response = await apiCheckoutCart(
                currentCartId,
                checkoutData,
            );

            setCartItems([]);
            return response;
        } catch (err) {
            setError('Failed to checkout');
            console.error('Error during checkout:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [cartId]); // Removed authToken dependency

    const getTotalItems = useCallback(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    const getTotalPrice = useCallback(() => {
        return cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
    }, [cartItems]);

    return (
        <CartContext.Provider
            value={{
                cartId,
                cartItems,
                loading,
                error,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                getTotalItems,
                getTotalPrice,
                fetchCart,
                checkout
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