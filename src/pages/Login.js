import { signInWithEmailAndPassword } from "firebase/auth"
import {auth,db} from "../firebase"
import { useEffect, useState  } from "react"
import { useNavigate  } from "react-router-dom"
import { Link } from "react-router-dom"
import "../css/Login.css"
import  Loader  from "../components/Loader.jsx"
import Logo from "../images/logo.png"
import { collection, doc, getDoc } from "firebase/firestore"

const Login = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [errMsg,setErrMsg] = useState("")
  const [disabled,setdisabled] = useState(false)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const LoginUser = async () =>{
    try{
      setLoading(true)
      await signInWithEmailAndPassword(auth,email,password);
      const user = auth.currentUser;
      localStorage.setItem("user",JSON.stringify(user))
      const colRef = collection(db,"users")
      const userDocRef = doc(colRef,user.uid)
      const retrieveDoc = await getDoc(userDocRef)
      if(retrieveDoc.exists()){
       const role = retrieveDoc.data().role;
       if(role === "Regular"){
        localStorage.setItem("userRole",JSON.stringify(role))
        navigate("/")
       }else{
        localStorage.setItem("userRole",JSON.stringify(role))
        navigate("/dashboard")
       }
      }else{
        console.log("user not Found")
      }
    }catch(error){
      setLoading(false)
      console.log(error)
      if (error.code === 'auth/invalid-email') {
      setErrMsg("Invalid Email(eg.stephen@gmail.com)")
      }else if (error.code === 'auth/invalid-credential') {
      setErrMsg("Wrong Email/Password")
      } else if (error.code === 'auth/wrong-password') {
      setErrMsg("Wrong Password")
      } else if (error.code === 'auth/user-not-found') {
      setErrMsg("User Not Found")
      }else if (error.code === 'auth/weak-password') {
      setErrMsg("Weak Password(6 characters or more)")
      }
      else {
      setErrMsg("Bad Connection! Check Your Network")
      console.log(error)
      }
    }
  }

  useEffect(()=>{
      if(email !== "" && password !== ""){
        setdisabled(false)
      }else{
        setdisabled(true)
      }
  },[email,password])

  return (
    <div className="login-container">
      <form className="login-form-container" onSubmit={(e)=>e.preventDefault()}>
        <Link to="/"><div className="login-logo-box"><img src={Logo} alt="logo"/></div></Link>
        <h4>LOGIN FORM</h4>
        <div className="login-input-section">
          <div className="login-email-section">
            <label>Email</label><br/>
            <input type="text" 
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div className="login-password-section">
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
          onClick={LoginUser}>Login</button>
        )}
        {<h3 className="error-msg">{errMsg}</h3>}
        <p>Don't Have An Account?<Link to="/register">Register</Link></p>
      </form>
    </div>
  )
}

export default Login
