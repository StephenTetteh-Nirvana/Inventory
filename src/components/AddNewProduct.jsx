import { useEffect, useState } from "react"
import "../css/AddNewProduct.css"
import { collection, doc , getDoc, getDocs, updateDoc } from "firebase/firestore"
import { db,storage } from "../firebase.js"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Loader,Images } from "lucide-react"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import noUser from "../images/camera-off.png"


const AddNewProduct = () => {
  const warehouseData = localStorage.getItem("warehouses") !== null ? JSON.parse(localStorage.getItem("warehouses")) : []
  const categories = localStorage.getItem("categories") !== null ? JSON.parse(localStorage.getItem("categories")) : []
  const brands = localStorage.getItem("brands") !== null ? JSON.parse(localStorage.getItem("brands")) : []
  const [file,setFile] = useState("")
  const [imageUrl,setImageUrl] = useState(null)
  const [Trackprogress,setTrackProgress] = useState(null)
  
  const [category,setCategory] = useState("")
  const [brand,setBrand] = useState("")
  const [warehouse,setWarehouse] = useState("")
  const [product,setProduct] = useState("")
  const [price,setPrice] = useState("")
  const [stockLevel,setStockLevel] = useState("")
  const [errMsg,setErrMsg] = useState("")
  const [disabled,setdisabled] = useState(true)
  const [cancel,setCancel] = useState(false)
  const [loading,setLoading] = useState(false)


  const navigate = useNavigate()

    const closePopup = () =>{
        navigate("/dashboard")
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
          toast.error("Image Upload Failed")
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
       const productArrayReference = doc(db,"Products","Product Arrays")
       const productArrays = await getDoc(productArrayReference)
        
        const productArray = productArrays.data().products || []
        const date = new Date().toDateString();
        const time = new Date().toLocaleTimeString()
            const newProduct = {
              id:String(Math.round(Math.random()*1000)),
              category:category,
              bradn:brand,
              product:product,
              price:price,
              stockLvl:stockLevel,
              Img:imageUrl,
              warehouse:warehouse === "" ? "Not Assigned" : warehouse,
              createdAt:`${date} at ${time}`
           }
           toast.success("New Product Added",{
            autoClose:1500
          })
          setLoading(false)
          navigate(-1)
          await updateDoc(productArrayReference,{
              products: [...productArray,newProduct]
            })
          await addProductToWarehouse(newProduct)
       }catch(error){
        console.log(error)
        setdisabled(false)
        setCancel(false)
        setLoading(false)
        setErrMsg("Bad Connection! Check Your Network")
      }
    }

    // const addProductToWarehouse = async(newProduct) => {
    //   const updatedProduct = {
    //     id:newProduct.id,
    //     product:newProduct.product,
    //     price:newProduct.price,
    //     quantity:newProduct.quantity,
    //     Img:newProduct.Img,
    //     warehouse:newProduct.warehouse,
    //     createdAt:newProduct.createdAt
    //   }
    //   try{
    //     const colRef = collection(db,"Warehouses")
    //     const docRef = await getDocs(colRef)
     
    //     docRef.forEach(async(document)=>{
    //       if(warehouse === document.id){
    //         const warehouseRef = doc(db,"Warehouses",document.id)
    //         const warehouseProductsArr = document.data().products
    //         await updateDoc(warehouseRef,{
    //          products:[...warehouseProductsArr,updatedProduct]
    //        })
    //       }
    //     })
    //   }catch(error){
    //     console.log(error)
    //   }  
    // }


    // const fetchWarehouses = () =>{
    //   try{
    //     if(warehouseData.length > 0 && warehouse === ""){
    //       setWarehouse(warehouseData[0].name);
    //     }
    //   }catch(error){
    //     console.log(error)
    //   }
    // }

    const fetchCategories = () =>{
      try{
        if(categories.length > 0 && category === ""){
          setCategory(categories[0].name);
        }
      }catch(error){
        console.log(error)
      }
    }

    const fetchBrands = () =>{
      try{
        if(brands.length > 0 && brand === ""){
          setBrand(brand[0].name);
        }
      }catch(error){
        console.log(error)
      }
    }

    useEffect(()=>{
      fetchCategories()
      fetchBrands()
       if(category !== "" && brand !== "" && warehouse !=="" && product !== "" && price !== "" && stockLevel !== ""){
        setdisabled(false)
       }else{
        setdisabled(true)
       }
    },[warehouse,product,price,stockLevel])


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
          <div className="categories-section">
                <label>Select Category</label><br/>
                <select onChange={(e)=>setCategory(e.target.value)}>
                {categories.length > 0 ? categories.map((categoryData)=>(
                      <option key={categoryData.name}>{categoryData.name}</option>
                    )) : (<option>No categories found!!!</option>)}
                </select>
            </div>
            <div className="brands-section">
                <label>Select Brand</label><br/>
                <select onChange={(e)=>setBrand(e.target.value)}>
                {brands.length > 0 ? brands.map((brandData)=>(
                      <option key={brandData.name}>{brandData.name}</option>
                    )) : (<option>No brands found!!</option>)}
                </select>
            </div>
          {/* <div className="warehouse-section">
                <label>Select Warehouse</label><br/>
                <select onChange={(e)=>setWarehouse(e.target.value)}>
                {warehouseData.length > 0 ? warehouseData.map((warehouse)=>(
                      <option key={warehouse.name}>{warehouse.name}</option>
                    )) : (<option>No warehouse to add product!!</option>)}
                </select>
            </div> */}
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
                <label>Stock Level</label><br/>
                <input type="number" 
                 value={stockLevel}
                 onChange={(e)=>{setQuantity(e.target.value)}}
                 placeholder="Stock Level..."
                required
                />
            </div>
          </div>
          <p className="error-msg">{errMsg}</p>
          {warehouseData && warehouseData.length === 0 ? 
          (<p className="error-msg">Create a warehouse before adding product</p>)
          : categories && categories.length === 0 ?
          (<p className="error-msg">Create a category before adding product</p>)
          : brands && brands.length === 0 ?
          (<p className="error-msg">Create a brand before adding product</p>)
          :""
          }
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
