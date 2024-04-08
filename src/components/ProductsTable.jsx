import { Plus,Search,ChevronUp,ChevronDown } from "lucide-react"
import "../css/ProductsTable.css"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { db } from "../firebase"
import {collection,onSnapshot,doc } from "firebase/firestore"

const ProductsTable = () => {
  const list = localStorage.getItem("products") !== null ? (JSON.parse(localStorage.getItem("products"))) : []

  const [data,setData] = useState([])
  const [ProductState,setProductState] = useState("All")
  const [dropDown,setdropDown] = useState(false)

  const toggleSelect = () =>{
    setdropDown(!dropDown)
   
  }
  const checkProductState = (value) =>{
    console.log(value)
    setProductState(value)

  }
  const fetchProducts = async() =>{
    const colRef = collection(db,"Products")
    const unsub = onSnapshot(doc(colRef,"Product Arrays"), (snapshot) => {
      try {
        let list = null;
        list = snapshot.data().products;
        setData(list);
        localStorage.setItem("products",JSON.stringify(list))
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
  });
  return unsub;
  }

  useEffect(()=>{
    fetchProducts()
    setData(list)
  },[])
  return (
    <div className="products-table">
         <div className="search-and-add-section">
            <div className="products-search-section">
              <span className="search-span"><Search /></span><input type="text" placeholder="Search by name..."/>
              <select onClick={toggleSelect} onChange={(e) => checkProductState(e.target.value)}>
                <option>All</option>
                <option>Out of Stock</option>
              </select><span className="select-span">{dropDown ? <ChevronUp /> : <ChevronDown />}</span>
            </div>
             
             <Link to="/dashboard/add">
             <div className="add-product">
                <button>Add New Product</button><span><Plus style={{color:"white",cursor:"pointer"}}/></span>
            </div>
             </Link>
         </div>
         
         <div className="products-header">
          <ul>
            <li>Id</li>
            <li>Product</li>
            <li>Price</li>
            <li>Quantity</li>
            <li>Total Value</li>
            <li>Actions</li>
          </ul>
         </div>
         {ProductState === "All" ? (
          <div>
            { data.length > 0 ? (
                data.map((product,index)=>(
                  <div key={index}>
                    <h3>{product.product}</h3>
                  </div>
                ))
              ) : (
                <h1>No Products</h1>
              )
            }
            
          </div>
         ) 
         : 
         ("Out Of Stock")}
    </div>
  )
}

export default ProductsTable;
