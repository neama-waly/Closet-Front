import "../App.css"
import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";

const api_url = "http://localhost:5010/api";

export default function OrderSuccess(){

    const { token } = useAuth();
    const location = useLocation();
    const orderId = location.state?.orderId;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        if(orderId){
            fetch(`${api_url}/orders/${orderId}`,{
              headers: { Authorization: `Bearer ${token}` }
            })
            .then((res)=> res.json())
            .then((data)=>{
                setOrder(data);
                setLoading(false);
            })
            .catch((err)=>{
                console.error(err);
                setLoading(false);
            })
        }else{
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(false)
        }
    },[orderId, token])
    if (loading) return <div className="loading-state">Loading order details...</div>;

    return(
        <>
        <div className="success-container">
      <div className="success-icon">✓</div>
      <h1>Thank You For Your Order!</h1>
      <p className="success-subtitle">We have received your order and are processing it.</p>

      {order ? (
        <div className="order-card">
          <div className="order-header">
            <div>
              <span>Order ID:</span>
              <strong> #{order.id}</strong>
            </div>
            <div className={`status-badge ${order.status.toLowerCase()}`}>
              Status: {order.status}
            </div>
          </div>

          <hr />

          <div className="order-details-grid">
            <div>
              <h3>Shipping Address</h3>
              <p>{order.customerName}</p>
              <p>{order.address}, {order.city}</p>
              <p>{order.phone}</p>
            </div>
            <div>
              <h3>Payment Info</h3>
              <p>Method: {order.paymentMethod}</p>
              <p>Total: <strong>{order.totalAmount} EGP</strong></p>
            </div>
          </div>

          <div className="order-items-list">
            <h3>Items Ordered</h3>
            {order.items?.map((item) => (
              <div key={item.id} className="order-item-row">
                <span>Qty: {item.quantity}</span>
                <span>Price: {item.price} EGP</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Order reference not found.</p>
      )}

      <Link to="/" className="home-btn">Continue Shopping</Link>
    </div>
    </>
  );
}