import { createContext, ReactNode, useEffect, useState } from 'react';
import { Coffee } from '../pages/Home/components/CoffeCard';
import { produce } from 'immer';

export interface CartItem extends Coffee {
  quantity: number;
}

interface CartContexType {
  cartItems?: CartItem[];
  cartQuantity: number;
  cartItemsTotal: number;
  addCoffeeToCart: (coffee: CartItem) => void;
  changeCartItemQuantity: (cartItemId: number, type: "increase" | "decrease") => void; 
  removeCartItem: (cartItemId: number) => void;
  cleanCart: () => void;
}

interface CartContextProviderProps {
  children: ReactNode;
}

const COFFEE_ITEMS_STORAGE_KEY = "coffeeDelivery:cartItems";

export const CartContext = createContext({} as CartContexType);

export function CartContextProvider({ children }: CartContextProviderProps){

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartItems = localStorage.getItem(COFFEE_ITEMS_STORAGE_KEY);

    if(storedCartItems){
      return JSON.parse(storedCartItems);
    }

    return [];
  });
  
  const cartQuantity = cartItems.length;
  const cartItemsTotal = cartItems.reduce((total, cartItem) => {
    return total + cartItem.price * cartItem.quantity;
  }, 0)

  function addCoffeeToCart(coffee: CartItem){
    const coffeeAlreadyExistsInCart = cartItems.findIndex((cartItem) => cartItem.id === coffee?.id);

    const newCart = produce(cartItems, (draft) => {
      if(coffeeAlreadyExistsInCart < 0){
        draft.push(coffee)
      } else {
        draft[coffeeAlreadyExistsInCart].quantity += coffee.quantity;
      }
    });

    setCartItems(newCart);
  }

  function changeCartItemQuantity(cartItemId: number, type: 'increase' | 'decrease'){
    const newCart = produce(cartItems, (draft) => {
      const coffeeExistsCart = cartItems.findIndex((cartItem) => cartItem.id === cartItemId);

      if(coffeeExistsCart >= 0){
        const item = draft[coffeeExistsCart];
        draft[coffeeExistsCart].quantity = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
      }
    });

    setCartItems(newCart);
  }

  function removeCartItem(cartItemId: number){
    const newCart = produce(cartItems, (draft) => {
      const coffeeExistsCart = cartItems.findIndex((cartItem) => cartItem.id === cartItemId);

      if(coffeeExistsCart >= 0){
        draft.splice(coffeeExistsCart, 1)
      }
    });

    setCartItems(newCart);
  }

  function cleanCart(){
    localStorage.removeItem(COFFEE_ITEMS_STORAGE_KEY);
    setCartItems([]);
  }

  useEffect(() => {
    localStorage.setItem(COFFEE_ITEMS_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, cartQuantity, cartItemsTotal, addCoffeeToCart, changeCartItemQuantity, removeCartItem, cleanCart }}>
      {children}
    </CartContext.Provider>
  )
}