import { ShoppingBasket,Warehouse,CircleDollarSign,ShoppingCart } from "lucide-react"
import "../css/InventoryStats.css"

const InventoryStats = () => {
   const productData = localStorage.getItem("products") !== null ? JSON.parse(localStorage.getItem("products")) : []
  //  const totalAmount = localStorage.getItem("totalAmount") !== null ? JSON.parse(localStorage.getItem("totalAmount")) : []
   const OutOfStock = localStorage.getItem("OutOfStock") !== null ? JSON.parse(localStorage.getItem("OutOfStock")) : []
   const warehouses = localStorage.getItem("warehouses") !== null ? JSON.parse(localStorage.getItem("warehouses")) : []



  return (
    <div className="inventoryStats-container">
      <div className="all-stats-container">
        <div className="first-inventory-stat">
            <ShoppingBasket size={50}/>
            <div>
             <h3>Products</h3>
             <h2>{productData.length}</h2>
            </div>
        </div>
        <div className="second-inventory-stat">
            <CircleDollarSign style={{marginTop:3}} size={50}/>
            <div>
             <h3>Total Amount</h3>
             <h2>$0.00</h2>
            </div>
        </div>
        <div className="third-inventory-stat">
            <ShoppingCart size={50}/>
            <div>
             <h3>Out Of Stock</h3>
             <h2>{OutOfStock.length}</h2>
            </div>
        </div>
        <div className="fourth-inventory-stat">
            <Warehouse size={40}/>
            <div>
             <h3>Warehouses</h3>
             <h2>{warehouses.length}</h2>
            </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryStats
