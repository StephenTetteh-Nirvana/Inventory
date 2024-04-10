import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { collection, doc, getDocs, setDoc } from "firebase/firestore"
import { db } from "../firebase"
import { Loader } from "lucide-react"
import { toast } from "react-toastify"
import "../css/AddNewWarehouse.css"



const AddNewWarehouse = () => {
  const regularUsers = localStorage.getItem("regularUsers") !== null ? JSON.parse(localStorage.getItem("regularUsers")) : []
  const navigate = useNavigate()

  const [name,setName] = useState("")
  const [location,setLocation] = useState("")
  const [contact,setContact] = useState("")
  const [capacity,setCapacity] = useState("")
  const [manager,setManager] = useState("")
  const [errMsg,setErrMsg] = useState("")
  const [loading,setLoading] = useState(false)
  const [disabled,setdisabled] = useState(true)
  const [cancel,setCancel] = useState(false)


    const closePopup = () =>{
       navigate(-1)
    }


   const addWarehouse = async() =>{
    try{
      setLoading(true)
      setCancel(true)
        const colRef = doc(db,"Warehouses",name);
        await setDoc(colRef,{
            id:String(Math.round(Math.random()*1000)),
            name:name,
            location:location,
            contact:contact,
            capacity:capacity,
            manager:manager,
            products:[]
        })
        toast.success("WareHouse Added",{
          autoClose:1500
        })
        setLoading(false)
        navigate(-1)
    }catch(error){
      setLoading(false)
      setCancel(false)
     setErrMsg("Bad Connection! Check Your Network")
     console.log(error)
    }
   }

   const fetchLocalRegularUsers = () =>{
    try{
      if(regularUsers.length > 0 && manager === ""){
        setManager(regularUsers[0].userName);
      }
    }catch(error){
      console.log(error)
    }
  }
  
   useEffect(()=>{
    fetchLocalRegularUsers()
     if (name !== "" && location !== "" && contact !== "" && capacity !== "") {
      setdisabled(false);
    } else {
      setdisabled(true);
    }
   },[name,location,contact,capacity])

  return (
    <div className="new-warehouse-container">
       <form className="new-warehouse-form" onSubmit={(e)=>e.preventDefault()}>
          <h3>Add New Warehouse</h3>
          <div className="all-newWarehouse-inputs">
          <div className="warehouse-manager-section">
                <label>Assign Manager</label><br/>
                <select onChange={(e)=>setManager(e.target.value)}>
                    {regularUsers.length > 0 ? regularUsers.map((user)=>(
                      <option key={user.email}>{user.userName}</option>
                    )) : (<option>No Managers To Assign</option>)}
                </select>
            </div>
            <div className="new-warehouse-name">
                <label>Warehouse Name</label><br/>
                <input type="text" 
                value={name}
                onChange={(e)=>{setName(e.target.value)}}
                placeholder="Enter Warehouse Name"/>
            </div>
            <div className="new-warehouse-location">
                <label>Location</label><br/>
                <input type="text" 
                value={location}
                onChange={(e)=>{setLocation(e.target.value)}}
                placeholder="Location"/>
            </div>
            <div className="new-warehouse-contactInfo">
                <label>Contact Info</label><br/>
                <input type="text"
                value={contact}
                onChange={(e)=>{setContact(e.target.value)}} 
                placeholder="Contact Details"/>
            </div>
            <div className="new-warehouse-capacity">
                <label>Capacity</label><br/>
                <input type="number" 
                value={capacity}
                onChange={(e)=>{setCapacity(e.target.value)}}
                placeholder="Capacity"/>
            </div>
          </div>
          <p className="error-msg">{errMsg}</p>
          <div className="new-warehouse-buttons">
            <button 
            disabled={disabled} 
            style={disabled ? {cursor:"not-allowed",opacity:"0.7"} : {}}
            className="save-product-btn" onClick={addWarehouse}>{loading ? <Loader/> : "Save"}
            </button>
            <button disabled={cancel} 
            style={cancel ? {cursor:"not-allowed",opacity:"0.7"} : {}} 
            className="cancel-product-btn" onClick={closePopup}>Cancel</button>
          </div>
       </form>
    </div>
  )
}

export default AddNewWarehouse
