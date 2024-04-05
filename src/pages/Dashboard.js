import "../css/Dashboard.css"
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import InventoryStats from "../components/InventoryStats.jsx";
import ProductsTable from "../components/ProductsTable.jsx";
import { useState } from "react";

const Dashboard = () => {
    const [width,setWidth] = useState(false)

    return(
    <div>
        <Navbar/>
        <div className="main-container">
            <Sidebar width={width} setWidth={setWidth}/>
            <div className={`content ${width ? "add-width" : ""}`}>
            <InventoryStats />
            <ProductsTable />
            </div>
        </div>
    </div>
     )
}

export default Dashboard
