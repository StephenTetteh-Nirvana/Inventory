import { createUserWithEmailAndPassword } from "firebase/auth"
import { collection,doc,setDoc,serverTimestamp } from "firebase/firestore"
import { auth,db } from "../firebase"
import { Link,useNavigate } from "react-router-dom"
import "../css/Register.css"
import Logo from "../images/logo.png"
import { useEffect, useState } from "react"
import  Loader  from "../components/Loader.jsx"

const Register = () => {
  const [userName,setUsername] = useState("")
  const [role,setRole] = useState("Admin")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const [disabled,setdisabled] = useState(false)
  const [errMsg,setErrMsg] = useState("")
  const navigate = useNavigate()

    
  const RegisterUser = async() =>{
      try{
        setLoading(true)
         await createUserWithEmailAndPassword(auth,email,password)
         const user = auth.currentUser;
          const colRef = collection(db,"users")
          const userDoc = doc(colRef,user.uid)
          const date = new Date().toDateString();
          const time = new Date().toLocaleTimeString()
          await setDoc(userDoc,{
            userName:userName,
            email:email,
            role:role,
            sent: role === "Regular" && false,
            warehouse:`${role === "Admin" ? "Can't Assign Admin" : "Not Assigned"}`,
            createdAt:`${date} at ${time}`
          })
          navigate("/login")
      }catch(error){
        setLoading(false)
        console.log(error)
        if (error.code === 'auth/invalid-email') {
        setErrMsg("Invalid Email(eg.stephen@gmail.com)")
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
          setErrMsg("Weak Password(6 characters or more)")
        }
        else{
          setErrMsg("Bad Connection! Check Your Network")
        }
    } 
  }

  useEffect(()=>{
    if(userName !== "" && role !== "" && email !== "" && password !== ""){
      setdisabled(false)
    }else{
      setdisabled(true)
    }
  },[userName,role,email,password,])


  return (
    <div className="register-container">
      <form className="register-form-container" onSubmit={(e)=>e.preventDefault()}>
        <Link to="/"><div className="register-logo-box"><img src={Logo}/></div></Link>
        <h4>REGISTER FORM</h4>
        <div className="register-input-section">
        <div className="register-userName-section">
            <label>Username</label><br/>
            <input type="text" 
            placeholder="UserName"
            value={userName}
            onChange={(e)=>setUsername(e.target.value)}
            />
          </div>

          <div className="register-role-section">
            <label>Role</label><br/>
           <select onChange={(e)=>setRole(e.target.value)}>
            <option>Admin</option>
            <option>Regular</option>
           </select>
          </div>

          <div className="register-email-section">
            <label>Email</label><br/>
            <input type="text" 
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div className="register-password-section">
            <label>Password</label><br/>
            <input type="password" 
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
        </div>
        { loading ? (
          <Loader/>
        ) : (
          <button disabled={disabled}
           style={disabled ? {cursor:"not-allowed",opacity:"0.7"}:{}}
           onClick={RegisterUser}>Sign Up</button>
        )}
        {<h3 className="error-msg">{errMsg}</h3>}
        <p>Already Have An Account?<Link to="/login">Login</Link></p>
      </form>
    </div>
  )
}

export default Register;
