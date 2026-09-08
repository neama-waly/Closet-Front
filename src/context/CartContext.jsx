import { createContext, useState, useEffect , useContext , useCallback} from "react";
import {useAuth} from "./AuthContext"

const CartContext = createContext();

export const CartProvider = ({children})=>{
        const { token } = useAuth();
        const [cart , setCart] = useState([])

const fetchCart = useCallback(() => {
    if (token) {
      fetch("http://localhost:5010/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.items) {
            const formatted = data.items.map((item) => ({
              id: item.product.id,
              cartItemId: item.id, // مهم جداً للمسح
              title: item.product.title,
              price: item.product.price,
              quantity: item.quantity,
              image: item.product.images?.[0] || "",
              selectedSize: item.size,
              selectedColor: item.color,
            }));
            setCart(formatted);
          }
        })
        .catch((err) => console.error("Error fetching user cart:", err));
      } else {
        setCart([]);
      }
    }, [token]);

      useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCart();
      }, [fetchCart]);

   const addToCart = async (product, selectedSize, selectedColor, quantity = 1) => {
    if (!token) return alert("Please login first!");

    try {
      const res = await fetch("http://localhost:5010/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        }),
      });

      if (res.ok) {
        fetchCart(); 
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };
   const removeFromCart = async (cartItemId) => {
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5010/api/cart/item/${cartItemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchCart();
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

const updateQuantity = async (product, delta) => {
    await addToCart(product, product.selectedSize, product.selectedColor, delta);
  };

  const clearCart = () => setCart([]);
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  return(
    <CartContext.Provider
    value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalCount,
        fetchCart
    }}>
        {children}
    </CartContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);