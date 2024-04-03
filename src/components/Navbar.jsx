import { Link } from "react-router-dom"
import { User,Settings,LogOut  } from "lucide-react"
import Logo from "../images/logo.png"
import "../css/Navbar.css"

const Navbar = ({user}) => {
  return (
    <div className="navbar-container">
      <div className="first-section">
        <img src={Logo} alt='Logo'/>
        <h3>INVENTORY</h3>
      </div>
      <div className="second-section">
        {
          user ? (
            <div className="user-section">
              <div className="userName-box">
              <h3>S</h3>  
              </div>
              
              <div className="user-popup">
                <ul>
                  <li>
                    <User/>
                    <p>Account</p>
                  </li>
                  <li>
                    <Settings />
                    <p>Settings</p>
                  </li>
                  <li>
                    <LogOut />
                    <p>LogOut</p>
                  </li>
                </ul>
              </div>

            </div>
          ) : (
            <div className="no-user-buttons">
              <Link to="/login">
              <button className="no-user-login">Login</button>
              </Link>

              <Link to="/register">
              <button className="no-user-register">Register</button>
              </Link>
            </div>
          )
        }
       
      </div>
    </div>
  )
}

export default Navbar
