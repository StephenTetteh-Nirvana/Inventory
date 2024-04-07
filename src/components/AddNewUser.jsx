import { useState } from "react"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { serverTimestamp } from "firebase/firestore"
import { setDoc, collection,doc } from "firebase/firestore"
import { storage,db, auth } from "../firebase"
import {ChevronLeft, Images } from "lucide-react"
import { useNavigate } from "react-router-dom"
import noUser from "../images/no-user-Img.png"
import Loader from "../components/Loader"
import "../css/AddNewUser.css"


const AddNewUser = () => {
    const [file,setFile] = useState("")
    const [loading,setLoading] = useState(false)
    const [required,setRequired] = useState("")
    const [userNameRequired,setUserNameRequired] = useState("")
    const [Emailrequired,setEmailRequired] = useState("")
    const [Passwordrequired,setPasswordRequired] = useState("")

    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [role,setRole] = useState("Admin")
    const [password,setPassword] = useState("")
    const [errMsg,setErrMsg] = useState("")
    const [disabled,setdisabled] = useState(null)
    const [imageUrl,setImageUrl] = useState(null)
    const [Trackprogress,setTrackProgress] = useState(null)

    const navigate = useNavigate()

    const closeuserPopup = () =>{
        navigate("/users")
    }

    const handleImgChange = (e) =>{
        try{
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            uploadUserImg(selectedFile)
        }catch(error){
            console.log("upload cancelled")
        }
        
    }

    const uploadUserImg = (file) =>{
        const id = Math.round(Math.random * 100)
        const storageRef = ref(storage, 'images/' + file.name + id);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
        (snapshot) => {
            setdisabled(true)
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setTrackProgress(progress)
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
            }
        },
        (error) => {
            console.log(error)
            console.log("upload failed")
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setTrackProgress(null)
            setdisabled(false)
            console.log('File available at', downloadURL);
            setImageUrl(downloadURL)
            });
        })
    }

    const RegiserNewUser = async() =>{
        try{
            if(email === "" && password === ""){
                setRequired("Fill The Form")
                setUserNameRequired("Fill The Form")
                setEmailRequired("Fill The Form")
                setPasswordRequired("Fill The Form")
            }else{
            setLoading(true)
            await createUserWithEmailAndPassword(auth,email,password)
            const user = auth.currentUser;
            const colRef = collection(db,"users")
            const userDoc = doc(colRef,user.uid)
            await setDoc(userDoc,{
                userName:username,
                email:email,
                role:role,
                password:password,
                Img:imageUrl,
                createdAt:serverTimestamp()
          })
          navigate("/users")
          }
          }catch(error){
            console.log(error)
            if (error.code === 'auth/invalid-email') {
            setErrMsg("Invalid Email")
            }else if (error.code === 'auth/invalid-credential') {
            setErrMsg("Invalid Credentials")
            }else if (error.code === 'auth/email-already-in-use') {
            setErrMsg("Email Already Exists")
            }
            else if (error.code === 'auth/wrong-password') {
            setErrMsg("Incorrect Password")
            }
            else if (error.code === 'auth/email-already-exists') {
            setErrMsg("Email Already Exists")
            }else if (error.code === 'auth/weak-password') {
              setErrMsg("Weak Password(6 characters or more")
            }
            else{
              setErrMsg("Bad Connection! Check Your Network")
            }
        } 
    }

    

  return (
    <div className="add-user-container">
        <form onSubmit={(e)=>e.preventDefault()}>
        <div className="form-title">
           <span><ChevronLeft onClick={closeuserPopup} style={{cursor:"pointer"}} size={30}/></span>
           <h2>Add New User</h2>
        </div>
        
        <div className="userImg-section">
            <img src={imageUrl ? imageUrl : noUser} alt="noUser" />
            <label htmlFor="file-upload"><Images style={{cursor:"pointer"}} /></label>
            <input id="file-upload" type="file" onChange={handleImgChange} style={{display:"none"}}/>
        </div>
        {Trackprogress !== null && 
        <div className="Imgupload-track">
           <p className="progress">{`Image upload is ${Math.round(Trackprogress)}% done`}</p>
        </div>
        }
        <div className="new-user-inputs">
            <div className="new-userName">
             <label>Username</label><br/>
             <input type="text" 
             placeholder="Username" 
             onChange={(e)=>{
                setUsername(e.target.value)
                username === "" ? setUserNameRequired("Fill The Form") : setUserNameRequired("")
             }}
             className={`${userNameRequired !== "" ? "required" : ""}`}
             required
             />
            </div> 
            <div className="new-role">
             <label>Role</label><br/>
             <select onChange={(e)=>setRole(e.target.value)}>
                <option>Admin</option>
                <option>Regular</option>
             </select>
            </div> 
            <div className="new-email">
             <label>Email</label><br/>
             <input type="text" 
             placeholder="Email"
             value={email}
             onChange={(e)=>{
                setEmail(e.target.value)
                email === "" ? setEmailRequired("Fill The Form") : setEmailRequired("")
             }}
             className={`${Emailrequired !== ""  ? "required" : ""}`}
             required
             />
            </div> 
            <div className="new-password">
             <label>Password</label><br/>
             <input type="password" 
             placeholder="Password"
             value={password}
             onChange={(e)=>{
                setPassword(e.target.value)
                password === "" ? setPasswordRequired("Fill The Form") : setPasswordRequired("")
             }}
             className={`${Passwordrequired !== ""  ? "required" : ""}`}
             required
             />
            </div>
            {username === "" || email === "" || password === "" ? <p className="error-msg">{required}</p> : ""} 
            {<p className="error-msg">{errMsg}</p>}
        </div>
        <div className="new-user-buttons">
            { loading ? (
                <Loader/>
            ) : (
                <button disabled={disabled} 
                className={`new-user-saveBtn ${disabled ? "disabled" : ""}`}
                style={disabled ? {cursor:"not-allowed"} : {}} 
                onClick={()=>RegiserNewUser()}>Save</button>
            )}
        </div>
        </form>
    </div>
  )
}

export default AddNewUser
