import { X } from "lucide-react"
import noImg from "../images/camera-off.png"
import "../css/ViewCategoryProducts.css"

const ViewCategoryProducts = ({category,products,setDisplayProducts}) => {

    const closeProductsList = () =>{
        setDisplayProducts(false)
    }

  return (
    <div className="category-products-container">
       <div className="category-products">
        <div style={{display:"flex",justifyContent:"space-between"}}>
        <h2>{category}</h2>
         <X onClick={closeProductsList} size={25} style={{color:"black",cursor:"pointer"}}/>
        </div>
         <ul>
          <li>Product</li>
          <li>Name</li>
          <li>Measurement</li>
          <li>Unit Price</li>
          <li>Stock Level</li>
          <li>Brand</li>
          <li>Date Created</li>
         </ul>
         <div>
          {products && products.length > 0 ? (
              products.map((product,index)=>(
                <div className="category-product" key={index}>
                   <div className="ImageBox">
                    <img src={product.Img ? product.Img : noImg } alt="Product"/>
                    </div>
                   <div>{product.product}</div>
                   <div>{product.Measurement}</div>
                   <div>${product.price}.00</div>
                   <div>{product.stockLevel}</div>
                   <div>{product.brand}</div>
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

export default ViewCategoryProducts
