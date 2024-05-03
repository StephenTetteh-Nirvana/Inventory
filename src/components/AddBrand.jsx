import { useState,useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { collection,addDoc } from "firebase/firestore"
import { db } from "../firebase"
import { toast } from "react-toastify"
import Loader from "./Loader"
import "../css/AddBrand.css"

const AddBrand = () => {
    const [name,setName] = useState("")
    const [loading,setLoading] = useState(false)
    const [disabled,setDisabled] = useState(true)
    const [errMsg,setErrMsg] = useState("")
    const navigate = useNavigate()
    const date = new Date().toDateString();
    const time = new Date().toLocaleTimeString()

    const closeBrandPopup = () =>{
        navigate(-1)
    }

    const addBrand = async () => {
        try {
        //   for (const data of parsedData) {
        //       if (name === data.name) {
        //           setErrMsg("Category Already Exists!");
        //           return;
        //       }
        //   }
          setLoading(true);
          setErrMsg("");
          const colRef = collection(db, "Brands");
          await addDoc(colRef, {
              name: name,
              createdAt: `${date} at ${time}`,
              products: []
          });
          navigate(-1);
          toast.success("Brand Added", {
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
    <div className="addBrandPopup">
      <form className="addBrand-form" onSubmit={(e)=>e.preventDefault()}>
      <div className="form-title">
           <span><ChevronLeft onClick={closeBrandPopup} style={{cursor:"pointer"}} size={30}/></span>
           <h2>Add New Brand</h2>
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
        <button onClick={addBrand} disabled={disabled} style={disabled ? {opacity:"0.7",cursor:"not-allowed"}:{}}>Done</button>
        )
        }
      </form>
    </div>
  )
}

export default AddBrand
