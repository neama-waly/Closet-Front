import { useState } from "react";
import {useNavigate} from "react-router-dom";
const api_url = "http://localhost:5010/api";
import {useAuth} from "../context/AuthContext"
export default function Checkout({cartItems , clearCart }){

    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        paymentMethod: 'CASH_ON_DELIVERY',
    });

    const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
    const subtotal = safeCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = 50 ; 
    const total = subtotal + shippingFee;

    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('closet_user')); 
    const userId = storedUser?.id;

    

    if (!userId) {
        navigate('/login'); 
        return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${api_url}/orders/checkout`, {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        body: JSON.stringify({
          userId,
          ...formData,
          items: cartItems,
          totalAmount: total,
        }),
      });

      const data = await response.json();
      const createdOrderId = data.order?.id || data.order?._id || data.id || data._id;
      if (response.ok) {
        clearCart(); 
        alert('Ordered Successfully ');
        navigate('/OrderSuccess', { state: { orderId: createdOrderId } });
        
      } else {
        alert(data.message || "SomeThing Wrong ");
      }
    } catch (err) {
      console.error(err);
      alert("ERROR ");
    } finally {
      setLoading(false);
    }
  };

    return(
        <>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
                ← BACK
        </button> 

        <div className="checkout-container">
      <div className="shipping-details">
        <h2>DELIVERY INFO : </h2>
        <form onSubmit={handleSubmit} className="checkout-form">
          <input
            type="text"
            name="customerName"
            placeholder="Full Name..."
            required
            className="checkout-input"
            value={formData.customerName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email..."
            required
            className="checkout-input"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone..."
            required
            className="checkout-input"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Address..."
            required
            className="checkout-input"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            type="text"
            name="city"
            placeholder="City..."
            required
            className="checkout-input"
            value={formData.city}
            onChange={handleChange}
          />

          <div className="payment-section">
            <h3>Payment Method </h3>
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="CASH_ON_DELIVERY"
                checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                onChange={handleChange}
              />
            (Cash on Delivery)
            </label>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || cartItems.length === 0}
          >
            {loading ? 'Confrmig....' : 'ORDERED'}
          </button>
        </form>
      </div>

      <div className="order-summary">
        <h3>Order Info : </h3>
        <div className="summary-items">
          {safeCartItems.map((item) => (
            <div key={item.id} className="summary-item">
                <img 
                    src={item.imageUrl || item.image || '/path/to/placeholder.jpg'} 
                    alt={item.name} 
                    className="item-image-placeholder"
                    style={{width :"60px",height:"60px",borderRadius:"8px",objectFit:"cover"}}
                  />
              <span>{item.name} (x{item.quantity})</span>
              <span>{item.price * item.quantity} EGP</span>
              
            </div>
          ))}
        </div>
        
        <div className="summary-row">
          <span>SubTotal </span>
          <span>{subtotal} EGP</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>{shippingFee} EGP</span>
        </div>
        
        <hr className="summary-divider" />
        
        <div className="summary-total">
          <span>Total : </span>
          <span>{total} EGP</span>
        </div>
      </div>
    </div>
     </>
  );
}
