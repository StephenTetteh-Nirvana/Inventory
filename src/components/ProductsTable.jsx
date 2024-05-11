import { Plus,ChevronUp,ChevronDown } from "lucide-react"
import "../css/ProductsTable.css"
import {  useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AllProducts from "./AllProducts"
import OutOfStock from "./OutOfStock"
import NewUnit from "./NewUnit"

const ProductsTable = ({data,fetchProducts}) => {
  // const productData = localStorage.getItem("products") !== null ? JSON.parse(localStorage.getItem("products")) : []
  const [ProductState,setProductState] = useState("All")
  const [dropDown,setdropDown] = useState(false)
  const [newUnit,setNewUnit] = useState(false)

  const toggleSelect = () =>{
    setdropDown(!dropDown)
  }
  const checkProductState = (value) =>{
    console.log(value)
    setProductState(value)
  }
  
  const NewUnitPopUp = () => {
     setNewUnit(true)
  }

  // Search Functionality
  // const handleFilter = (e)=> {
  //   const value = e.target.value;
  //   console.log(value)
  //   filterProducts(value)
  // }

  // const filterProducts = (value) => {
  //    const filteredProducts = productData.filter((p)=>p.product.includes(value))
  //    localStorage.setItem("products",JSON.stringify(filteredProducts))
  // }

  useEffect(()=>{
    fetchProducts()
  })

  return (
    <div className="products-table">
      <div className="search-and-add-section">
        <div className="products-search-section">
          {/* <span className="search-span"><Search /></span>
          <input type="text" placeholder="Search by name..." onChange={handleFilter}/> */}
          <select onClick={toggleSelect} onChange={(e) => checkProductState(e.target.value)}>
            <option>All</option>
            <option>Out of Stock</option>
          </select><span className="select-span">{dropDown ? <ChevronUp /> : <ChevronDown />}</span>
        </div>

        <div className="units-section">   
          <div>
            <button className="allUnits-btn">See All Units</button>
          </div>
          <div>
            <button className="newUnit-btn" onClick={NewUnitPopUp}>Add New Unit</button>
          </div>
          <Link to="/dashboard/add">
          <div className="add-product">
            <button>Add New Product</button>
          </div>
          </Link>
        </div>
      </div>
        <div className="products-header">
        <ul>
          <li>Id</li>
          <li>Product</li>
          <li>Measurement</li>
          <li>Unit Price</li>
          <li>Stock Level</li>
          <li>Category</li>
          <li>Brand</li>
          <li>Actions</li>
        </ul>
        </div>
        {ProductState === "All" ? (
        <div>
          { data.length > 0 ? (<AllProducts />) : (
              <h3>No products yet!!!</h3>
            )
          }
          
        </div>
        ) 
        : 
        (<OutOfStock/>)
        }
        {newUnit && <NewUnit setNewUnit={setNewUnit}/>}
    </div>
  )
}

export default ProductsTable;
