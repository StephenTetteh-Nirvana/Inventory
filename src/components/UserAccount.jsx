import {Images, ChevronLeft } from "lucide-react"
import noUser from "../images/no-user-Img.png"
import "../css/UserAccount.css"
import { useEffect, useState } from "react"
import { auth, db } from "../firebase"
import { doc, updateDoc } from "firebase/firestore"
import { toast } from "react-toastify"
import Loader from "./Loader"


const UserAccount = ({setViewUser}) => {
    const userData = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : []

    const [username,setUserName] = useState("")
    const [role,setRole] = useState("")
    const [warehouse,setWarehouse] = useState("")
    const [date,setDate] = useState("")
    const [disabled,setdisabled] = useState(true)
    const [editing,setEditing] = useState(false)
    const [loading,setLoading] = useState(false)
    
    const closeUser = () =>{
        setViewUser(false)
    }

    const allowEditing = () =>{
         setEditing(true)
         setdisabled(false)
    }

    const editUserInfo = async() =>{
        try{
            if(username === ""){
                toast.error("Username must be filled",{
                    autoClose:"2000",
                    position:"top-center"
                })
            }else{
            setLoading(true)
            const user = auth.currentUser
            const docRef = doc(db,"users",user.uid)
    
            await updateDoc(docRef,{
                userName:username
            })
            toast.success("User Profile Updated",{
                autoClose:1500
            })
            setViewUser(false)
        }
        }catch(error){
            console.log(error)
            toast.error("Network Error")
            setLoading(false)
        }   
    }

    useEffect(()=>{
       setUserName(userData.userName)
       setRole(userData.role)
       setWarehouse(userData.warehouse)
       setDate(userData.createdAt)
    },[])

  return (
    <div className="user-profile-container">
        <div className="user-profile-form">
            <div className="user-header-section">
            <span><ChevronLeft size={30} style={{cursor:"pointer"}} onClick={closeUser}/></span>
            <h3>Account Information</h3>
            </div>
            <div className="user-first-section">
               <img src={userData.Img ? userData.Img : noUser} alt="user"/>
               <span>{!disabled && <Images />}</span>
            </div>
            <div className="user-second-section">
                <div>
                    <label>Username</label>
                    <input type="text" disabled={disabled} 
                    style={disabled ? {cursor:"not-allowed"}:{}}
                    value={username} onChange={(e)=>setUserName(e.target.value)} />
                </div>
                <div>
                    <label>Role</label>
                    <input style={{outline:"none"}}
                    type="text" value={role} readOnly />
                </div>
                <div>
                    <label>Warehouse</label>
                    <input style={{outline:"none"}}
                     type="text" value={warehouse} readOnly/>
                </div>
                <div>
                    <label>Account Created On</label>
                    <input style={{outline:"none"}}
                     type="text" value={date} readOnly/>
                </div>
            </div>
            { editing ? (
               loading ? (<Loader/>):(<button onClick={editUserInfo}>Save</button>)
            ) : (
                <button onClick={allowEditing}>Edit</button>
            )}
        </div>
    </div>
  )
}

export default UserAccount
