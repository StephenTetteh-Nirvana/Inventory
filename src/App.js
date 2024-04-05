import {Routes,Route, useNavigate} from "react-router-dom"
import { auth } from "./firebase.js"
import { onAuthStateChanged } from "firebase/auth"
import { useLocation } from "react-router-dom"
import "./App.css"
import Home from "./pages/Home.js"
import Login from "./pages/Login.js"
import Register from "./pages/Register.js"
import Dashboard from "./pages/Dashboard.js"
import NotFound from "./pages/NotFound.js"
import { useEffect } from "react"



function App() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(!user && (location.pathname === "/dashboard" || location.pathname === "/warehouse")){
        console.log("no-user")
        navigate("/login")
      }
    })
  },[])
  
 
return(
  <div className="App">
     <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="*" element={<NotFound/>}></Route>


        <Route path="/dashboard" element={<Dashboard/>}></Route>
      </Routes>
  </div>
)
}

export default App;
