import "../css/Register.css"
import { Link } from "react-router-dom"
import Logo from "../images/logo.png"

const Register = () => {
  return (
    <div className="register-container">
      <form className="register-form-container" onSubmit={(e)=>e.preventDefault()}>
        <Link to="/"><div className="register-logo-box"><img src={Logo}/></div></Link>
        <h4>REGISTER FORM</h4>
        <div className="register-input-section">
        <div className="register-userName-section">
            <label>Username</label><br/>
            <input type="text" placeholder="UserName"/>
          </div>

          <div className="register-role-section">
            <label>Role</label><br/>
           <select>
            <option>Admin</option>
            <option>Regular</option>
           </select>
          </div>

          <div className="register-email-section">
            <label>Email</label><br/>
            <input type="text" placeholder="Email"/>
          </div>

          <div className="register-password-section">
            <label>Password</label><br/>
            <input type="password" placeholder="Password"/>
          </div>
        </div>
        <button>Sign Up</button>
        <p>Already Have An Account?<Link to="/login">Login</Link></p>
      </form>
    </div>
  )
}

export default Register;
