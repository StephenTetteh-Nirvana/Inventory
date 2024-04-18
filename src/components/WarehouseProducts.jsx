import { X } from "lucide-react"
import "../css/WarehouseProduct.css"
import noImg from "../images/camera-off.png"


const WarehouseProducts = ({products,setViewProducts}) => {

  const closeProductsList = () =>{
    setViewProducts(false)
  }


  return (
    <div className="warehouse-products-container">
       <div className="warehouse-products">
        <div onClick={closeProductsList} style={{display:"flex",justifyContent:"space-between"}}>
        <h2>Products List</h2>
         <X size={25} style={{color:"black",cursor:"pointer"}}/>
        </div>
         <ul>
          <li>Product</li>
          <li>Name</li>
          <li>Price</li>
          <li>Quantity</li>
          <li>Date Created</li>
         </ul>
         <div>
          {products && products.length > 0 ? (
              products.map((product,index)=>(
                <div className="warehouse-product" key={index}>
                   <div className="ImageBox">
                    <img src={product.Img ? product.Img : noImg } alt="Product"/>
                    </div>
                   <div>{product.product}</div>
                   <div>{product.price}</div>
                   <div>{product.quantity}</div>
                   <div>{product.createdAt}</div>
                </div>
              ))
            ) : (
              <h1>No Products Yet!!!</h1>
            )
          }
         </div>
         
       </div>
    </div>
  )
}

export default WarehouseProducts
