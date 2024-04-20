import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {Images, ChevronLeft } from "lucide-react"
import noUser from "../images/no-user-Img.png"
import { auth, db } from "../firebase"
import { doc, updateDoc,deleteDoc } from "firebase/firestore"
import { deleteUser } from "firebase/auth";
import { toast } from "react-toastify"
import "../css/UserAccount.css"
import Swal  from "sweetalert2"
import Loader from "./Loader"


const UserAccount = ({setViewUser}) => {
    const userData = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : []

    const [username,setUserName] = useState("")
    const [role,setRole] = useState("")
    const [warehouse,setWarehouse] = useState("")
    const [date,setDate] = useState("")
    const [NameDisabled,setNameDisabled] = useState(true)
    const [disabled,setdisabled] = useState(true)
    const [editing,setEditing] = useState(false)
    const [loading,setLoading] = useState(false)
    const [deleteLoader,setdeleteLoader] = useState(false)
    const navigate = useNavigate()
    
    const closeUser = () =>{
        setViewUser(false)
    }

    const allowEditing = () =>{
         setEditing(true)
         setNameDisabled(false)
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

    const showPopup = () =>{
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then(async(result) => {
            if (result.isConfirmed) {
                await deleteAccount()
            }
          });
    }

    const deleteAccount = () => {
        const user = auth.currentUser;
        deleteUser(user).then(async() => {
            const userDoc = doc(db,"users",user.uid) 
            await deleteDoc(userDoc)
            Swal.fire({
                title: "Deleted!",
                text: "Your account has been deleted.",
                icon: "success"
              });
            navigate("/login")
            console.log("deletion succesful")
          }).catch((error) => {
            console.log(error)
            Swal.fire({
                title: "An error occured!",
                text: "Check Your Network Connection",
                icon: "error"
              });
          });
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
               <span>{!NameDisabled && <Images />}</span>
            </div>
            <div className="user-second-section">
                <div>
                    <label>Username</label>
                    <input type="text" disabled={NameDisabled} 
                    style={NameDisabled ? {cursor:"not-allowed"}:{}}
                    value={username} onChange={(e)=>setUserName(e.target.value)} />
                </div>
                <div>
                    <label>Role</label>
                    <input style={disabled ? {cursor:"not-allowed"}:{}} disabled={disabled} 
                    type="text" value={role} readOnly />
                </div>
                <div>
                    <label>Warehouse</label>
                    <input style={disabled ? {cursor:"not-allowed"}:{}} disabled={disabled} 
                     type="text" value={warehouse} readOnly/>
                </div>
                <div>
                    <label>Account Created On</label>
                    <input style={disabled ? {cursor:"not-allowed"}:{}} disabled={disabled} 
                     type="text" value={date} readOnly/>
                </div>
            </div>
            { editing ? (
               loading ? (<Loader/>):(<button onClick={editUserInfo}>Save</button>)
            ) : (
                <button onClick={allowEditing}>Edit</button>
            )}
            <button onClick={showPopup} style={{background:"red"}}>Delete Account</button>
        </div>
    </div>
  )
}

export default UserAccount
