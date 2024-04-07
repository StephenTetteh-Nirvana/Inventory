import "../css/Home.css"
import Navbar from "../components/Navbar.jsx";
import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";

const Home = () => {
    const [width,setWidth] = useState(false)

    return(
        <div>
        <Navbar/>
        <div className="main-container">
            <Sidebar width={width} setWidth={setWidth}/>
            <div className={`content ${width ? "add-width" : ""}`}>
            <h1>Home</h1>
            </div>
        </div>
    </div>
    )
}

export default Home
