import { useState } from "react"
import { Eye,Pencil,Trash } from "lucide-react"
import { Link } from "react-router-dom"
import { updateDoc,doc,collection,getDocs } from "firebase/firestore"
import { db } from "../firebase"
import "../css/AllProducts.css"
import ViewProduct from "./ViewProduct"
import { toast } from "react-toastify"


const AllProducts = () => {
    const products = localStorage.getItem("products") !== null ? JSON.parse(localStorage.getItem("products")) : []
    const [viewProduct,setViewProduct] = useState(false)
    const [product,setProduct] = useState(null)

    const toggleProductDetails = (id) =>{
        const foundProduct = products.find((p)=>p.id === id)
        if(foundProduct){
            setViewProduct(true)
            setProduct(foundProduct)
        }
    }

    const deleteProduct = async(Id,warehouse) =>{
      try{
        const colRef = collection(db,"Products")
        const productArrayReference = doc(colRef,"Product Arrays")
  
        const foundProduct = products.filter((p)=>p.id !== Id)
        localStorage.setItem("products",JSON.stringify(foundProduct))
        await updateDoc(productArrayReference,{
          products:foundProduct
        })
        await deleteProductFromWarehouse(Id,warehouse)
      }catch(error){
         console.log(error)
         toast.error("Network Error")
      }
      
    }

    const deleteProductFromWarehouse = async(Id,warehouse) => {
      try{
        const colRef = collection(db,"Warehouses")
        const docRef = await getDocs(colRef)

        docRef.forEach(async(document)=>{
          if(warehouse === document.id){
            const warehouseRef = doc(db,"Warehouses",document.id)
            const productsArr = document.data().products
            const productToDelete = productsArr.filter((p)=>p.id !== Id)
            await updateDoc(warehouseRef,{
             products:productToDelete
           })
          }
        })
        toast.error("Product Deleted",{
          autoClose:1000
        })
      }catch(error){
        console.log(error)
      }  
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
                    <p>{product.quantity}
                    {product.quantity === "0" && <span className="low-stock-span">Out Of Stock</span>}
                    </p>
                    </div>

                    <div>
                    <Eye onClick={()=>toggleProductDetails(product.id)} size={20} style={{color:"green",cursor:"pointer"}}/>
                    <Link to={`/dashboard/editProduct/${product.id}`}>
                    <Pencil size={20} style={{marginLeft:5,color:"#2666CF",cursor:"pointer"}} />
                    </Link>
                    <Trash onClick={()=>deleteProduct(product.id,product.warehouse)} size={20} style={{marginLeft:5,color:"red",cursor:"pointer"}} />
                    </div>
                  </div>
                ))
        }
        {viewProduct && <ViewProduct product={product} setViewProduct={setViewProduct}/>}
    </div>
  )
}

export default AllProducts
