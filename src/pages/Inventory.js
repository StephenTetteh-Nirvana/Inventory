import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs,onSnapshot,updateDoc } from "firebase/firestore"
import { Link } from "react-router-dom"
import { CheckCheck,Pencil, Trash,Loader,CircleAlert } from "lucide-react"
import { Tooltip } from "@mui/material"
import { toast } from "react-toastify"
import { db } from "../firebase"
import Navbar from "../components/Navbar"
import ContactAdmin from "../components/ContactAdmin"
import noImg from "../images/camera-off.png"
import "../css/Inventory.css" 

const Inventory = () => {
    const userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : []
    const products = localStorage.getItem("products") !== null ? JSON.parse(localStorage.getItem("products")) : []
    const sent = localStorage.getItem("Sent") !== null ? JSON.parse(localStorage.getItem("Sent")) : []
    const userAssigned = localStorage.getItem("Assigned") !== null ? JSON.parse(localStorage.getItem("Assigned")) : []

    const [assigned,setAssigned] = useState(userAssigned)
    const [showPopUp,setShowPopUp] = useState(false)
    const [deleting,setDeleting] = useState(false)
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

    const checkMessageSent = async() =>{
      try{
        const colRef = collection(db,"users")
        const docRef = doc(colRef,userData.uid)
        const docData = await getDoc(docRef)
        const sent = docData.data().sent
        localStorage.setItem("Sent",JSON.stringify(sent))
      }catch(error){
        console.log(error)
      }
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
              localStorage.setItem("userWarehouse",JSON.stringify(""))
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

    const fetchUnits = () =>{
      const unsub = onSnapshot(collection(db,"Units"),(snapshot)=>{
        let list = []
        snapshot.forEach((doc)=>{
          list.unshift({id:doc.id,...doc.data()})
        })
        localStorage.setItem("units",JSON.stringify(list))
      })
      return unsub;
      }

    const fetchCategories = () => {
      const unsub = onSnapshot(collection(db,"Categories"),(snapshot)=>{
        let list = []
        snapshot.forEach((doc)=>{
          list.unshift({id:doc.id,...doc.data()})
        })
        localStorage.setItem("categories",JSON.stringify(list))
      })
      return unsub;
      }

    const fetchBrands = () => {
    const unsub = onSnapshot(collection(db,"Brands"),(snapshot)=>{
      let list = []
      snapshot.forEach((doc)=>{
        list.unshift({id:doc.id,...doc.data()})
      })
      localStorage.setItem("brands",JSON.stringify(list))
    })
    return unsub;
    }

    const deleteProduct = async(Id,warehouse) =>{
      try{
        setDeleting(true)
        const productArrayReference = doc(db,"Products","Product Arrays")
        const filteredProductsArr = products.filter((p)=>p.id !== Id)
        localStorage.setItem("products",JSON.stringify(filteredProductsArr))
        await updateDoc(productArrayReference,{
          products:filteredProductsArr
        })
        await deleteProductFromWarehouse(Id,warehouse)
        toast.success("Product Deleted",{
          autoClose:1000
        })
        setDeleting(false)
      }catch(error){
        setDeleting(false)
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
      }catch(error){
        console.log(error)
      }  
    }
 
    // eslint-disable-next-line
    useEffect(()=>{
      fetchProducts()
      fetchUnits()
      fetchCategories()
      fetchBrands()
      checkMessageSent()
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
          <div>
            <Link to="/dashboard/add">
            <button className="addProductBtn">Add New Product</button>
            </Link>
            <Link to="/restock">
            <button className="restockBtn">Restock Products</button>
            </Link>
          </div>
          </div>
          <ul>
          <li>Image</li>
          <li>Product</li>
          <li>Measurement</li>
          <li>Unit Price</li>
          <li>Stock Level</li>
          <li>Category</li>
          <li>Brand</li>
          <li>Actions</li>
          <li>Date Created</li>
          </ul>
            {warehouseProducts && warehouseProducts.length > 0 ? (warehouseProducts.map((item,index)=>(
                <div key={index} className="item">
                   <div className="item-imageBox">
                    <img src={item.Img ? item.Img : noImg } alt="Product"/>
                    </div>

                    <div>
                    <p>{item.product}</p>
                    </div>

                    <div>
                    <p>{item.Measurement}</p>
                    </div>

                    <div>
                    <p>${item.price}.00</p>
                    </div>

                    <div>
                    <p>{item.stockLevel}
                    {item.stockLevel === "0" && <span className="out-of-stock-span">Out Of Stock</span>}
                    {item.stockLevel === item.lowStock && <span className="low-stock-span">Low Stock</span>}
                    </p>
                    </div>

                    <div>
                    <p>{item.category}</p>
                    </div>

                    <div>
                    <p>{item.brand}</p>
                    </div>
                   <div>
                    { deleting ? (
                      <button className="delete-loader"><Loader size={17} style={{color:"white"}} /></button>
                    ):(
                      <>
                      {item.stockLevel === item.lowStock && item.stockLevel > 0 && (
                      <Tooltip title='THIS PRODUCT IS LOW ON STOCK' placement="left" leaveDelay={100}>
                        <CircleAlert size={20} style={{marginLeft:15,color:"black",cursor:"pointer"}} />
                      </Tooltip>
                      )}
                      <Link to={`/dashboard/editProduct/${item.id}`}>
                      <Pencil size={20} style={{marginLeft:5,color:"#2666CF",cursor:"pointer"}} />
                      </Link>
                      <Trash onClick={()=>deleteProduct(item.id,item.warehouse)} size={20} style={{marginLeft:5,color:"red",cursor:"pointer"}}/>
                      </>
                    )
                    }
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
        { sent ? (
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
