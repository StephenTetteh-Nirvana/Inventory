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
          <li>Image</li>
          <li>Product</li>
          <li>Measurement</li>
          <li>Unit Price</li>
          <li>Stock Level</li>
          <li>Category</li>
          <li>Brand</li>
         </ul>
         <div>
          {products && products.length > 0 ? (
              products.map((product,index)=>(
                <div className="warehouse-product" key={index}>
                   <div className="ImageBox">
                    <img src={product.Img ? product.Img : noImg } alt="Product"/>
                    </div>

                    <div>
                    <p>{product.product}</p>
                    </div>

                    <div>
                    <p>{product.Measurement}</p>
                    </div>

                    <div>
                    <p>{product.price}</p>
                    </div>

                    <div>
                    <p>{product.stockLevel}</p>
                    </div>

                    <div>
                    <p>{product.category}</p>
                    </div>

                    <div>
                    <p>{product.brand}</p>
                    </div>
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
