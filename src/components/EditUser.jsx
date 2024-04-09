import { useState,useEffect } from "react"
import {useNavigate,useParams} from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { collection,doc,getDoc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import { toast } from "react-toastify"
import Loader from "../components/Loader.jsx"
import "../css/EditUser.css"


const EditUser = () => {
   const { id } = useParams()
   const userData = localStorage.getItem("userList") !== null ? JSON.parse(localStorage.getItem("userList")) : []
   const foundUser = userData.find((p)=> p.id === id)
   const [loading,setLoading] = useState(false)

   const [username,setUsername] = useState("")
   const [role,setRole] = useState("")
   const [warehouse,setWarehouse] = useState("Admin")
   const [errMsg,setErrMsg] = useState("")

   const navigate = useNavigate()

   const closeuserPopup = () =>{
      navigate(-1)
  }

  const editUser = async() =>{
     const colRef = collection(db,"users")
     const docRef = doc(colRef,id)
     const userDocRef = await getDoc(docRef)

     if(userDocRef.exists()){
      try{
         setLoading(true)
         await updateDoc(docRef,{
            role:role
         })
         setLoading(false)
         toast.success("User Updated",{
            autoClose:1000
          })
         navigate(-1)
      }catch(error){
         setErrMsg("Bad Connection! Check Your Network")
         console.log(error)
      }
     }
  }

  useEffect(()=>{
   setUsername(foundUser.userName)
   setRole(foundUser.role)
  },[])

  return (
    <div className="edit-user-container">
    <form onSubmit={(e)=>e.preventDefault()}>
    <div className="form-title">
       <span><ChevronLeft onClick={closeuserPopup} style={{cursor:"pointer"}} size={30}/></span>
       <h2>Edit User</h2>
    </div>
    
    <div className="edit-user-inputs">
         <div className="edit-username">
            <label>Username</label><br/>
            <input type="text" disabled value={username}/>
         </div>

        <div className="edit-role">
         <label>Role</label><br/>
         <select value={role}
          onChange={(e)=>setRole(e.target.value)}>
            <option>Admin</option>
            <option>Regular</option>
         </select>
        </div> 
        <div className="edit-warehouse">
         <label>Assign WareHouse</label><br/>
         <select value={warehouse}
          onChange={(e)=>setWarehouse(e.target.value)}>
            <option>WareHouse</option>
            <option>WareHouse</option>
         </select>
        </div> 
        {<p className="error-msg">{errMsg}</p>}
    </div>
    <div className="new-user-buttons">
        { loading ? (
            <Loader/>
        ) : (
            <button className="edit-user-saveBtn" onClick={()=>editUser()}>Save Changes</button>
        )}
    </div>
    </form>
</div>
  )
}

export default EditUser
