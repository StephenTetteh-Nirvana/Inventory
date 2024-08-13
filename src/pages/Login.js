import { useEffect, useState  } from "react"
import { useNavigate,Link  } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { collection, doc, getDoc } from "firebase/firestore"
import { auth,db } from "../firebase"
import { Eye,EyeOff } from "lucide-react"
import  Loader  from "../components/Loader.jsx"
import Logo from "../images/logo.png"
import "../css/Login.css"

const Login = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [viewPassword,setViewPassword] = useState(false)
  const [errMsg,setErrMsg] = useState("")
  const [disabled,setdisabled] = useState(false)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const LoginUser = async () =>{
    try{
      setErrMsg("")
      setLoading(true)
      await signInWithEmailAndPassword(auth,email,password);
      const user = auth.currentUser;
      localStorage.setItem("user",JSON.stringify(user))
      const colRef = collection(db,"users")
      const userDocRef = doc(colRef,user.uid)
      const retrieveDoc = await getDoc(userDocRef)
      if(retrieveDoc.exists()){
       const role = retrieveDoc.data().role
       const username = retrieveDoc.data().userName
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

  const displayPassword = () =>{
    setViewPassword(!viewPassword)
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
            <input type={viewPassword ? "text" : "password"} 
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <div onClick={displayPassword}>
              {viewPassword ? (<span><EyeOff color="grey" style={{cursor:"pointer"}}/></span>) 
              : 
              (<span><Eye color="grey" style={{cursor:"pointer"}}/></span>)
              }
            </div>
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
