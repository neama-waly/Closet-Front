import { Route, Routes , useNavigate } from "react-router-dom";
import "./App.css"
import Home from "./component/Home"
import Dashboard from "./component/Dashboard"
import ProductDetails from "./component/ProductDetails";
import Cart from "./component/Cart"
import Search from "./component/Search"
import Login from "./component/Login";
import Signup from "./component/Signup";
import ProtectedRoute from "./component/ProtectedRoute";
import Checkout from "./component/Checkout";
import OrderSuccess from "./component/OrderSuccess"
import AdminOrders from "./component/AdminOrders";
import TrackOrder from "./component/TrackOrder"
import { useCart } from "./context/CartContext";
function App(){
    const navigate = useNavigate();
      const { cart, clearCart } = useCart();
    return(
        <>
        <Routes>
            <Route path="/" element={< Home/>}/>

            <Route path="/product/:id" element={< ProductDetails />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/Cart" element={<Cart isOpen={true} onClose={() => {navigate("/")}} />} />
            <Route path="/Search" element={<Search isOpen={true} onClose={() => {navigate("/")}} />} />
            <Route path="/Checkout" element={<Checkout cartItems={cart} clearCart={clearCart} />} />
            <Route path="/OrderSuccess" element={<OrderSuccess />} />
            <Route path="/TrackOrder" element={<TrackOrder />} />
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/AdminOrders" element={<AdminOrders />} />
            </Route>

        </Routes>
        
        </>
    )
}
export default App ;
