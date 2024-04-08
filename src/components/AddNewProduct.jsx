import { useEffect, useState } from "react"
import "../css/AddNewProduct.css"
import { collection, doc , getDoc, updateDoc } from "firebase/firestore"
import { db } from "../firebase.js"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const AddNewProduct = () => { 
  const [warehouse,setWarehouse] = useState("")
  const [product,setProduct] = useState("")
  const [price,setPrice] = useState("")
  const [quantity,setQuantity] = useState("")
  const [errMsg,setErrMsg] = useState("")
  const [disabled,setdisabled] = useState(true)
  const navigate = useNavigate()

    const closePopup = () =>{
        navigate("/dashboard")
    }
    
    const addNewProduct =  async() =>{
      if(product === "" || price === "" || quantity === "") {
       console.log("fill the form")
      }else{
       const colRef = collection(db,"Products")
       const productArrayReference = doc(colRef,"Product Arrays")
       const productArrays = await getDoc(productArrayReference)
        
       if(productArrays.exists()){
        const productArray = productArrays.data().products || []
          try{
            const newProduct = {
              product:product,
              price:price,
              quantity:quantity
           }
            await updateDoc(productArrayReference,{
              products: [...productArray,newProduct]
            })
              toast.success("New Product Added",{
                autoClose:1500
              })
              setTimeout(()=>{
                navigate(-1)
              },1000)
          }catch(error){
            setErrMsg("Bad Connection! Check Your Network")
            console.log("error")
          }
       }
      }
    }

    useEffect(()=>{
       if(quantity !== "" ){
        setdisabled(false)
        console.log("changed")
       }else{
        setdisabled(true)
       }
    },[quantity])


  return (
    <div className="new-product-container">
       <form className="new-product-form" onSubmit={(e)=>e.preventDefault()}>
          <h3>Add New Product</h3>
          <div className="all-newProduct-inputs">
          <div className="warehouse-section">
                <label>Select Warehouse</label><br/>
                <select>
                    <option>Fruits Warehouse</option>
                    <option>Electronics Warehouse</option>
                    <option>Accessories Warehouse</option>
                </select>
            </div>
            <div className="new-product-name">
                <label>Product Name</label><br/>
                <input type="text"  
                value={product}
                onChange={(e)=>{setProduct(e.target.value)}}
                
                placeholder="Enter Product Name..."
                required
                />
            </div>
            <div className="new-product-price">
                <label>Product Price</label><br/>
                <input type="number"  
                 value={price}
                 onChange={(e)=>{setPrice(e.target.value)}}
                placeholder="Enter Product Price..."
                required
                />
            </div>
            <div className="new-product-quantity">
                <label>Quantity</label><br/>
                <input type="number" 
                 value={quantity}
                 onChange={(e)=>{setQuantity(e.target.value)}}
                placeholder="Quantity..."
                required
                />
            </div>
          </div>
          <h3>{errMsg}</h3>
          <div className="new-product-buttons">
            <button disabled={disabled} style={disabled ? {cursor:"not-allowed",opacity:"0.7" } : {}} className="save-product-btn" onClick={addNewProduct}>Save</button>
            <button className="cancel-product-btn" onClick={closePopup}>Cancel</button>
          </div>
       </form>
    </div>
  )
}

export default AddNewProduct
