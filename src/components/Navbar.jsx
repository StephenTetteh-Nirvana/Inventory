import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { User,Settings,LogOut  } from "lucide-react"
import Logo from "../images/logo.png"
import "../css/Navbar.css"
import { auth, db } from "../firebase"
import { doc,getDoc } from "firebase/firestore"
import { onAuthStateChanged, signOut } from "firebase/auth"


const Navbar = () => {
  const [displayName,setDisplayName] = useState("")
  const [user,setUser] = useState(null)

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
    onAuthStateChanged(auth,async(user)=>{
    if(user){
    setUser(true)
    const colRef = doc(db,"users",user.uid)
    const docRef = await getDoc(colRef)

    if(docRef.exists){
    setDisplayName(docRef.data().userName[0])
    }
    }else{
      console.log("no-user")
      setUser(false)
    }
    })
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
          user ? (
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
