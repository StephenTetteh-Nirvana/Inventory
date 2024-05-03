import { LayoutDashboard,Warehouse,UsersRound,ArrowLeft,ArrowRight,SquareMenu,Notebook} from "lucide-react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "../css/Sidebar.css"

const Sidebar = ({width,setWidth}) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation()

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setWidth(!width)
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
    <div className="toggle-btn-container">
        <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <ArrowLeft size={25} /> : <ArrowRight size={25} />}
        </button>
    </div>
     
      <ul>
        <Link style={{color:"white",textDecoration:"none"}}  to="/dashboard">
        <li className={`${location.pathname === "/dashboard" ? "active" : ''}`}>
          <LayoutDashboard />
          {isOpen && <p>Dashboard</p>}
        </li>
        </Link>
        <Link style={{color:"white",textDecoration:"none"}}  to="/categories">
        <li className={`${location.pathname === "/categories" ? "active" : ''}`}>
          <SquareMenu />
          {isOpen && <p>Categories</p>}
        </li>
        </Link>
        <Link style={{color:"white",textDecoration:"none"}}  to="/brands">
        <li className={`${location.pathname === "/brands" ? "active" : ''}`}>
          <Notebook /> 
          {isOpen && <p>Brands</p>}
        </li>
        </Link>
        <Link style={{color:"white",textDecoration:"none"}} to="/warehouse">
        <li className={`${location.pathname === "/warehouse" ? "active" : ''}`}>
          <Warehouse />
          {isOpen && <p>Warehouse</p>}
        </li>
        </Link>
        <Link style={{color:"white",textDecoration:"none"}} to="/users">
        <li className={`${location.pathname === "/users" ? "active" : ''}`}>
          <UsersRound />
          {isOpen && <p>Users</p>}
        </li>
        </Link>
      </ul>
    </div>
     )
}

export default Sidebar
