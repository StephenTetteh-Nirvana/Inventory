import { Plus,Search,ChevronUp,ChevronDown, Pointer } from "lucide-react"
import "../css/ProductsTable.css"
import { useState } from "react"
import AddNewProduct from "./AddNewProduct"

const ProductsTable = () => {
    const [newProductPopup,setProductPopup] = useState(false)
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
              <option>Available</option>
              <option>Out of Stock</option>
            </select><span className="select-span">{dropDown ? <ChevronUp /> : <ChevronDown />}</span>
            </div>

            <div className="add-product" onClick={toggleProductPopup}>
                <button>Add New Product</button><span><Plus style={{color:"white",cursor:"pointer"}}/></span>
            </div>
         </div>
        <h1>Products</h1> 
        {newProductPopup && <AddNewProduct productPopup={newProductPopup} setProductPopup={setProductPopup}/>}
    </div>
  )
}

export default ProductsTable;
