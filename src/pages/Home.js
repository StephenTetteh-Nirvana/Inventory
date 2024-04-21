import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";
import "../css/Home.css"
import Navbar from "../components/Navbar.jsx";
import Logo from "../images/logo.png"

const Home = () => {
  const userRole = localStorage.getItem("userRole") !== null ? JSON.parse(localStorage.getItem("userRole")) : []
  const [user,setUser] = useState(null)

  

  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setUser(true)
      }else{
        setUser(false)
      }
    })
    
  },[user])

    return(
     <div>
        <Navbar/>
        <div className="text-container">
           <img src={Logo} alt="Logo"/>
           <p>Welcome To Our Inventory Management System.The inventory system is a comprehensive solution designed to efficiently 
             manage and track all aspects of your inventory. Whether you're a small business or a large enterprise, 
             the inventory system offers scalability and flexibility to meet your unique inventory management needs.
             </p>
             { user ? (
                <div className="getStarted-btnBox">
                <Link to={`${userRole === "Regular" ? "/inventory" : userRole === "Admin" ?  "/dashboard" : ""}`}>
                <button>Manage inventory</button> 
                </Link>
               </div>
             ) : (
                <div className="getStarted-btnBox">
                <Link to="/login">
                <button>Get Started</button>
                </Link>
                </div>
             )
             }
        </div>
    </div>
    )
}

export default Home
