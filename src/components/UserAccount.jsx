import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {Images, ChevronLeft } from "lucide-react"
import noUser from "../images/no-user-Img.png"
import { auth, db, storage } from "../firebase"
import { doc, updateDoc,deleteDoc } from "firebase/firestore"
import { deleteUser } from "firebase/auth";
import { toast } from "react-toastify"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import "../css/UserAccount.css"
import Swal  from "sweetalert2"
import Loader from "./Loader"


const UserAccount = ({setViewUser}) => {
    const userData = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : []

    const [username,setUserName] = useState("")
    const [role,setRole] = useState("")
    const [warehouse,setWarehouse] = useState("")
    const [date,setDate] = useState("")
    const [imageUrl,setImageUrl] = useState("")
    const [file,setFile] = useState("")
    const [Trackprogress,setTrackProgress] = useState(null)
    const [NameDisabled,setNameDisabled] = useState(true)
    const [disabled] = useState(true)
    const [btnDisabled,setbtnDisabled] = useState(false)
    const [editing,setEditing] = useState(false)
    const [loading,setLoading] = useState(false)
    const [errMsg,setErrMsg] = useState("")
    // const [deleteLoader,setdeleteLoader] = useState(false)
    const navigate = useNavigate()
    
    const closeUser = () =>{
        setViewUser(false)
    }

    const allowEditing = () =>{
         setEditing(true)
         setNameDisabled(false)
    }

    const handleProductImg = (e) =>{
        try{
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            uploadProductImg(selectedFile)
            console.log(file)
        }catch(error){
            console.log("upload cancelled")
        } 
    }
  

    const uploadProductImg = (file) =>{
        const id = String(Math.round(Math.random * 100))
        const storageRef = ref(storage, 'images/' + file.name + id);
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on('state_changed', 
        (snapshot) => {
           setbtnDisabled(true)
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setTrackProgress(progress)
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
            default:
                console.log("failed")
            break;
            }  
        },
        (error) => {
            console.log(error)
            console.log("upload failed")
            toast.error("Image Upload Failed")
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setImageUrl(downloadURL)
            setbtnDisabled(false)
            setTrackProgress(null)
            });
        })
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
                Img:imageUrl,
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
            navigate("/login")
            Swal.fire({
                title: "Deleted!",
                text: "Your account has been deleted.",
                icon: "success"
              });
            console.log("deletion succesful")
          }).catch((error) => {
            console.log(error)
              switch (error.code) {
                case "auth/invalid-user-token":
                 setErrMsg("Invalid user token");
                  break;
                case "auth/user-not-found":
                 setErrMsg("User not found");
                  break;
                case "auth/requires-recent-login":
                 setErrMsg("Session Expired! Login again to delete account");
                  break;
                case "auth/insufficient-permission":
                 setErrMsg("Insufficient permission");
                  break;
                default:
                    Swal.fire({
                        title: "An error occured!",
                        text: "Check Your Network Connection",
                        icon: "error"
                      });
                  break;
              }
          });
    }

    useEffect(()=>{
       setImageUrl(userData.Img)
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
               <img src={imageUrl ? imageUrl : noUser} alt="noUser" />
               {!NameDisabled && <span>
                <label htmlFor="file-upload"><Images style={{cursor:"pointer"}} /></label>
                <input id="file-upload" type="file" onChange={handleProductImg} style={{display:"none"}}/>
               </span>
               }
            </div>
            {Trackprogress !== null && 
                <div className="Imgupload-track">
                <p className="progress">{`Image upload is ${Math.round(Trackprogress)}% done`}</p>
                </div>
            }
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
                {<p className="error-msg">{errMsg}</p>}
            </div>
            { editing ? (
               loading ? (<Loader/>):(<button 
                style={btnDisabled ? {cursor:"not-allowed",opacity:"0.7"}:{}} 
                disabled={btnDisabled}  onClick={editUserInfo}>Save</button>
            )
            ) : (
                <button onClick={allowEditing}>Edit</button>
            )}
            <button onClick={showPopup} 
            style={btnDisabled ? {background:"red",cursor:"not-allowed",opacity:"0.7"}:{background:"red"}} 
            disabled={btnDisabled}>Delete Account</button>
        </div>
    </div>
  )
}

export default UserAccount
