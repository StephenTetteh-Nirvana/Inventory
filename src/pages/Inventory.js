import { useEffect, useState } from "react"
import {Link} from "react-router-dom"
import Navbar from "../components/Navbar"
import { collection, doc, getDoc, getDocs,onSnapshot,updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import { CheckCheck,Pencil, Trash } from "lucide-react"
import { toast } from "react-toastify"
import "../css/Inventory.css" 
import ContactAdmin from "../components/ContactAdmin"
import noImg from "../images/camera-off.png"

const Inventory = () => {
    const userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : []
    const products = localStorage.getItem("products") !== null ? JSON.parse(localStorage.getItem("products")) : []
    const sent = localStorage.getItem("Sent") !== null ? JSON.parse(localStorage.getItem("Sent")) : []
    const userAssigned = localStorage.getItem("Assigned") !== null ? JSON.parse(localStorage.getItem("Assigned")) : []

    const [assigned,setAssigned] = useState(userAssigned)
    const [showPopUp,setShowPopUp] = useState(false)
    const [msgSent,setMsgSent] = useState(sent)
    const [warehouseProducts,setWarehouseProducts] = useState([])

    const openPopup = () =>{
        setShowPopUp(true)
    }

    const fetchProducts = async() =>{
      const colRef = collection(db,"Products")
      const unsub = onSnapshot(doc(colRef,"Product Arrays"), (snapshot) => {
        try {
          let list = [];
          list = snapshot.data().products;
          localStorage.setItem("products",JSON.stringify(list))
      } catch (error) {
          console.error("Error fetching data: ", error);
      }
    });
    return unsub;
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
              const unsub = onSnapshot(foundWarehouse, (snapshot) => {
                  let list = [];
                  list = snapshot.data().products;
                  setWarehouseProducts(list)
                  localStorage.setItem("warehouseProducts",JSON.stringify(list))
                  localStorage.setItem("userWarehouse",JSON.stringify(snapshot.data().name))
              })
              return unsub;
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

    const deleteProduct = async(Id,warehouse) =>{
      try{
        const colRef = collection(db,"Products")
        const productArrayReference = doc(colRef,"Product Arrays")
  
        const foundProduct = products.filter((p)=>p.id !== Id)
        localStorage.setItem("products",JSON.stringify(foundProduct))
        await updateDoc(productArrayReference,{
          products:foundProduct
        })
        await deleteProductFromWarehouse(Id,warehouse)
      }catch(error){
         console.log(error)
         toast.error("Network Error")
      }
      
    }

    const deleteProductFromWarehouse = async(Id,warehouse) => {
      try{
        const colRef = collection(db,"Warehouses")
        const docRef = doc(colRef,warehouse)
        const docData = await getDoc(docRef)
        const productsArr = docData.data().products
        const productToDelete = productsArr.filter((p)=>p.id !== Id)
        await updateDoc(docRef,{
          products:productToDelete
        })
        toast.error("Product Deleted",{
          autoClose:1000
        })
      }catch(error){
        console.log(error)
      }  
    }

    useEffect(()=>{
      fetchProducts()
      checkUserState()
      fetchAdmins()
    },[])

  return (
    <div>
      <Navbar/>
       {assigned ? (
        <div className="userWarehouse-products-container">
          <div className="header-section">
          <h1>Products List</h1>
          <Link to="/inventory/add">
          <button>Add New Product</button>
          </Link>
          </div>
          <ul>
          <li>Product</li>
          <li>Name</li>
          <li>Price</li>
          <li>Quantity</li>
          <li>Actions</li>
          <li>Date Created</li>
          </ul>
            {warehouseProducts && warehouseProducts.length > 0 ? (warehouseProducts.map((item,index)=>(
                <div key={index} className="item">
                   <div className="item-imageBox">
                    <img src={item.Img ? item.Img : noImg } alt="Product"/>
                    </div>
                   <div>{item.product}</div>
                   <div>{item.price}</div>
                   <div>{item.quantity}</div>
                   <div>
                    <Link to={`/dashboard/editProduct/${item.id}`}>
                    <Pencil size={20} style={{marginLeft:5,color:"#2666CF",cursor:"pointer"}} />
                    </Link>
                    <Trash onClick={()=>deleteProduct(item.id,item.warehouse)} size={20} style={{marginLeft:5,color:"red",cursor:"pointer"}}/>
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
