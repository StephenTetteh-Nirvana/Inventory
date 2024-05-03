import { useEffect, useState } from "react"
import { ChevronLeft } from "lucide-react"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../firebase"
import { toast } from "react-toastify"
import Loader from "./Loader"
import "../css/CategoryAdd.css"
import { useNavigate } from "react-router-dom"
import { connectFunctionsEmulator } from "firebase/functions"

const CategoryAdd = () => {
  const parsedData = JSON.parse(localStorage.getItem("categories")) !== null ? JSON.parse(localStorage.getItem("categories")) : []
  const [loading,setLoading] = useState(false)
  const [name,setName] = useState("")
  const [errMsg,setErrMsg] = useState("")
  const [disabled,setDisabled] = useState(true)
  const navigate = useNavigate()
  const date = new Date().toDateString();
  const time = new Date().toLocaleTimeString()

  const closeCategoryPopup = () =>{
    navigate(-1)
  }
  
  const addCategory = async () => {
    try {
      for (const data of parsedData) {
          if (name === data.name) {
              setErrMsg("Category Already Exists!");
              return;
          }
      }
      setLoading(true);
      setErrMsg("");
      const colRef = collection(db, "Categories");
      await addDoc(colRef, {
          name: name,
          createdAt: `${date} at ${time}`,
          products: []
      });
      navigate(-1);
      toast.success("Category Added", {
          autoClose: 1500
      });
    } catch (error) {
        setLoading(false);
        setErrMsg("Bad Connection! Check Your Network");
    }
}

  useEffect(()=>{
    if(name !== ""){
      setDisabled(false)
    }else{
      setDisabled(true)
    }
  },[name])

  return (
    <div className="catergoryPopup">
      <form className="catergoryAdd-form" onSubmit={(e)=>e.preventDefault()}>
      <div className="form-title">
           <span><ChevronLeft onClick={closeCategoryPopup} style={{cursor:"pointer"}} size={30}/></span>
           <h2>Add New Category</h2>
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
        <button onClick={addCategory} disabled={disabled} style={disabled ? {opacity:"0.7",cursor:"not-allowed"}:{}}>Done</button>
        )
        }
      </form>
    </div>
  )
}

export default CategoryAdd
