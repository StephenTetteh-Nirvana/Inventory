import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import { CheckCheck } from "lucide-react"
import "../css/Inventory.css" 
import ContactAdmin from "../components/ContactAdmin"

const Inventory = () => {
    const userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : []
    const sent = localStorage.getItem("Sent") !== null ? JSON.parse(localStorage.getItem("Sent")) : []
    const userAssigned = localStorage.getItem("Assigned") !== null ? JSON.parse(localStorage.getItem("Assigned")) : []

    const [assigned,setAssigned] = useState("")
    const [showPopUp,setShowPopUp] = useState(false)
    const [msgSent,setMsgSent] = useState("")

    const openPopup = () =>{
        setShowPopUp(true)
    }

    const checkUserState = async() =>{
        try{
            const colRef = collection(db,"users")
            const docRef = doc(colRef,userData.uid)
            const docData = await getDoc(docRef)
            const assignedWarehouse = docData.data().warehouse;
            if(assignedWarehouse === "Not Assigned"){
                setAssigned(false)
                localStorage.setItem("Assigned",JSON.stringify(false))
            }else{
                setAssigned(true)
                localStorage.setItem("Assigned",JSON.stringify(true))
            }
        }catch(error){
            console.log(error)
        }
    }

    const fetchAdmins = async() =>{
      const colRef = collection(db,"users")
      const allDocs = await getDocs(colRef)
      let list = []

      allDocs.forEach((document)=>{
        const role = document.data().role;
        if(role === "Admin"){
           list.push(document.data())
           localStorage.setItem("Admins",JSON.stringify(list))
        }
      })
    }

    useEffect(()=>{
        checkUserState()
        fetchAdmins()
        setMsgSent(sent)
    },[assigned,msgSent])

  return (
    <div>
      <Navbar/>
       {userAssigned ? (
              <h1>You have a warehouse</h1>
       ):(
        <div className="notAssigned-container">
        <h3>Dear User,you have not been assigned a warehouse yet.Contact an admin to assign you to a warehouse.</h3>
        { msgSent ? (
          <button className="messageSent-btn">Your message was sent.
          <span><CheckCheck size={20}  style={{marginLeft:"7px",transform:"translateY(5px)"}} /></span>
          </button>
        ) : (
          <button className="notAssigned-btn"onClick={openPopup} >Contact Admin</button>
        )}
    </div>
       )}
       {showPopUp && <ContactAdmin setShowPopUp={setShowPopUp}/>}
    </div>
  )
}

export default Inventory
