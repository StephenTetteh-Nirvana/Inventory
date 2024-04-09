import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import "../css/Warehouse.css"
import { Link } from "react-router-dom";

const Warehouse = () => {
    const [width,setWidth] = useState(false)

  return (
    <div>
        <Navbar/>
        <div className="main-container">
            <Sidebar width={width} setWidth={setWidth}/>
            <div className={`content ${width ? "add-width" : ""}`}>
                <div className="warehouse-buttons">
                  <Link to="/warehouse/add">
                    <button className="add-warehouse-btn">Add Warehouse</button>  
                  </Link>
                <input type="text" placeholder="Search by name..."/> 
                </div>
              <div className="warehouse-container">
                <ul>
                    <li>Warehouse Name</li>
                    <li>Location</li>
                    <li>Contact Info</li>
                    <li>Capacity</li>
                    <li>Actions</li>
                </ul>
                <div className="warehouse">
                    <div>Fruits Warehouse</div>
                    <div>Tantra Hills</div>
                    <div>0244642497</div>
                    <div>400</div>
                    <div>View/Delete</div>
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Warehouse
