import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { User,Settings,LogOut  } from "lucide-react"
import Logo from "../images/logo.png"
import "../css/Navbar.css"
import { auth, db } from "../firebase"
import { doc,getDoc } from "firebase/firestore"
import { signOut } from "firebase/auth"


const Navbar = () => {
  const [displayName,setDisplayName] = useState("")
  const [LoggedIn,setLoggedIn] = useState(null)

  const logOut = async() =>{
    await signOut(auth)
    .then(()=>{
      alert("You Logged Out")
    }).catch((error)=>{
      alert(error)
    })
  }


  useEffect(()=>{
    const fetchUser = async() =>{
      try{
        const userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : []
        if(userData){
          console.log("logged in")
          setLoggedIn(true)
          const colRef = doc(db,"users",userData.uid)
          const docRef = await getDoc(colRef)
      
          if(docRef.exists){
          setDisplayName(docRef.data().userName[0])
          }
          }else{
            console.log("no-user")
            setLoggedIn(false)
          }
      }catch(error){
        console.log(error)
      }
    }
    fetchUser()
  },[])
  
  return (
    <div className="navbar-container">
      <div className="first-section">
        <img src={Logo} alt='Logo'/>
        <h3>INVENTORY</h3>
      </div>
      <div className="second-section">
        {
          LoggedIn ? (
            <div className="user-section">
              <div className="userName-box">
              <h3>{displayName}</h3>  
              </div>
              
              <div className="user-popup">
                <ul>
                  <li>
                    <User/>
                    <p>Account</p>
                  </li>
                  <li>
                    <Settings />
                    <p>Settings</p>
                  </li>
                  <li onClick={logOut}>
                    <LogOut />
                    <p>LogOut</p>
                  </li>
                </ul>
              </div>

            </div>
          ) : (
            <div className="no-user-buttons">
              <Link to="/login">
              <button className="no-user-login">Login</button>
              </Link>

              <Link to="/register">
              <button className="no-user-register">Register</button>
              </Link>
            </div>
          )
        }
       
      </div>
    </div>
  )
}

export default Navbar
