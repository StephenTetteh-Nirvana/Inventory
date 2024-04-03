import "../css/Login.css"
import { Link } from "react-router-dom"
import Logo from "../images/logo.png"

const Login = () => {
  return (
    <div className="login-container">
      <form className="login-form-container">
        <Link to="/"><div className="login-logo-box"><img src={Logo}/></div></Link>
        <h4>LOGIN FORM</h4>
        <div className="login-input-section">
          <div className="login-email-section">
            <label>Email</label><br/>
            <input type="text" placeholder="Email"/>
          </div>

          <div className="login-password-section">
            <label>Password</label><br/>
            <input type="password" placeholder="Password"/>
          </div>
        </div>
        <button>Login</button>
        <p>Don't Have An Account?<Link to="/register">Register</Link></p>
      </form>
    </div>
  )
}

export default Login
