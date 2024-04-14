import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import "../css/Inventory.css" 
import ContactAdmin from "../components/ContactAdmin"

const Inventory = () => {
    const userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : []
    const [assigned,setAssigned] = useState(null)
    const [showPopUp,setShowPopUp] = useState(false)

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
            }else{
                setAssigned(true)
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
        const role = document.data().role
        if(role === "Admin"){
           list.push(document.data())
           localStorage.setItem("Admins",JSON.stringify(list))
        }
      })
    }

    useEffect(()=>{
        checkUserState()
        fetchAdmins()
    },[])

  return (
    <div>
      <Navbar/>
       {assigned ? (
              <h1>You have a warehouse</h1>
       ):(
        <div className="notAssigned-container">
        <h3>Dear User,you have not been assigned a warehouse yet.Contact an admin to assign you to a warehouse.</h3>
        <button className="notAssigned-btn"onClick={openPopup} >Contact Admin</button>
    </div>
       )}
       {showPopUp && <ContactAdmin setShowPopUp={setShowPopUp}/>}
    </div>
  )
}

export default Inventory
