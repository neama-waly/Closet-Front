import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../App.css";
import { useNavigate} from "react-router-dom";

    const ORDER_STEPS = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];
    
    const STEP_LABELS = {
        PENDING: "Order Placed",
        SHIPPED: "Shipped",
        DELIVERED: "Delivered",
        CANCELLED : "Cancelled",
    };

function TrackOrder(){
    const navigate = useNavigate();
    
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    fetch("https://closet-back-end.vercel.app/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, [token]);

    const getStepIndex = (status) => {
    const normalized = status?.toUpperCase() || "PENDING";
    const index = ORDER_STEPS.indexOf(normalized);
    return index !== -1 ? index : 0;
  };

  if (loading) {
    return (
      <div className="track-container loading-state">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

    return(
        <div className="track-container">
            <button className="icon-btn" onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
            ← BACK
        </button> 
      <div className="track-header">
        <h2>Track Your Orders 📦</h2>
        <p>Real-time status updates for your CLOSET orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const currentStep = getStepIndex(order.status);

            return (
              <div key={order.id} className="order-card">
               
                <div className="order-card-header">
                  <div>
                    <span className="order-id">Order #{order.id.slice(-6).toUpperCase()}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <span className={`status-badge status-${order.status?.toLowerCase() || "pending"}`}>
                    {STEP_LABELS[order.status] || order.status}
                  </span>
                </div>

                <div className="timeline-container">
                  <div className="timeline-track">
                    <div
                      className="timeline-progress"
                      style={{
                        width: `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="timeline-steps">
                    {ORDER_STEPS.map((step, index) => {
                      const isCompleted = index <= currentStep;
                      const isActive = index === currentStep;

                      return (
                        <div
                          key={step}
                          className={`step-item ${isCompleted ? "completed" : ""} ${
                            isActive ? "active" : ""
                          }`}
                        >
                          <div className="step-circle">{isCompleted ? "✓" : index + 1}</div>
                          <span className="step-text">{STEP_LABELS[step]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="order-items-list">
                  <h4>Order Items ({order.items?.length || 0})</h4>
                  {order.items?.map((item) => {
                    const productImg =
                      item.product?.images?.[0] || item.product?.image || "/placeholder.png";

                    return (
                      <div key={item.id} className="order-item">
                        <img src={productImg} alt={item.product?.title || "Product"} />
                        <div className="item-details">
                          <h5>{item.product?.title || "Product Item"}</h5>
                          <div className="item-specs">
                            {item.size && <span className="spec-tag">Size: {item.size}</span>}
                            {item.color && <span className="spec-tag">Color: {item.color}</span>}
                            <span className="spec-tag">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="item-price-calc">
                          {(item.price * item.quantity).toLocaleString()} EGP
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="order-card-footer">
                  <div className="shipping-info">
                    <small>Shipping to: {order.city || order.address || "Address provided"}</small>
                  </div>
                  <div className="total-price">
                    <span>Total Amount:</span>
                    <strong>{Number(order.totalAmount).toLocaleString()} EGP</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default TrackOrder ;