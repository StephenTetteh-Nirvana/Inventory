import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { updateDoc,doc } from "firebase/firestore"
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
        setLoading(true)
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

  useEffect(()=>{
    setName(foundCategory.name)
  },[])

  return (
    <div className="catergoryPopup">
    <form className="catergoryAdd-form" onSubmit={(e)=>e.preventDefault()}>
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
