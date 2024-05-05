import {Routes,Route, useNavigate} from "react-router-dom"
import { useEffect } from "react"
import { auth } from "./firebase.js";
import { useLocation } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import { onAuthStateChanged } from "firebase/auth/cordova";
import "./App.css"
import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/Home.js"
import Login from "./pages/Login.js"
import Register from "./pages/Register.js"
import Dashboard from "./pages/Dashboard.js"
import NewProduct from "./pages/NewProduct.js"
import EditProduct from "./pages/EditProduct.js"
import CategoriesPage from "./pages/CategoriesPage.js";
import NewCategory from "./pages/NewCategory.js";
import EditCategoryPage from "./pages/EditCategoryPage.js";
import Brands from "./pages/Brands.js";
import NewBrand from "./pages/NewBrand.js";
import Warehouse from "./pages/Warehouse.js"
import NewWarehouse from "./pages/NewWarehouse.js"
import EditWarehouse from "./pages/EditWarehouse.js"
import Users from "./pages/Users.js"
import NotFound from "./pages/NotFound.js"
import NewUser from "./pages/NewUser.js"
import Inventory from "./pages/Inventory.js"
import NewInventoryPage from "./pages/NewInventoryPage.js"
import EditBrandPage from "./pages/EditBrandPage.js";



function App() {
  const userRole = localStorage.getItem("userRole") !== null ? JSON.parse(localStorage.getItem("userRole")) : []
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(()=>{
    if(userRole === "Regular" && 
    (location.pathname === "/dashboard" || location.pathname === "/categories" 
    || 
    location.pathname === "/users" ||  location.pathname === "/brands")){
      console.log("no-user",)
      navigate("/")
    }
    onAuthStateChanged(auth,(user)=>{
      if(!user && (location.pathname === "/dashboard" || location.pathname === "/categories" 
      || 
      location.pathname === "/users" || location.pathname === "/brands")){
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
        <Route path="/categories" element={<CategoriesPage/>}></Route>
        <Route path="/categories/add" element={<NewCategory/>}></Route>
        <Route path="/categories/edit/:id" element={<EditCategoryPage/>}></Route>
        <Route path="/brands" element={<Brands/>}></Route>
        <Route path="/brands/add" element={<NewBrand/>}></Route>
        <Route path="/brands/edit/:id" element={<EditBrandPage/>}></Route>
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
