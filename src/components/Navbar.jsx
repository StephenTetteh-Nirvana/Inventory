import { useEffect, useState } from "react"
import { Link,useNavigate } from "react-router-dom"
import { User,Settings,LogOut  } from "lucide-react"
import { auth, db } from "../firebase"
import { doc,getDoc } from "firebase/firestore"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { toast } from "react-toastify"
import Logo from "../images/logo.png"
import "../css/Navbar.css"


const Navbar = () => {
  const userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : []
  const [displayName,setDisplayName] = useState("")
  const [LoggedIn,setLoggedIn] = useState(false)
  const [userImg,setUserImg] = useState(null)
  const navigate = useNavigate()

  const logOut = async() =>{
    await signOut(auth)
    .then(()=>{
      navigate("/login")
      setLoggedIn(false)
    }).catch((error)=>{
      toast.error("Network Error")
      console.log(error)
    })
  }
  const fetchUser = async() =>{
    try{
        const colRef = doc(db,"users",userData.uid)
        const docRef = await getDoc(colRef)
    
        if(docRef.exists){
        setDisplayName(docRef.data().userName[0])
        setUserImg(docRef.data().Img)
        }
    }catch(error){
      console.log(error)
    }
  }


  useEffect(()=>{
     onAuthStateChanged(auth,(user)=>{
      if(user){
        fetchUser()
      }else{
        console.log("no User")
        localStorage.clear()
      }
     })
     if(userData){
      setLoggedIn(true)
     }else{
      setLoggedIn(false)
     }
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
               {userImg ? (
                  <div className="userImgProfile">
                    <img src={userImg} alt="User Profile"/>
                  </div>
               ) : (
                <div className="userName-box">
                <h3>{displayName}</h3>  
                </div>
               )}
              
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
