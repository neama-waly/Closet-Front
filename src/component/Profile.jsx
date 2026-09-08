import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

function Profile({ isOpen, onClose }) {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    if (!isOpen ) return null;

    const handleLogout = () => {
        logout();
        if (onClose) onClose();
        navigate("/login");
    };

    const handleNavigateDashboard = () => {
        if (onClose) onClose();
        navigate("/dashboard");
    };

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                <div className="profile-header">
                    <h3>MY PROFILE</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="profile-body">
                    <div className="avatar-circle">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <h4 className="user-name">{user.name}</h4>
                    <p className="user-email">{user.email}</p>
                    <span className="user-badge">{user.role || (isAdmin ? "ADMIN" : "USER")}</span>
                </div>

                <div className="profile-actions">
                    {isAdmin && (
                        <button className="profile-btn admin-btn" onClick={handleNavigateDashboard}>
                            🛠️ ADMIN DASHBOARD
                        </button>
                        
                    )}
                    <button className="profile-btn admin-btn"
                    onClick={()=>navigate("/TrackOrder")}
                    >
                        Track Your Order
                    </button>
                    <button className="profile-btn logout-btn" onClick={handleLogout}>
                        🚪 LOGOUT
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;