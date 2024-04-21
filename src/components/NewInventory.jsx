import { useEffect, useState } from "react"
import { collection, doc , getDoc, updateDoc } from "firebase/firestore"
import { db,storage } from "../firebase.js"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Loader,Images } from "lucide-react"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import "../css/NewInventory.css"
import noUser from "../images/camera-off.png"


const AddNewProduct = () => {
  const warehouseData = localStorage.getItem("userWarehouse") !== null ? JSON.parse(localStorage.getItem("userWarehouse")) : []
  const [file,setFile] = useState("")
  const [imageUrl,setImageUrl] = useState(null)
  const [Trackprogress,setTrackProgress] = useState(null)
  
  const [product,setProduct] = useState("")
  const [price,setPrice] = useState("")
  const [quantity,setQuantity] = useState("")
  const [errMsg,setErrMsg] = useState("")
  const [disabled,setdisabled] = useState(true)
  const [cancel,setCancel] = useState(false)
  const [loading,setLoading] = useState(false)


  const navigate = useNavigate()
    const closePopup = () =>{
        navigate(-1)
    }

    const handleProductImg = (e) =>{
      try{
          const selectedFile = e.target.files[0]
          setFile(selectedFile)
          uploadProductImg(selectedFile)
          console.log(file)
      }catch(error){
          console.log("upload cancelled")
      }
      
  }

    const uploadProductImg = (file) =>{
      const id = String(Math.round(Math.random * 100))
      const storageRef = ref(storage, 'products/' + file.name + id);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
      (snapshot) => {
        setdisabled(true)
        setCancel(true)
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setTrackProgress(progress)
          switch (snapshot.state) {
          case 'paused':
              console.log('Upload is paused');
              break;
          case 'running':
              console.log('Upload is running');
              break;
          default:
            console.log("Upload Failed")
            break;
          }
      },
      (error) => {
          console.log(error)
          console.log("upload failed")
      }, 
      () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setdisabled(false)
          setCancel(false)
          setTrackProgress(null)
          console.log('File available at', downloadURL);
          setImageUrl(downloadURL)
          });
      })
  }
    
    const addNewProduct =  async() =>{
       try{
       setLoading(true)
       setdisabled(true)
       setCancel(true)
       const colRef = collection(db,"Products")
       const productArrayReference = doc(colRef,"Product Arrays")
       const productArrays = await getDoc(productArrayReference)
        
       if(productArrays.exists()){
        const productArray = productArrays.data().products || []
        const date = new Date().toDateString();
        const time = new Date().toLocaleTimeString()
            const newProduct = {
              id:String(Math.round(Math.random()*1000)),
              product:product,
              price:price,
              quantity:quantity,
              Img:imageUrl,
              warehouse:warehouseData,
              createdAt:`${date} at ${time}`
           }
            await updateDoc(productArrayReference,{
              products: [...productArray,newProduct]
            })
            await addProductToWarehouse(newProduct)
              toast.success("New Product Added",{
                autoClose:1500
              })
              setLoading(false)
              navigate(-1)
            }
       }catch(error){
        console.log(error)
        setdisabled(false)
        setCancel(false)
        setLoading(false)
        setErrMsg("Bad Connection! Check Your Network")
      }
    }

    const addProductToWarehouse = async(newProduct) => {
      const updatedProduct = {
        id:newProduct.id,
        product:newProduct.product,
        price:newProduct.price,
        quantity:newProduct.quantity,
        Img:newProduct.Img,
        warehouse:newProduct.warehouse,
        createdAt:newProduct.createdAt
      }
      try{
        const docRef = doc(db,"Warehouses",warehouseData)
        const docData = await getDoc(docRef)
        const warehouseProductsArr = docData.data().products
        await updateDoc(docRef,{
            products:[...warehouseProductsArr,updatedProduct]
        })
      }catch(error){
        console.log(error)
      }  
    }



    useEffect(()=>{
       if(product !== "" && price !== "" && quantity !== ""){
        setdisabled(false)
       }else{
        setdisabled(true)
       }
    },[product,price,quantity])


  return (
    <div className="new-product-container">
       <form className="new-product-form" onSubmit={(e)=>e.preventDefault()}>
          <h3>Add New Product</h3>
          <div className="userImg-section">
            <img src={imageUrl ? imageUrl : noUser} alt="noUser" />
            <label htmlFor="file-upload"><Images style={{cursor:"pointer"}} /></label>
            <input id="file-upload" type="file" onChange={handleProductImg} style={{display:"none"}}/>
        </div>
        {Trackprogress !== null && 
        <div className="Imgupload-track">
           <p className="progress">{`Image upload is ${Math.round(Trackprogress)}% done`}</p>
        </div>
        }
          <div className="all-newProduct-inputs">
          <div className="warehouse-section">
              <label>Assigned Warehouse</label><br/>
              <input type="text" value={warehouseData} readOnly/>
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
          <p className="error-msg">{errMsg}</p>
          <div className="new-product-buttons">
            <button disabled={disabled} 
            style={disabled ? {cursor:"not-allowed",opacity:"0.7" } : {}} 
            className="save-product-btn" onClick={addNewProduct}>{loading ? <Loader size={18}/> : "Save" }</button>
            <button disabled={cancel}
            style={cancel ? {cursor:"not-allowed",opacity:"0.7" } : {}}  
            className="cancel-product-btn" onClick={closePopup}>Cancel</button>
          </div>
       </form>
    </div>
  )
}

export default AddNewProduct
