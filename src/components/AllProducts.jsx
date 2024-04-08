import { Eye,Pencil,Trash } from "lucide-react"
import "../css/AllProducts.css"

const AllProducts = ({data}) => {
  return (
    <div>
        {data.map((product,index)=>(
                  <div className="product" key={index}>
                    <div>
                    <p>{product.id}</p>
                    </div>

                    <div className="product-name">
                    <p>{product.product}</p>
                    </div>

                    <div>
                    <p>${product.price.toLocaleString()}</p>
                    </div>

                    <div>
                    <p>{product.quantity}</p>
                    </div>

                    <div className="warehouse-box">
                    <button>Assign</button>
                    </div>

                    <div>
                    <Eye size={20} style={{color:"green",cursor:"pointer"}}/>
                    <Pencil  size={20} style={{marginLeft:5,color:"#2666CF",cursor:"pointer"}} />
                    <Trash size={20} style={{marginLeft:5,color:"red",cursor:"pointer"}} />
                    </div>
                  </div>
                ))
        }
    </div>
  )
}

export default AllProducts
