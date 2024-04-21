import {Routes,Route, useNavigate} from "react-router-dom"
import { useEffect } from "react"
import { auth } from "./firebase.js";
import { useLocation } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/Home.js"
import Login from "./pages/Login.js"
import Register from "./pages/Register.js"
import Dashboard from "./pages/Dashboard.js"
import NewProduct from "./pages/NewProduct.js"
import EditProduct from "./pages/EditProduct.js"
import Warehouse from "./pages/Warehouse.js"
import NewWarehouse from "./pages/NewWarehouse.js"
import EditWarehouse from "./pages/EditWarehouse.js"
import Users from "./pages/Users.js"
import NotFound from "./pages/NotFound.js"
import NewUser from "./pages/NewUser.js"
import Inventory from "./pages/Inventory.js"
import NewInventoryPage from "./pages/NewInventoryPage.js"
import "./App.css"
import { onAuthStateChanged } from "firebase/auth/cordova";


function App() {
  const userRole = localStorage.getItem("userRole") !== null ? JSON.parse(localStorage.getItem("userRole")) : []
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(()=>{
    if(userRole === "Regular" && 
    (location.pathname === "/dashboard" || location.pathname === "/warehouse" || location.pathname === "/users")){
      console.log("no-user",)
      navigate("/")
    }
    onAuthStateChanged(auth,(user)=>{
      if(!user && (location.pathname === "/dashboard" || location.pathname === "/warehouse" || location.pathname === "/users")){
        navigate("/login")
      }
    })
  },[])
  
 
return(
  <div className="App">
    <ToastContainer/>
     <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="*" element={<NotFound/>}></Route>


        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/dashboard/add" element={<NewProduct/>}></Route>
        <Route path="/dashboard/editProduct/:id" element={<EditProduct/>}></Route>
        <Route path="/warehouse" element={<Warehouse/>}></Route>
        <Route path="/warehouse/add" element={<NewWarehouse/>}></Route>
        <Route path= "/warehouse/edit/:id" element={<EditWarehouse/>}></Route>
        <Route path="/users" element={<Users/>}></Route>
        <Route path="/users/new" element={<NewUser/>}></Route>
        <Route path="/inventory" element={<Inventory/>}></Route>
        <Route path="/inventory/add" element={<NewInventoryPage/>}></Route>
      </Routes>
  </div>
)
}

export default App;
