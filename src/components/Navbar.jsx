import { useEffect, useState } from "react"
import { Link,useNavigate } from "react-router-dom"
import { User,Settings,LogOut, Bell  } from "lucide-react"
import { auth, db } from "../firebase"
import { doc,getDoc } from "firebase/firestore"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { toast } from "react-toastify"
import Logo from "../images/logo.png"
import Messages from "./Messages"
import "../css/Navbar.css"


const Navbar = () => {
  const userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : []
  const userRole =  localStorage.getItem("userRole") !== null ? JSON.parse(localStorage.getItem("userRole")) : []

  const [displayName,setDisplayName] = useState("")
  const [LoggedIn,setLoggedIn] = useState(userData)
  const [userImg,setUserImg] = useState(null)
  const [messages,setMessages] = useState([])
  const [showMessages,setShowMessages] = useState(false)

  const navigate = useNavigate()

  const displayMessages = () =>{
    setShowMessages(true)
  }

  const logOut = async() =>{
    await signOut(auth)
    .then(()=>{
      navigate("/login")
      setLoggedIn(false)
      localStorage.clear()
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
        setLoggedIn(true)
    }catch(error){
      console.log(error)
    }
  }

  const fetchMessages = async() =>{
    try{
    const userDocRef = doc(db,"users",userData.uid)
    const userDocData = await getDoc(userDocRef)
    if(userDocData.exists()){
      const messages = userDocData.data().messages;
      setMessages(messages)
    }
    }catch(error){
      console.log(error)
    }
  }


  useEffect(()=>{
     onAuthStateChanged(auth,(user)=>{
      if(user){
        fetchUser()
        fetchMessages()
        setLoggedIn(true)
      }else{
        console.log("no User")
        setLoggedIn(false)
      }
     })
  },[messages])
  
  return (
    <div className="navbar-container">
      <div className="first-section">
        <img src={Logo} alt='Logo'/>
        <h3>INVENTORY</h3>
      </div>
      <div className="second-section">
        { userRole === "Admin" &&
          <div className="messages-icon-box" onClick={displayMessages}>
          <Bell/>
          <span>{ messages && messages.length > 0 ? messages.length : 0}</span>
        </div>
        }
        { LoggedIn ? (
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
      {showMessages && <Messages setShowMessages={setShowMessages} messages={messages}/>}
    </div>
  )
}

export default Navbar
