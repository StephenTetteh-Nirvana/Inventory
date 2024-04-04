import { Plus,Search } from "lucide-react"
import "../css/ProductsTable.css"

const ProductsTable = () => {
  return (
    <div className="products-table">
         <div className="search-and-add-section">
            <div className="products-search-section">
            <span><Search /></span><input type="text" placeholder="Search..."/>
            </div>

            <div className="add-product">
                <button>Add New Product</button><span><Plus style={{color:"white"}}/></span>
            </div>
         </div>
        <h1>Products</h1> 
    </div>
  )
}

export default ProductsTable;
