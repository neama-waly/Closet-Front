import { useState , useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../App.css";
const api_url = "http://localhost:5010/api";
function ProductDetails(){

    const {id} = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${api_url}/products/${id}`);
                const data = await res.json();
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setSelectedImage(data.images[0]);
                }
                if (data.sizes && data.sizes.length > 0) {
                    setSelectedSize(data.sizes[0]);
                }
                if (data.colors && data.colors.length > 0) {
                    setSelectedColor(data.colors[0]);
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
        alert("Please select a size and color first!");
        return;
    }
        addToCart(product, selectedSize, selectedColor, 1);
        alert("Added to cart successfully!");
    };
    if (loading) return <p style={{ textAlign: "center", padding: "50px" }}>LOADING PRODUCT DETAILS...</p>;
    if (!product) return <p style={{ textAlign: "center", padding: "50px" }}>PRODUCT NOT FOUND</p>;
    return(
        <div className="container2">
            <button className="icon-btn" onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
                ← BACK
            </button>     

            <div className="product-details-container">
            <div className="product-details-wrapper">
                <div className="main-image-box">
                    <img 
                            src={selectedImage || (product.images && product.images[0]) || null } 
                            alt={product.title}/>
                </div>    
                <div className="thumbnails">
                    {product.images?.map((img, idx) => (
                            <img 
                                key={idx} 
                                src={img} 
                                alt="" 
                                onClick={() => setSelectedImage(img)}
                                style={{ 
                                    width: "70px", 
                                    height: "70px", 
                                    objectFit: "cover", 
                                    cursor: "pointer",
                                    border: selectedImage === img ? "2px solid #111" : "1px solid #ccc" 
                                }}
                            />
                        ))}
                </div>
            </div>   
            <div className="details-info">
                <span className="category">{product.category?.name}</span>
                    <h2 >{product.title}</h2>
                    <p >{product.price} EGP</p>
                    <p >{product.description}</p>
                {product.sizes && product.sizes.length > 0 && (
                        <div className="option-section">
                            <h4>SELECT SIZE:</h4>
                            <div className="options-grid">
                                {product.sizes.map((size) => (
                                    <button 
                                        key={size}
                                        className={`option-btn ${selectedSize === size ? "selected" : ""}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                                {product.colors && product.colors.length > 0 && (
                        <div className="option-section">
                            <h4>SELECT COLOR:</h4>
                            <div className="options-grid">
                                {product.colors.map((color) => (
                                    <button 
                                        key={color}
                                        className={`option-btn ${selectedColor === color ? "selected" : ""}`}
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                            </div>
                        </div>
                    )}
                    <button className="add-to-card-btn"
                    onClick={handleAddToCart}
                    disabled = {product.stock <= 0} >
                        {product.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                    </button>
            </div>
        </div>
    </div>
        
    );
}
export default ProductDetails;