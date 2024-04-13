import { X } from "lucide-react"
import "../css/ViewProduct.css"


const ViewProduct = ({product,setViewProduct}) => {
    const hideProductDetails = () =>{
         setViewProduct(false)
    }
  return (
    <div className="product-display-container">
        <div className="product-displayBox">
            <X onClick={hideProductDetails} style={{color:"white",marginLeft:"100%",cursor:"pointer"}}/>
            <div className="product-displayImg">
                <img src={product.Img}/>
            </div>
            <div className="product-displayDetails">
              <p>Product : {product.product}</p>
              <p>Price : {product.price}</p>
              <p>Quantity : {product.quantity}</p>
              <p>Warehouse : {product.warehouse}</p>
              <p>Created At : {product.createdAt}</p>
            </div> 
        </div>
    </div>
  )
}

export default ViewProduct
