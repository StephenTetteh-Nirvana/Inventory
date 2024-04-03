import Logo from "../images/logo.png"
import "../css/Navbar.css"

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="first-section">
        <img src={Logo} alt='Logo'/>
        <h3>INVENTORY</h3>
      </div>
      <div className="second-section">
        <h3>S</h3>
      </div>
    </div>
  )
}

export default Navbar
