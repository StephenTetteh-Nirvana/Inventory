import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { collection,doc,updateDoc,getDocs,getDoc} from "firebase/firestore"
import { db } from "../firebase.js"
import { toast } from "react-toastify"
import Loader from "../components/Loader.jsx"
import "../css/EditProductDetails.css"

const EditProductDetails = () => {
  const { id } = useParams()
  const productData = localStorage.getItem("products") !== null ? JSON.parse(localStorage.getItem("products")) : []
  const units = localStorage.getItem("units") !== null ? JSON.parse(localStorage.getItem("units")) : []
  const categories = localStorage.getItem("categories") !== null ? JSON.parse(localStorage.getItem("categories")) : []
  const brands = localStorage.getItem("brands") !== null ? JSON.parse(localStorage.getItem("brands")) : []
  const foundProduct = productData.find((p)=> p.id === id)

  const [productName,setProductName] = useState('')
  const [price,setPrice] = useState('')
  const [oldMeasurement,setOldMeasurement] = useState("")
  const [newMeasurement,setNewMeasurement] = useState("")
  const [measurementUnit,setMeasurementUnit] = useState("None")
  const [showMeasurement,setShowMeasurement] = useState(false)
  const [stockLevel,setStockLevel] = useState('')
  const [lowStock,setLowStock] = useState("")
  const [category,setCategory] = useState("")
  const [brand,setBrand] = useState("")
  const [loading,setLoading] = useState(false)
  const [disabled] = useState(true)
  const date = new Date().toDateString();
  const time = new Date().toLocaleTimeString()
  const navigate = useNavigate()

   const closeuserPopup = () =>{
      navigate(-1)
  }

  const editProduct = async() =>{
    try{
    if(productName !== "" && price !== "" && stockLevel !== "" && lowStock !== "" && category !== "" && brand !== "") {
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
            id:foundProduct.id,
            product:productName,
            price:price,
            stockLevel:stockLevel,
            Measurement:measurementUnit !== "None" ?
            `${newMeasurement}  ${measurementUnit}`:oldMeasurement,
            lowStock:lowStock,
            category:category,
            brand:brand
          }
          return updatedProduct;
        }else{
          return product;
        }
      })
      await updateDoc(productArrayReference,{
        products:updatedProductArray
    })
    navigate(-1)
    toast.success("Product Updated",{
      autoClose:1000
    })
    await editProductInCategory()
    await editProductInBrand()
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

   // FUNCTIONS FOR UPDATING CATEGORY VALUE IN BOTH CATEGORY AND BRAND
  const editProductInCategory = async() =>{
  try{
    if(category !== foundProduct.category){
      addProductToNewCategory()
      return;
    }

    const colRef = collection(db,"Categories")
    const docRef = await getDocs(colRef)
  
    docRef.forEach(async(document)=>{
      const docId = document.id;
      const docName = document.data().name
      if(foundProduct.category === docName){
        const productsArr = document.data().products
        const updatedProductArray = productsArr.map((product)=>{
          if(foundProduct.id === product.id){
            const updatedProduct = {
              ...product,
              id:foundProduct.id,
              product:productName,
              price:price,
              stockLevel:stockLevel,
              Measurement:measurementUnit !== "None" ?
              `${newMeasurement}  ${measurementUnit}`:oldMeasurement,
              lowStock:lowStock,
              category:category,
              brand:brand
            }
            return updatedProduct;
          }else{
            return product;
          }
        })
        const categoryRef = doc(db,"Categories",docId)
        await updateDoc(categoryRef,{
         products:updatedProductArray
       })
      }
    })
  }catch(error){
    console.log("Failed to update in category")
    console.log(error)
  }
  }

  const addProductToNewCategory = async() =>{
    try{
      const colRef = collection(db,"Categories")
      const docRef = await getDocs(colRef)

      docRef.forEach(async(document)=>{
       const docId = document.id;
       const docName = document.data().name
       if(foundProduct.category === docName){
         const oldCategoriesProductsArr = document.data().products
         const newCategoriesProductsArr = oldCategoriesProductsArr.filter((p)=> p.id !== foundProduct.id)
         const categoriesRef = doc(db,"Categories",docId)
         await updateDoc(categoriesRef,{
          products:newCategoriesProductsArr
         })
       }
       
       if(category === docName){
         const productsArr = document.data().products
         const newProduct = {
           id:foundProduct.id,
           product:productName,
           price:price,
           stockLevel:stockLevel,
           Measurement:measurementUnit !== "None" ?
           `${newMeasurement}  ${measurementUnit}`:oldMeasurement,
           lowStock:lowStock,
           category:category,
           brand:brand,
           createdAt:`${date} at ${time}`
       }
       const categoryRef = doc(db,"Categories",docId)
       await updateDoc(categoryRef,{
        products:[...productsArr,newProduct]
       })
     }
     })
    }catch(error){
      console.log("Operation FAILED")
      console.log(error)
    }
  }

   //FUNCTIONS FOR UPDATING BRAND VALUE IN BOTH BRAND AND CATEGORY
  const editProductInBrand = async() =>{
    try{
      if(brand !== foundProduct.brand){
        addProductToNewBrand()
        return;
      }
      const colRef = collection(db,"Brands")
      const docRef = await getDocs(colRef)
    
      docRef.forEach(async(document)=>{
        const docId = document.id;
        const docName = document.data().name
        if(foundProduct.brand === docName){
        const productsArr = document.data().products
        const updatedProductArray = productsArr.map((product)=>{
          if(foundProduct.id === product.id){
            const updatedProduct = {
              ...product,
              id:foundProduct.id,
              product:productName,
              price:price,
              stockLevel:stockLevel,
              Measurement:measurementUnit !== "None" ?
              `${newMeasurement}  ${measurementUnit}`:oldMeasurement,
              lowStock:lowStock,
              category:category,
              brand:brand
            }
            return updatedProduct;
          }else{
            return product;
          }
        })
          const brandRef = doc(db,"Brands",docId)
          await updateDoc(brandRef,{
           products:updatedProductArray
         })
        }
      })
    }catch(error){
      console.log("Failed to update in brand")
      console.log(error)
    }
  }

  const addProductToNewBrand = async() =>{
    try{
      const colRef = collection(db,"Brands")
      const docRef = await getDocs(colRef)
 
      docRef.forEach(async(document)=>{
       const docId = document.id;
       const docName = document.data().name
       if(foundProduct.brand === docName){
         const oldBrandProductsArr = document.data().products
         const newBrandProductsArr = oldBrandProductsArr.filter((p)=> p.id !== foundProduct.id)
         const brandRef = doc(db,"Brands",docId)
         await updateDoc(brandRef,{
          products:newBrandProductsArr
         })
       }
       
       if(brand === docName){
         const productsArr = document.data().products
         const newProduct = {
           id:foundProduct.id,
           product:productName,
           price:price,
           stockLevel:stockLevel,
           Measurement:measurementUnit !== "None" ?
           `${newMeasurement}  ${measurementUnit}`:oldMeasurement,
           lowStock:lowStock,
           category:category,
           brand:brand,
           createdAt:`${date} at ${time}`
          }
       const categoryRef = doc(db,"Brands",docId)
       await updateDoc(categoryRef,{
        products:[...productsArr,newProduct]
       })
     }
     })
    }catch(error){
      console.log("Operation FAILED")
      console.log(error)
    }
  }

// const editProductInWarehouse = async(foundProduct,updatedProductArray) =>{
//   const colRef = collection(db,"Warehouses")
//   const docRef = await getDocs(colRef)

//   docRef.forEach(async(document)=>{
//     if(foundProduct.warehouse === document.id){
//       const warehouseRef = doc(db,"Warehouses",document.id)
//       await updateDoc(warehouseRef,{
//        products:updatedProductArray
//      })
//     }
//   })
// }

  // eslint-disable-next-line
  useEffect(()=>{
    setProductName(foundProduct.product)
    setPrice(foundProduct.price)
    setOldMeasurement(foundProduct.Measurement)
    setStockLevel(foundProduct.stockLevel)
    setLowStock(foundProduct.lowStock)
    setCategory(foundProduct.category)
    setBrand(foundProduct.brand)
  },[])

  useEffect(()=>{
    if(measurementUnit !== "None"){
      setShowMeasurement(true)
     }else{
      setShowMeasurement(false)
     }
  },[measurementUnit])

  return(
    <div className="edit-product-container">
    <form onSubmit={(e)=>e.preventDefault()}>
    <div className="form-title">
       <span><ChevronLeft onClick={closeuserPopup} style={{cursor:"pointer"}} size={30}/></span>
       <h2>Edit Product</h2>
    </div>
    
    <div className="edit-product-inputs">
        <div className="edit-product-name">
          <label>Product</label><br/>
          <input type="text" value={productName} onChange={(e)=>setProductName(e.target.value)} required/>
        </div>

        <div className="edit-product-price">
          <label>Price</label><br/>
          <input type="number" value={price} onChange={(e)=>setPrice(e.target.value)} required/>
        </div>
        <div className="old-measurement">
          <label>Old Measurement</label><br/>
          <input disabled={disabled} 
            style={disabled ? {cursor:"not-allowed",opacity:"0.9" } : {}}  type="text" value={oldMeasurement}/>
        </div>
        <div className="measurement-section">
              <label>New Unit Of Measurement</label><br/>
              <select onChange={(e)=>setMeasurementUnit(e.target.value)}>
                <option>None</option>
                {units.length > 0 && units.map((unitData)=>(
                    <option key={unitData.unit}>{unitData.unit}</option>
                    ))
                }
              </select>
            </div>
            {showMeasurement  ? (
              <div className="new-product-measurement">
              <label>New Product Measurement</label><br/>
              <input type="number"  
              onChange={(e)=>{setNewMeasurement(e.target.value)}}
              placeholder="Enter Product Measurement..."
              required/>
              </div>
            ):""}
        <div className="edit-product-stockLevel">
          <label>Stock Level</label><br/>
          <input type="number" value={stockLevel} onChange={(e)=>setStockLevel(e.target.value)} required/>
        </div>
        <div className="edit-product-lowStock">
          <label>Minimum Stock Level</label><br/>
          <input type="number" value={lowStock} onChange={(e)=>setLowStock(e.target.value)} required/>
        </div>
        <div className="edit-product-category">
        <label>Change Category</label><br/>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.length > 0 && (
                categories.map((categoryData) => (
                    <option key={categoryData.name} value={categoryData.name}>{categoryData.name}</option>
                ))
            )}
        </select>
        </div>
        <div className="edit-product-brand">
        <label>Change Brand</label><br/>
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            {brands.length > 0 && (
                brands.map((brandData) => (
                    <option key={brandData.name} value={brandData.name}>{brandData.name}</option>
                ))
            )}
        </select>
        </div>
    </div>
    <div className="edit-product-buttons">
        { loading ? (
            <Loader/>
        ) : (
            <button className="edit-product-saveBtn" onClick={editProduct}>Save Changes</button>
        )}
    </div>
    </form>
</div>
  )
}

export default EditProductDetails
