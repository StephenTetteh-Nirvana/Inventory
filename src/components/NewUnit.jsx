import { useEffect, useState } from "react"
import { ChevronLeft } from "lucide-react"
import { collection,addDoc } from "firebase/firestore"
import { db } from "../firebase"
import { toast } from "react-toastify"
import Loader from "./Loader"
import "../css/NewUnit.css"



const NewUnit = ({setNewUnit}) => {
    const [unitName,setUnitName] = useState("")
    const [loading,setLoading] = useState(false)
    const [errMsg,setErrMsg] = useState("")
    const [disabled,setDisabled] = useState(true)


    const closeUnitPopup = () =>{
        setNewUnit(false)
    }

    const handleChange = (event) => {
        const inputValue = event.target.value;
        // Use a regular expression to check if the input contains numbers
        if (!/\d/.test(inputValue) && !/[^\w\s]/.test(inputValue)) {
            setUnitName(inputValue);
            setErrMsg("")
        }else{
            setErrMsg("Numbers/symbols are not allowed")
        }
    };

    const addNewUnit = async() =>{
        try{
            setLoading(true)
            const colRef = collection(db,"Units")
            await addDoc(colRef,{
                unit:unitName
            })
            toast.success("Unit Added",{
                autoClose:1500
            })
            setLoading(false)
            setUnitName('')
        }catch(error){
            setLoading(false)
            setErrMsg("Bad Connection! Check Your Network")
        }
       
    }

    useEffect(()=>{
    if(unitName !== ""){
        setDisabled(false)
    }else{
        setDisabled(true)
    }
    },[unitName])


  return (
    <div className="newUnitPopup">
    <form className="newUnit-form" onSubmit={(e)=>e.preventDefault()}>
    <div className="form-title">
         <span><ChevronLeft onClick={closeUnitPopup} style={{cursor:"pointer"}} size={30}/></span>
         <h2>Add New Unit</h2>
      </div>
      <input type='text' 
      value={unitName} 
      onChange={handleChange}
      placeholder='Enter Unit(no numbers)...'
      />
      <p className="error-msg">{errMsg}</p>
      { loading ? (
      <Loader/>
      ) : (
      <button onClick={addNewUnit} 
      disabled={disabled} 
      style={disabled ? {opacity:"0.7",cursor:"not-allowed"}:{}}>Add Unit</button>
      )
      }
    </form>
  </div>
  )
}

export default NewUnit
