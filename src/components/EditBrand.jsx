import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { toast } from "react-toastify"
import { doc,updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import Loader from "./Loader"
import "../css/EditBrand.css"

const EditBrand = () => {
    const parsedData = JSON.parse(localStorage.getItem("brands")) !== null ? JSON.parse(localStorage.getItem("brands")) : []
    const { id } = useParams()
    const foundBrand = parsedData.find((b)=>b.id === id)
    const [name,setName] = useState("")
    const [loading,setLoading] = useState(false)
    const [errMsg,setErrMsg] = useState("")
    const navigate = useNavigate()

    const closeEditing = () =>{
        navigate(-1)
    }

    const editBrandData = async(brandID) => {
        try{
            if(name === ""){
                toast.error("Brand must be filled",{
                    position:"top-center"
                })
            }else{
                for (const data of parsedData) {
                    if (name === data.name) {
                        setErrMsg("Brand Already Exists!");
                        return;
                    }
                }
            setLoading(true)
            const docRef = doc(db,"Brands",brandID)
            await updateDoc(docRef,{
                name:name
            })
            navigate(-1)
            toast.success("Brand Updated",{
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
        setName(foundBrand.name)
      },[])


  return (
    <div className="editBrand">
    <form className="editBrand-form" onSubmit={(e)=>e.preventDefault()}>
    <div className="form-title">
      <span><ChevronLeft onClick={closeEditing} style={{cursor:"pointer"}} size={30}/></span>
      <h2>Edit Brand</h2>
      </div>
      <input type='text' 
      value={name} 
      onChange={(e)=>setName(e.target.value)}
      placeholder='Enter Brand Name...'
      />
      <p className="error-msg">{errMsg}</p>
      { loading ? (
      <Loader/>
      ) : (
      <button onClick={()=>editBrandData(foundBrand.id)}>Save Changes</button>
      )
      }
    </form>
  </div>
  )
}

export default EditBrand
