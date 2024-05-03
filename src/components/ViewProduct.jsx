import { X } from "lucide-react"
import noImg from "../images/camera-off.png"
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
                <img src={product.Img ? product.Img : noImg} alt="product"/>
            </div>
            <div className="product-displayDetails">
              <p>Created At : {product.createdAt}</p>
            </div> 
        </div>
    </div>
  )
}

export default ViewProduct
