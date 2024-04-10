import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { collection,doc,updateDoc,getDoc} from "firebase/firestore"
import { db } from "../firebase.js"
import { toast } from "react-toastify"
import Loader from "../components/Loader.jsx"
import "../css/EditProductDetails.css"

const EditProductDetails = () => {
  const { id } = useParams()
  const productData = localStorage.getItem("products") !== null ? JSON.parse(localStorage.getItem("products")) : []
  const foundProduct = productData.find((p)=> p.id === id)

  const [productName,setProductName] = useState('')
  const [price,setPrice] = useState('')
  const [quantity,setQuantity] = useState('')
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

   const closeuserPopup = () =>{
      navigate(-1)
  }

  const editProduct = async() =>{
    try{
    if(productName !== "" && price !== "" && quantity !== "") {
    setLoading(true)
    const colRef = collection(db,"Products")
    const productArrayReference = doc(colRef,"Product Arrays")
    const productArr = await getDoc(productArrayReference)

    if(productArr.exists){
      const productArray = productArr.data().products

      const updatedProductArray = productArray.map((product)=>{
        if(foundProduct.id === product.id){
          const updatedProduct = {
            ...product,
            product:productName,
            price:price,
            quantity:quantity
          }
          return updatedProduct;
        }else{
          return product;
        }
      })
      await updateDoc(productArrayReference,{
        products:updatedProductArray
    })
    toast.success("Product Updated",{
      autoClose:1000
    })
    setLoading(false)
    navigate(-1)
  }
  }else{
    toast.error("Fill The Form",{
      autoClose:1000,
      position:"top-center"
    })
  }
    }catch(error){
      setLoading(false)
      console.log(error)
   }
}
  

  useEffect(()=>{
    setProductName(foundProduct.product)
    setPrice(foundProduct.price)
    setQuantity(foundProduct.quantity)
  },[])

  return(
    <div className="edit-user-container">
    <form onSubmit={(e)=>e.preventDefault()}>
    <div className="form-title">
       <span><ChevronLeft onClick={closeuserPopup} style={{cursor:"pointer"}} size={30}/></span>
       <h2>Edit Product</h2>
    </div>
    
    <div className="edit-product-inputs">
    <div className="edit-product-warehouse">
          <label>Select Warehouse</label><br/>
          <select>
            <option>WareHouse</option>
          </select>
        </div>

        <div className="edit-product-name">
          <label>Product</label><br/>
          <input type="text" value={productName} onChange={(e)=>setProductName(e.target.value)}/>
        </div>

        <div className="edit-product-price">
          <label>Price</label><br/>
          <input type="text" value={price} onChange={(e)=>setPrice(e.target.value)}/>
        </div>
        <div className="edit-product-quantity">
          <label>Quantity</label><br/>
          <input type="text" value={quantity} onChange={(e)=>setQuantity(e.target.value)}/>
        </div>
    </div>
    <div className="edit-product-buttons">
        { loading ? (
            <Loader/>
        ) : (
            <button className="edit-product-saveBtn" onClick={()=>editProduct()}>Save Changes</button>
        )}
    </div>
    </form>
</div>
  )
}

export default EditProductDetails
