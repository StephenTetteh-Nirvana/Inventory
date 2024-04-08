import { Plus,Search,ChevronUp,ChevronDown } from "lucide-react"
import "../css/ProductsTable.css"
import { useState } from "react"
import { Link } from "react-router-dom"

const ProductsTable = () => {
    const [dropDown,setdropDown] = useState(false)

  const toggleProductPopup = () =>{
      setProductPopup(true)
  }
  const toggleSelect = () =>{
    setdropDown(!dropDown)
  }
  return (
    <div className="products-table">
         <div className="search-and-add-section">
            <div className="products-search-section">
            <span className="search-span"><Search /></span><input type="text" placeholder="Search by name..."/>
            <select onClick={toggleSelect}>
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
        <h1>Products</h1> 
    </div>
  )
}

export default ProductsTable;
