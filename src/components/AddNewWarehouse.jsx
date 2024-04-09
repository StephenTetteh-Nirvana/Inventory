import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { collection, doc, getDocs, setDoc } from "firebase/firestore"
import { db } from "../firebase"
import { Loader } from "lucide-react"
import { toast } from "react-toastify"
import "../css/AddNewWarehouse.css"



const AddNewWarehouse = () => {
  const RegularUsers = localStorage.getItem("regularUsers") !== null ? JSON.parse(localStorage.getItem("regularUsers")) : []
  const navigate = useNavigate()

  const [users,setUsers] = useState(null)
  const [name,setName] = useState("")
  const [location,setLocation] = useState("")
  const [contact,setContact] = useState("")
  const [capacity,setCapacity] = useState("")
  const [errMsg,setErrMsg] = useState("")
  const [loading,setLoading] = useState(false)
  const [disabled,setdisabled] = useState(true)

    const closePopup = () =>{
       navigate(-1)
    }

    
    const fetchUsers = async() => {
      const colRef = collection(db,"users");
      const getAllUsers = await getDocs(colRef)
      let userList = []

      getAllUsers.forEach((user)=>{
       const role = user.data().role;
        if(role === "Regular"){
          userList.push(user.data())
        }
      })
      localStorage.setItem("regularUsers",JSON.stringify(userList))
      setUsers(RegularUsers)
   }

   const addWarehouse = async() =>{
    try{
      setLoading(true)
        const colRef = doc(db,"Warehouses",name);
        await setDoc(colRef,{
            name:name,
            location:location,
            contact:contact,
            capacity:capacity
        })
        toast.success("WareHouse Added",{
          autoClose:1500
        })
        setLoading(false)
        navigate(-1)
    }catch(error){
      setLoading(false)
     setErrMsg("Bad Connection! Check Your Network")
     console.log(error)
    }
   }
  
   useEffect(()=>{
     fetchUsers()
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
                <select onChange={(e)=>console.log(e.target.value)}>
                    {users ? users.map((user)=>(
                        <option key={user.email}>{user.userName}</option>
                    )): (<option>Connect to the internet!!!</option>)}
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
          {<p className="error-msg">{errMsg}</p>}
          <div className="new-warehouse-buttons">
            <button disabled={disabled} style={disabled ? {cursor:"not-allowed",opacity:"0.7"} : {}}
             className="save-product-btn" onClick={addWarehouse}>{loading ? <Loader/> : "Save"}</button>
            <button className="cancel-product-btn" onClick={closePopup}>Cancel</button>
          </div>
       </form>
    </div>
  )
}

export default AddNewWarehouse
