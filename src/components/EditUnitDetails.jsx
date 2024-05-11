import { useParams,useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { collection,updateDoc,doc,getDoc,getDocs} from 'firebase/firestore'
import { db } from '../firebase'
import { toast } from 'react-toastify'
import Loader from './Loader'
import "../css/EditUnitDetails.css"

const EditUnitDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const units = localStorage.getItem("units") !== null ? JSON.parse(localStorage.getItem("units")) : []
  const foundUnit = units.find((unit)=>unit.id === id)


  const [unitName,setUnitName] = useState("")
  const [loading,setLoading] = useState(false)
  const [disabled,setDisabled] = useState(false)
  const [errMsg,setErrMsg] = useState("")

  const dummy = () =>{
    console.log("not allowed")
  }

  const closeEditing = () =>{
    navigate(-1)
  }

  const editUnit = async(unitID) =>{
    try{
        if(unitName === ""){
            toast.error("Unit must be filled",{
                position:"top-center"
            })
        }else{
            for (const unit of units) {
                if (unitName === unit.unit) {
                    setErrMsg("Unit Already Exists!");
                    return;
                }
            }
            setErrMsg("")
            setLoading(true)
            setDisabled(true)
            const allProducts = doc(db,"Products","Product Arrays")
            const productsDoc = await getDoc(allProducts);
            if (productsDoc.exists()) {
                const productsArray = productsDoc.data().products;
                const updatedProductsArr = productsArray.map((product)=>{
                    const measurement = product.Measurement;
                    const productUnit = measurement.match(/[a-zA-Z]+$/)[0];
                    if(foundUnit.unit === productUnit){
                     const oldValue = measurement.split(" ")
                     let measureValue = oldValue[0]
                     let unitValue = oldValue[1]
                     unitValue = unitName
                     const newValue = `${measureValue} ${unitValue}`
                     const updatedProduct = {
                        ...product,
                        Measurement:newValue
                     }   
                    return updatedProduct;
                  }else{
                    return product;
                  }
                })
                await updateDoc(allProducts,{
                  products:updatedProductsArr
              })
              }
              await editUnitInCategory()
              await editUnitInBrand()
              const docRef = doc(db,"Units",unitID)
              await updateDoc(docRef,{
                  unit:unitName
              })
              navigate(-1)
              toast.success("Unit Updated",{
                  autoClose:1000
              })            
        }
    }catch(error){
        console.log(error)
        setLoading(false)
        setErrMsg("Bad Connection! Check Your Network")
        setDisabled(false)
    }
  }

  const editUnitInCategory = async() =>{
    try{
        const categoryRef = collection(db,"Categories")
        const allCategories = await getDocs(categoryRef)
        allCategories.forEach(async(category)=>{
          const Id = category.id;
          const categoryProducts = category.data().products
          const updatedCategoryProducts = categoryProducts.map((product)=>{
            const measurement = product.Measurement;
            const productUnit = measurement.match(/[a-zA-Z]+$/)[0];
            if(foundUnit.unit === productUnit){
             const oldValue = measurement.split(" ")
             let measureValue = oldValue[0]
             let unitValue = oldValue[1]
             unitValue = unitName
             const newValue = `${measureValue} ${unitValue}`
             const updatedProduct = {
                ...product,
                Measurement:newValue
             }   
            return updatedProduct;
          }else{
            return product;
          }
        })
          const foundCategoryDoc = doc(db,"Categories",Id)
          await updateDoc(foundCategoryDoc,{
            products:updatedCategoryProducts
            })
            console.log("success")
        })
    }catch(error){
        console.log(error)
    }
  }

  const editUnitInBrand = async() =>{
    try{
        const categoryRef = collection(db,"Brands")
        const allBrands = await getDocs(categoryRef)
        allBrands.forEach(async(brand)=>{
          const Id = brand.id;
          const brandProducts = brand.data().products
          const updatedBrandProducts = brandProducts.map((product)=>{
            const measurement = product.Measurement;
            const productUnit = measurement.match(/[a-zA-Z]+$/)[0];
            if(foundUnit.unit === productUnit){
             const oldValue = measurement.split(" ")
             let measureValue = oldValue[0]
             let unitValue = oldValue[1]
             unitValue = unitName
             const newValue = `${measureValue} ${unitValue}`
             const updatedProduct = {
                ...product,
                Measurement:newValue
             }   
            return updatedProduct;
          }else{
            return product;
          }
        })
          const foundBrandDoc = doc(db,"Brands",Id)
          await updateDoc(foundBrandDoc,{
            products:updatedBrandProducts
            })
            console.log("success")
        })
    }catch(error){
        console.log(error)
    }
  }

  useEffect(()=>{
    setUnitName(foundUnit.unit)
  },[])

  return (
    <div className="editUnit">
    <form className="editUnit-form" onSubmit={(e)=>e.preventDefault()}>
    <div className="form-title">
      <span><ChevronLeft onClick={disabled ? dummy:closeEditing} 
      style={disabled ? {cursor:"not-allowed",opacity:"0.7" }:{cursor:"pointer"}} size={30}/></span>
      <h2>Edit Unit</h2>
      </div>
      <input type='text' 
      value={unitName} 
      onChange={(e)=>setUnitName(e.target.value)}
      placeholder='Enter Brand Name...'
      />
      <p className="error-msg">{errMsg}</p>
      { loading ? (
      <Loader/>
      ) : (
      <button onClick={()=>editUnit(foundUnit.id)}>Save Changes</button>
      )
      }
    </form>
  </div>
  )
}

export default EditUnitDetails
