import { useEffect, useState } from "react"
import {Link} from "react-router-dom"
import Navbar from "../components/Navbar"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import { CheckCheck,Pencil,Trash } from "lucide-react"
import "../css/Inventory.css" 
import ContactAdmin from "../components/ContactAdmin"
import noImg from "../images/camera-off.png"

const Inventory = () => {
    const userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : []
    const sent = localStorage.getItem("Sent") !== null ? JSON.parse(localStorage.getItem("Sent")) : []
    const userAssigned = localStorage.getItem("Assigned") !== null ? JSON.parse(localStorage.getItem("Assigned")) : []

    const [assigned,setAssigned] = useState(userAssigned)
    const [showPopUp,setShowPopUp] = useState(false)
    const [msgSent,setMsgSent] = useState(sent)
    const [warehouseProducts,setWarehouseProducts] = useState([])

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
              const foundWarehouse = doc(db,"Warehouses",assignedWarehouse)
              const docRef =  await getDoc(foundWarehouse)
              setWarehouseProducts(docRef.data().products)
          }
      }catch(error){
          console.log(error)
      }
  }

    const fetchAdmins = async() =>{
      const colRef = collection(db,"users")
      const allDocs = await getDocs(colRef)
      let list = []

      allDocs.forEach(async(document)=>{
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
    },[])

  return (
    <div>
      <Navbar/>
       {assigned ? (
        <div className="userWarehouse-products-container">
          <h1>Products List</h1>
          <ul>
          <li>Product</li>
          <li>Name</li>
          <li>Price</li>
          <li>Quantity</li>
          <li>Actions</li>
          <li>Date Created</li>
          </ul>
            {warehouseProducts.length > 0 ? (warehouseProducts.map((item,index)=>(
                <div key={index} className="item">
                   <div className="item-imageBox">
                    <img src={item.Img ? item.Img : noImg } alt="Product"/>
                    </div>
                   <div>{item.product}</div>
                   <div>{item.price}</div>
                   <div>{item.quantity}</div>
                   <div>
                    <Link to="">
                    <Pencil size={20} style={{marginLeft:5,color:"#2666CF",cursor:"pointer"}} />
                    </Link>
                    <Trash size={20} style={{marginLeft:5,color:"red",cursor:"pointer"}} />
                    </div>
                   <div>{item.createdAt}</div>
                </div>
            ))
            ):(
              <h3>No products yet!!!</h3>
            )
            }
        </div>  
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
       {showPopUp && <ContactAdmin setShowPopUp={setShowPopUp} setMsgSent={setMsgSent}/>}
    </div>
  )
}

export default Inventory
