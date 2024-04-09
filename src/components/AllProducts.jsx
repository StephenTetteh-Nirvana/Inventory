import { useEffect, useState } from "react"
import { Eye,Pencil,Trash } from "lucide-react"
import { Link } from "react-router-dom"
import { updateDoc,doc,collection,getDoc } from "firebase/firestore"
import { db } from "../firebase"
import "../css/AllProducts.css"
import ViewProduct from "./ViewProduct"


const AllProducts = () => {
    const products = localStorage.getItem("products") !== null ? JSON.parse(localStorage.getItem("products")) : []
    const [data,setData] = useState("")
    const [viewProduct,setViewProduct] = useState(false)
    const [product,setProduct] = useState(null)

    const toggleProductDetails = (id) =>{
        const foundProduct = products.find((p)=>p.id === id)
        if(foundProduct){
            setViewProduct(true)
            setProduct(foundProduct)
        }
    }

    const deleteProduct = async(Id) =>{
      const colRef = collection(db,"Products")
      const productArrayReference = doc(colRef,"Product Arrays")

      const foundProduct = products.filter((p)=>p.id !== Id)
      await updateDoc(productArrayReference,{
        products:foundProduct
      })
    }

    
    

  return (
    <div>
        {products.map((product,index)=>(
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
                    <Eye onClick={()=>toggleProductDetails(product.id)} size={20} style={{color:"green",cursor:"pointer"}}/>
                    <Link to={`/dashboard/editProduct/${product.id}`}>
                    <Pencil size={20} style={{marginLeft:5,color:"#2666CF",cursor:"pointer"}} />
                    </Link>
                    <Trash onClick={()=>deleteProduct(product.id)} size={20} style={{marginLeft:5,color:"red",cursor:"pointer"}} />
                    </div>
                  </div>
                ))
        }
        {viewProduct && <ViewProduct product={product} setViewProduct={setViewProduct}/>}
    </div>
  )
}

export default AllProducts
