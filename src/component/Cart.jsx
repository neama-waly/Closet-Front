import "../App.css"
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  

  if (!isOpen) return null;
const handleClose = () => {
  if (onClose) onClose();
  navigate("/"); 
};
  return (
    <div className="cart-overlay" onClick={handleClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        
        
        <div className="cart-header">
          <h3>SHOPPING CART</h3>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>

        
        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is currently empty 🛒</p>
            <button className="shop-btn" onClick={handleClose}>Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.title} />
                    ) : (
                      <div className="no-img">No Image</div>
                    )}
                  </div>

                  <div className="item-details">
                    <h4 className="item-title">{item.title}</h4>
                    <div className="item-meta">
                      <span>Size: <b>{item.selectedSize}</b></span>
                      <span className="color-tag">
                        Color: <span className="color-swatch" style={{ backgroundColor: item.selectedColor }}  /> {item.selectedColor}
                      </span>
                    </div>
                    <p className="item-price">{item.price} EGP</p>

                    <div className="item-quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, 1)}>+</button>
                    </div>
                  </div>

                  <button 
                    className="remove-btn" 
                    onClick={() => removeFromCart(item.cartItemId)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

           
            <div className="cart-footer">
              <div className="total-row">
                <span>Subtotal:</span>
                <span className="total-amount">{totalAmount} EGP</span>
              </div>
              <div className="cart-actions">
                <button className="clear-btn" onClick={clearCart}>Clear</button>
                <button 
                  className="checkout-btn" 
                  onClick={() => {
                    onClose();
                    navigate("/Checkout");
                  }}
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
export default Cart ;