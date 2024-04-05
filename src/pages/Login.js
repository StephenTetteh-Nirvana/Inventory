import { signInWithEmailAndPassword } from "firebase/auth"
import {auth} from "../firebase"
import { useState  } from "react"
import { useNavigate  } from "react-router-dom"
import { Link } from "react-router-dom"
import "../css/Login.css"
import  Loader  from "../components/Loader.jsx"
import Logo from "../images/logo.png"

const Login = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [errMsg,setErrMsg] = useState("")
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const LoginUser = async () =>{
    try{
      setLoading(true)
      await signInWithEmailAndPassword(auth,email,password);
      const user = auth.currentUser;
      console.log(user.uid)
      navigate("/dashboard")
    }catch(error){
      setLoading(false)
      console.log(error)
      if (error.code === 'auth/invalid-email') {
      setErrMsg("Invalid Email")
      }else if (error.code === 'auth/invalid-credential') {
      setErrMsg("Invalid Credential")
      } else if (error.code === 'auth/wrong-password') {
      setErrMsg("Wrong Password")
      } else if (error.code === 'auth/user-not-found') {
      setErrMsg("User Not Found")
      }else if (error.code === 'auth/weak-password') {
      setErrMsg("Weak Password")
      }
      else {
      setErrMsg("Bad Connection! Check Your Network")
      }
    }
  }

  return (
    <div className="login-container">
      <form className="login-form-container" onSubmit={(e)=>e.preventDefault()}>
        <Link to="/"><div className="login-logo-box"><img src={Logo}/></div></Link>
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
          <button onClick={LoginUser}>Login</button>
        )}
        {<h3 className="error-msg">{errMsg}</h3>}
        <p>Don't Have An Account?<Link to="/register">Register</Link></p>
      </form>
    </div>
  )
}

export default Login
