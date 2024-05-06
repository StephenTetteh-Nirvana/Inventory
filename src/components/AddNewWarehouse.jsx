import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore"
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
      setdisabled(true)
      setCancel(true)
        const colRef = doc(db,"Warehouses",name);
        await setDoc(colRef,{
            name:name,
            location:location,
            contact:contact,
            manager:manager,
            products:[]
        })
        await assignWarehouseToUser()
        toast.success("WareHouse Added",{
          autoClose:1500
        })
        setLoading(false)
        navigate(-1)
    }catch(error){
      setdisabled(false)
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

  const assignWarehouseToUser = async() =>{
      const colRef = collection(db,"users")
      const usersRef = await getDocs(colRef)

      usersRef.forEach(async(user)=>{
        const userName = user.data().userName;
        if(manager === userName){
          const userDocRef = doc(db,"users",user.id)
          await updateDoc(userDocRef,{
            warehouse:name
          })
        }
      })
  }
  
  // eslint-disable-next-line
  useEffect(()=>{
    fetchLocalRegularUsers()
  },[])
  
  useEffect(()=>{
    if (name !== "" && location !== "" && contact !== "") {
    setdisabled(false);
  } else {
    setdisabled(true);
  }
  },[name,location,contact,manager])

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
