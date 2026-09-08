import "../App.css" ;
import { useEffect , useState,useCallback } from "react";
import { useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const api_url = "https://closet-back-end.vercel.app/api";

export default function AdminOrders(){
    const navigate = useNavigate();
    const { token } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

   const fetchOrders = useCallback(async () => {
  if (!token) {
    setLoading(false);
    return;
  }
  try {
    const res = await fetch(`${api_url}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : data.orders || data.data || []);
  } catch (err) {
    console.error(err);
    setOrders([]);
  } finally {
    setLoading(false);
  }
}, [token]);

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchOrders();
}, [fetchOrders]); 

        const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${api_url}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization : `Bearer ${token}` 
        
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
        console.error(err);
        alert("Error updating status");
        }
        };

  if (loading) return <div>Loading orders...</div>;


    return(
        <>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
            ← BACK
        </button> 
        <div className="admin-orders-container" style={{ padding: "20px" }}>
      <h2>Admin - Orders Management</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>City</th>
            <th>Total</th>
            <th>Status</th>
            <th>Change Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orders) && orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id.slice(0, 8)}</td>
              <td>{order.customerName}</td>
              <td>{order.phone}</td>
              <td>{order.city}</td>
              <td>{order.totalAmount} EGP</td>
              <td>
                <strong className={`status-${order.status?.toLowerCase()}`}>
                  {order.status}
                </strong>
              </td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </>
    )
}

