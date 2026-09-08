import "../App.css"
import { useRef, useState , useEffect } from "react";
import face from "../assets/profile-image-1348-svgrepo-com.svg"
import card from "../assets/cart-check-svgrepo-com.svg"
import search from "../assets/search-svgrepo-com-2.svg"
import model from "../assets/Gemini_Generated_Image_fp6fxlfp6fxlfp6f.jpg"
import whatsapp from "../assets/whatsapp-whats-app-svgrepo-com.svg"
import instagram from "../assets/instagram-svgrepo-com.svg"
import facebook from "../assets/facebook-svgrepo-com.svg"
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Profile from "./Profile";

const api_url = "http://localhost:5010/api";

function Home(){
    const navigate = useNavigate();
    const { cart } = useCart();
    const { user } = useAuth();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const [isProfileOpen, setIsProfileOpen] = useState(false);


    const productsRef = useRef(null);
    const scrollToProducts = () => {
        productsRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const [products , setProducts] = useState([]);
    const [categories , setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [loading, setLoading] = useState(true);

   
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [proRes, catRes] = await Promise.all([
                    fetch(`${api_url}/products`),
                    fetch(`${api_url}/categories`)
                ]);

                const proData = await proRes.json();
                const catData = await catRes.json();

                setProducts(proData);
                setCategories(catData);
            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    const filteredProducts = selectedCategory === "ALL"
        ? products
        : products.filter((item) => item.categoryId === selectedCategory);

    
    return(
        <>
        <div className="container">
            <div className="title">
                <div className="actions">
                    <div className="icon-group">
                        
                        <button className="icon-btn" onClick={()=> navigate("/Search")}>
                            <img src={search}/>
                        </button>
                    </div>
                    <h3 className="address">CLOSET</h3>
                    <div className="icon-group">
                        <button className="icon-btn left" 
                        onClick={() => {
                                    if (!user) {navigate("/login");}
                                    else {setIsProfileOpen(true); }
                                }}    
                        >
                            <img src={face}/>
                        </button>
                    <button className="icon-btn left cart-btn-container" onClick={() => navigate("/Cart")}>
                    <img src={card} />
                    {totalItems > 0 && (
                        <span className="cart-badge">{totalItems}</span>
                    )}
                        </button>                       
                    </div>
                    </div>
                </div>
                <div className="banner">
                    <img src={model}/>
                    <div className="banner-text">
                    <h2>WELCOME</h2>
                    <p>READY TO SEE THE NEW COLLECTION ?</p>
                    <button
                    onClick={scrollToProducts}
                    >SHOP NOW</button>                        
                    </div>
               </div> 
               
            {/* Category Filter Buttons */}
            <div className="catDiv">
                <button
                    onClick={() => setSelectedCategory("ALL")}
                    className="catOptions"
                    style={{background: selectedCategory === "ALL" ? "#111" : "#fff",
                    color: selectedCategory === "ALL" ? "#fff" : "#111",}}>
                    ALL
                </button>
                {categories.map((cat) => (
                    <button className="catOptions"
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        style={{
                            background: selectedCategory === cat.id ? "#111" : "#fff",
                            color: selectedCategory === cat.id ? "#fff" : "#111",
                        }}
                    >
                        {cat.name.toUpperCase()}
                    </button>
                ))}
            </div>

               <p style={{fontSize : "20px" , letterSpacing :"3px"}}>New arraivals :</p>
               {loading ? (
                <p>LOADING PRODUCTS...</p>
               ):( 

                    <main className="products" ref={productsRef}>
                    {filteredProducts.map((pro) => (
                        <div key={pro.id} className="product">
                        <div className="product-image-wrapper"
                        onClick={()=>navigate(`/product/${pro.id}`)}
                        style={{cursor:"pointer"}}>
                            <img 
                            src ={pro.images && pro.images.length > 0 
                                        ? pro.images[0] 
                                    : null} 
                                        alt={pro.title}/>
                        </div>
                        <div className="product-info">
                            <span className="category">{pro.category.name}</span>
                            <h4 className="product-name"
                            onClick={()=>navigate(`/product/${pro.id}`)}
                            style={{cursor:"pointer"}}
                            >{pro.title}</h4>
                            <p>{pro.description}</p>
                            <p className="price">{pro.price} EGP</p>
                            <div className="colors-container" style={{ display: "flex", gap: "5px", margin: "10px 0" }}>
                            {pro.colors && pro.colors.map((col, index) => (
                            <button 
                            key={index}
                             className="colorsHome"
                             title={col}
                            style={{ backgroundColor: col.toLowerCase() }}
                             >
                            </button>
                            ))}
                        </div>
                            <button className="add-to-card-btn"
                            onClick={()=>navigate(`/product/${pro.id}`)}
                            > SHOW DETAILS</button>
            
                        </div>
                       </div> 
                    ))}
                    
               </main>
               )}

               <footer className="footer">
                
                <div className="rightFooter">
                    <h3>About US : </h3>
                    <p>In Our brand We hope you find your Favourite Style But We Sure you will find the Perfect material and the most comfortable </p>                    
                </div>
                
                <div className="leftFooter">
                    <h3>CONTACT :</h3>
                    <p>Numbers : +20 103040402</p>
                    <div className="socialmedia">
                    <a href=""><img src={whatsapp}/></a>
                    <a href=""><img src={instagram}/></a>
                    <a href=""><img src={facebook}/></a>                    
                </div>

                    </div>
               </footer>

        </div>
        <Profile 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
            />
        </>
    )
}
export default Home ;
