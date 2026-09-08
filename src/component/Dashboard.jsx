import { useEffect, useState ,useRef} from "react";
import { useNavigate} from "react-router-dom";
import "../App.css"
const api_url = "https://closet-back-end.vercel.app/api";

function Dashboard(){
    const navigate = useNavigate();
    const[products , setProducts] = useState([]);
    const[categories , setCategories] = useState([]);
    const[title , setTitle] = useState('');
    const[description , setDescription] = useState('');
    const[price , setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [stock , setStock] = useState("")
    const [sizes, setSizes] = useState(""); 
    const [colors, setColors] = useState("");
    const [images, setImages] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const fileInputRef = useRef(null);
    const productsRef = useRef(null);

    const fetchData = async()=>{
        try{
            const catRes = await fetch(`${api_url}/categories`);
            const proRes = await fetch(`${api_url}/products`);

            const catData = await catRes.json();
            const proData = await proRes.json();

            setCategories(catData);
            setProducts(proData);
        }catch(error){
            console.log("error fetching data ",error);
        }
    }
    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    },[])

    const resetProductForm = () => {
        setTitle('');
        setDescription('');
        setPrice('');
        setStock('');
        setSizes('');
        setColors('');
        setCategoryId('');
        setImages([]);
        setEditingProductId(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; 
        }
    };

    const handleAddCategory = async(e)=>{
        e.preventDefault();
        if(!newCategoryName) return;
    
        try{
        const res = await fetch(`${api_url}/categories`,{
            method : "POST" ,
            headers : {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({name : newCategoryName})
        });
        if(!res.ok) throw new Error("ERROR ADD CATEGORY ");
        setNewCategoryName("");
        fetchData();
         }catch(error){
            console.log("ERROR APPEND CATEGORY ",error);
    }
}

    const handleProductSubmit = async(e)=>{
        e.preventDefault();
        if(!title || !price ||!categoryId){
            alert("ALL ARE PROVIDED ")
            return;
        }
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('categoryId', categoryId);
        formData.append('stock', stock);


        const sizesArray = sizes ? sizes.split(",").map(s => s.trim()) : [];
        const colorsArray = colors ? colors.split(",").map(c => c.trim()) : [];
        formData.append('sizes', JSON.stringify(sizesArray));
        formData.append('colors', JSON.stringify(colorsArray));



        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]); 
        }
        try{
            const isEditing = editingProductId !== null;
            const url = isEditing 
                ? `${api_url}/products/${editingProductId}` 
                : `${api_url}/products`;
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                body: formData
            });

            if (!res.ok) throw new Error(isEditing ? "ERROR UPDATING PRODUCT" : "ERROR ADD PRODUCT");

            resetProductForm();
            fetchData();
        }catch(error){
            console.log("ERROR SUBMITTING PRODUCT", error);
        }
    };
    const handleEditClick = (product) => {
        setEditingProductId(product.id);
        setTitle(product.title || '');
        setDescription(product.description || '');
        setPrice(product.price || '');
        setStock(product.stock || '');
        setCategoryId(product.categoryId || '');
        setSizes(product.sizes ? product.sizes.join(", ") : '');
        setColors(product.colors ? product.colors.join(", ") : '');
        setImages([]); 
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; 
        }
    };
    const handleDeleteProduct = async(id)=>{
        if(!window.confirm("ARE YOU SURE TO DELETE THIS PRODUCT ?")) return;
        try{
            const res = await fetch(`${api_url}/products/${id}`,{
                method : "DELETE"
            });
            if(!res.ok) throw new Error("ERROR DELETING PRODUCT ");
            fetchData();

        }catch(error){
            console.log("ERROR DELETING PRODUCT ",error);
        }
    }
    const handleDeleteCategory = async(id)=>{
        if(!window.confirm("ARE YOU SURE TO DELETE THIS CATEGORY ?")) return;
        try{
            const res = await fetch(`${api_url}/categories/${id}`,{
                method : "DELETE"
            });
            if(!res.ok) throw new Error("ERROR DELETING CATEGORY ");
            fetchData();

        }catch(error){
            console.log("ERROR DELETING CATEGORY ",error);
        }
    }
    const scrollToProducts = (product) => {
        productsRef.current?.scrollIntoView({ behavior: "smooth" });
        handleEditClick(product);
    };
    return(
        <div className="dashboard">
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
                ← BACK
            </button>  
        <h1>CLOSET - ADMIN Dashboard</h1>
            <section>
                <h3>ADD CATEGORY</h3>
                <form onSubmit={handleAddCategory}>
                    <input
                    type="text"
                    placeholder="CATEGORY NAME "
                    value={newCategoryName}
                    onChange={(e)=> setNewCategoryName(e.target.value)}
                    />
                    <button type="submit">
                        ADD
                    </button>
                </form>
            </section>
            <section>
                <h3>{editingProductId ? "EDIT PRODUCT" : "ADD PRODUCT"}T</h3>
                <form onSubmit={handleProductSubmit} ref={productsRef}>
                    <input
                    type="text"
                    placeholder="PRODUCT TITLE "
                    value={title}
                    onChange={(e)=> setTitle(e.target.value)}
                    />
                    <textarea
                    placeholder="PRODUCT DESCRIPTIPN"
                    value={description}
                    onChange={(e)=> setDescription(e.target.value)}/>
                    <input
                    type="number"
                    placeholder="price (EGP)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    />
                    <input
                    type="number"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    />        
                    <input
                        type="text"
                        placeholder="SIZES (comma separated, e.g. S, M, L, XL)"
                        value={sizes}
                        onChange={(e) => setSizes(e.target.value)}
                    />
                      <input
                        type="text"
                        placeholder="COLORS (comma separated, e.g. Black, White, Navy)"
                        value={colors}
                        onChange={(e) => setColors(e.target.value)}
                    />          
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}>

                    <option value="">Choose category...</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={(e) => setImages(Array.from(e.target.files))} 
                     />
                    <button type="submit">{editingProductId ? "UPDATE PRODUCT" : "ADD PRODUCT"}</button>
                    {editingProductId && (
                        <button type="button" onClick={resetProductForm} style={{ marginLeft: "10px" }}>
                            CANCEL
                        </button>
                    )}
                </form>
            </section>
            <section>
                <h3>CURRENT PRODUCTS ({products.length})</h3>
                {products.length === 0 ? (
                    <p>NO PRODUCTS YET</p>
                ):(
                    <div>
                        {products.map((product)=>(
                            <div key={product.id} style={{ marginBottom: "20px" }} >
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                                    {product.images && product.images.length > 0 ? (
                                        product.images.map((imgUrl, index) => (
                                            <img
                                                key={index}
                                                src={imgUrl}
                                                alt={`${product.title}-${index}`}
                                                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                                            />
                                        ))
                                    ) : (
                                        <p>{product.title}</p>
                                    )}
                                </div>
                                <h4>{product.title}</h4>
                                <p>{product.description}</p>
                                <p><strong>Price : </strong> {product.price} EGP</p>
                                <p>Category: {product.category?.name || 'undefined'}</p>
                                <p>Stock : {product.stock}</p>
                                <p><strong>Sizes: </strong> {product.sizes?.join(", ") || 'N/A'}</p>
                                <p><strong>Colors: </strong> {product.colors?.join(", ") || 'N/A'}</p>
                                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                    <button onClick={() => scrollToProducts(product)}>
                                        EDIT
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        style={{ backgroundColor: "red", color: "white" }}
                                    >
                                        DELETE
                                    </button>
                                </div>

                                <p style={{borderBottom : "2px solid black"}}></p>


                            </div>
                        ))}
                    </div>
                )}
                <h3>CURRENT CATEGORIES ({categories.length})</h3>
                {categories.length === 0 ? 
                (<p>NO CATEGORIES YET </p>):
                    <div>
                    {categories.map((cat)=>(<div key={cat.id}>
                         <p>{cat.name}</p>
                         <button 
                                onClick={() => handleDeleteCategory(cat.id)}
                            style={{ backgroundColor: "red", color: "white", cursor: "pointer" }}
                        >
                         DELETE
                        </button>

                    </div>))}
                    </div>}

            </section>
            <button
            onClick={()=>navigate("/AdminOrders")}
            className="add-to-card-btn"
            >ORDERS</button>
        </div>
    )
    
}

export default Dashboard ;