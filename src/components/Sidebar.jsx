import { LayoutDashboard,ShoppingBasket,Warehouse,UsersRound,FileText,MessageCircleWarning,ArrowLeft,ArrowRight } from "lucide-react"
import { useState } from "react"
import "../css/Sidebar.css"

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
    <div className="toggle-btn-container">
        <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <ArrowLeft size={25} /> : <ArrowRight size={25} />}
        </button>
    </div>
     
      <ul>
        <li>
          <LayoutDashboard />
          {isOpen && <p>Dashboard</p>}
        </li>
        
        <li>
          <Warehouse />
          {isOpen && <p>Warehouse</p>}
        </li>
        <li>
          <ShoppingBasket />
          {isOpen && <p>Products</p>}
        </li>
        <li>
          <FileText />
          {isOpen && <p>Orders</p>}
        </li>
        <li>
          <UsersRound />
          {isOpen && <p>Users</p>}
        </li>
        <li>
          <MessageCircleWarning />
          {isOpen && <p>Report</p>}
        </li>
      </ul>
    </div>
     )
}

export default Sidebar
