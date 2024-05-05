import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { updateDoc,doc,getDoc, collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import { toast } from "react-toastify"
import "../css/EditCategory.css"
import Loader from "./Loader"

const EditCategory = () => {
  const parsedData = JSON.parse(localStorage.getItem("categories")) !== null ? JSON.parse(localStorage.getItem("categories")) : []
  const { id } = useParams()
  const foundCategory = parsedData.find((c)=>c.id === id)

  const [name,setName] = useState("")
  const [errMsg,setErrMsg] = useState("")
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const closeEditing = () =>{
    navigate(-1)
  }

  const editCategoryData = async(categoryId) => {
    try{
        if(name === ""){
            toast.error("Category must be filled",{
                position:"top-center"
            })
        }else{
            for (const data of parsedData) {
                if (name === data.name) {
                    setErrMsg("Category Already Exists!");
                    return;
                }
            }
        setLoading(true)
        const allProducts = doc(db,"Products","Product Arrays")
        const productsDoc = await getDoc(allProducts);
        if (productsDoc.exists()) {
            const productsArray = productsDoc.data().products;
            const updatedProductArray = productsArray.map((product)=>{
              if(foundCategory.name === product.category){
                const updatedProduct = {
                  ...product,
                  category:name,
                }
                return updatedProduct;
              }else{
                return product;
              }
            })
            await updateDoc(allProducts,{
              products:updatedProductArray
          })
          }
          await editCategoryInBrand()
          const docRef = doc(db,"Categories",categoryId)
          await updateDoc(docRef,{
              name:name
          })
          navigate(-1)
          toast.success("Category Updated",{
              autoClose:1000
          })             
    }
    }catch(error){
        console.log(error)
        setLoading(false)
        setErrMsg("Bad Connection! Check Your Network")
    }
  }

  const editCategoryInBrand = async() => {
    const brandRef = collection(db,"Brands")
    const allBrands = await getDocs(brandRef)
    allBrands.forEach(async(brand)=>{
      const Id = brand.id;
      const brandProducts = brand.data().products
      const updatedBrandProducts = brandProducts.map((product)=>{
        if(foundCategory.name === product.category){
          const updatedProduct = {
            ...product,
            category:name,
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
    })
    }

  useEffect(()=>{
    setName(foundCategory.name)
  },[])

  return (
    <div className="editCategory">
    <form className="editCategory-form" onSubmit={(e)=>e.preventDefault()}>
    <div className="form-title">
      <span><ChevronLeft onClick={closeEditing} style={{cursor:"pointer"}} size={30}/></span>
      <h2>Edit Category</h2>
      </div>
      <input type='text' 
      value={name} 
      onChange={(e)=>setName(e.target.value)}
      placeholder='Enter Category Name...'
      />
      <p className="error-msg">{errMsg}</p>
      { loading ? (
      <Loader/>
      ) : (
      <button onClick={()=>editCategoryData(foundCategory.id)}>Save Changes</button>
      )
      }
    </form>
  </div>
  )
}

export default EditCategory
