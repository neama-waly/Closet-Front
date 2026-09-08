import "../App.css"
import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
const api_url = "https://closet-back-end.vercel.app/api";

function Search({ isOpen, onClose }){

    const navigate = useNavigate();
    const [searchTrim , setSearchTrim] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${api_url}/products`);
          const data = await res.json();
          setProducts(data);
        } catch (error) {
          console.error("Error fetching products for search:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
    if (onClose) onClose();
    

    }
    const filteredProducts = searchTrim.trim() === "" 
    ? [] 
    : products.filter((pro) =>
        pro.title.toLowerCase().includes(searchTrim.toLowerCase()) ||
        (pro.description && pro.description.toLowerCase().includes(searchTrim.toLowerCase()))
      );

  const handleSubmit= (productId) => {
    handleClose();
    navigate(`/product/${productId}`);
  };

    return(
   <div className="search-overlay" onClick={handleClose}>
      <div className="search-drawer" onClick={(e) => e.stopPropagation()}>
        
        <div className="search-header">
          <h3>SEARCH PRODUCTS</h3>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Type to search (e.g., Jacket, T-Shirt)..."
            value={searchTrim}
            onChange={(e) => setSearchTrim(e.target.value)}
            autoFocus
          />
          {searchTrim && (
            <button 
              type="button" 
              className="clear-search-btn" 
              onClick={() => setSearchTrim("")}
            >
              ✕
            </button>
          )}
        </div>

        
        <div className="search-results">
          {loading && <p className="search-status">Loading products...</p>}

          {!loading && searchTrim.trim() !== "" && filteredProducts.length === 0 && (
            <p className="search-status">No products found matching "{searchTrim}"</p>
          )}

          {!loading && filteredProducts.length > 0 && (
            <div className="results-list">
              {filteredProducts.map((pro) => (
                <div 
                  key={pro.id} 
                  className="search-item"
                  onClick={() => handleSubmit(pro.id)}
                >
                  <img 
                    src={pro.images && pro.images.length > 0 ? pro.images[0] : ""} 
                    alt={pro.title} 
                  />
                  <div className="search-item-info">
                    <h4>{pro.title}</h4>
                    <p className="search-item-price">{pro.price} EGP</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Search;