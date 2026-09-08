import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

const api_url = "http://localhost:5010/api";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            const res = await fetch(`${api_url}/auth/login`,{
                method : "POST",
                headers : {"Content-Type": "application/json"},
                body : JSON.stringify({email,password}),
            });
            const data = await res.json();
            if(!res.ok) throw new Error (data.message || "Login failed");

            const localCart = JSON.parse(localStorage.getItem("closet_cart")) || [];
            if (localCart.length > 0) {
                try {
                    await fetch(`${api_url}/cart/merge`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${data.token}`,
                        },
                        body: JSON.stringify({ localItems: localCart }),
                    });

                    localStorage.removeItem("closet_cart");
                } catch (mergeErr) {
                    console.error("Failed to merge cart:", mergeErr);
                }
            }
            login(data.user, data.token);
            navigate("/");

            
        }catch(err){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    };



    return(
        <>
          <button className="icon-btn" onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
                ← BACK
            </button> 
        <div className="auth-container">

      <form onSubmit={handleSubmit} className="auth-form">
        <h2>CLOSET LOGIN</h2>
        {error && <p className="error-msg">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create One</Link>
        </p>
      </form>
    </div>

        </>
    )
}
export default Login ;