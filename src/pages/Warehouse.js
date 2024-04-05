import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import AddNewWarehouse from "../components/AddNewWarehouse.jsx";
import "../css/Warehouse.css"

const Warehouse = () => {
    const [width,setWidth] = useState(false)
    const [warehousePopup,setWarehousePopup] = useState(false)

    const toggleWarehousePopup = () =>{
        setWarehousePopup(true)
    }

  return (
    <div>
        <Navbar/>
        <div className="main-container">
            <Sidebar width={width} setWidth={setWidth}/>
            <div className={`content ${width ? "add-width" : ""}`}>
                <div className="warehouse-buttons">
                <button onClick={toggleWarehousePopup} className="add-warehouse-btn">Add Warehouse</button>
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
        {warehousePopup && <AddNewWarehouse warehousePopup={warehousePopup} setWarehousePopup={setWarehousePopup}/>}
    </div>
  )
}

export default Warehouse
