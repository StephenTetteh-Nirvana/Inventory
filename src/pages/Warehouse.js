import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, getDoc, deleteDoc, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { Eye, Trash, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import "../css/Warehouse.css"
import WarehouseProducts from "../components/WarehouseProducts.jsx";

const Warehouse = () =>{
    const warehouses = localStorage.getItem("warehouses") !== null ? JSON.parse(localStorage.getItem("warehouses")) : []
    const [width,setWidth] = useState(false)
    const [warehouse,setWarehouse] = useState([])
    const [products,setProducts] = useState([])
    const [viewProducts,setViewProducts] = useState(false)


    const fetchWarehouses = async()=>{
      const unsub = onSnapshot(collection(db, "Warehouses"), (snapshot) => {
        try {
            let list = [];
            snapshot.forEach((doc) => {
                list.push(doc.data());
            })
            setWarehouse([...list]);
            localStorage.setItem("warehouses",JSON.stringify(list))
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
        return unsub;
    })
    }

    const fetchRegularUsers = async() => {
      const colRef = collection(db,"users");
      const getAllUsers = await getDocs(colRef)

      let userList = []

      getAllUsers.forEach(async(user)=>{
       const role = user.data().role;
       const userWarehouse = user.data().warehouse;
        if(role === "Regular" && userWarehouse === "Not Assigned"){
          userList.push(user.data())
        }
      })
      localStorage.setItem("regularUsers",JSON.stringify(userList))
   }

   const displayProducts = (name) =>{
    const foundProduct = warehouses.find((w)=>w.name === name)
        if(foundProduct){
            setProducts(foundProduct.products)
            setViewProducts(true)
        }
   }

    const deleteWarehouse = async(name) =>{
      try{
        const colRef = collection(db,"Warehouses")
        const allWarehouses = doc(colRef,name)
        await deleteDoc(allWarehouses)
        await deleteWarehouseFromUser(name)
        await unAssignProductsFromWarehouse(name)
        await fetchRegularUsers()
        toast.success("Warehouse Deleted",{
          autoClose:1500
        })
      }catch(error){
        toast.error("Network Error")
        console.log(error)
      }
    }

    const deleteWarehouseFromUser = async(name) =>{
      const UsercolRef = collection(db,"users")
      const UserdocRef = await getDocs(UsercolRef)

      UserdocRef.forEach(async(userDoc)=>{
       const warehouseField = userDoc.data().warehouse;
       const UserRole = userDoc.data().role;
 
        if(UserRole === "Regular" && warehouseField === name ){
           const userRef = doc(db,"users",userDoc.id)
           await updateDoc(userRef,{
            sent:false,
            warehouse:"Not Assigned"
           })
        }
        })
  }

  const unAssignProductsFromWarehouse = async(name) =>{
    const colRef = collection(db,"Products")
    const docRef = doc(colRef,"Product Arrays")
    const docData = await getDoc(docRef)
    const productsArr = docData.data().products
    
      const updatedProductArray = productsArr.map((product)=>{
        if(product.warehouse === name){
          const updatedProduct = {
            ...product,
            warehouse:"Not Assigned"
          }
          return updatedProduct;
        }else{
          return product;
        }
      })
      await updateDoc(docRef,{
        products:updatedProductArray
    })
  }

    useEffect(()=>{
        fetchWarehouses()
        fetchRegularUsers()
    },[])

  return (
    <div>
        <Navbar/>
        <div className="main-container">
            <Sidebar width={width} setWidth={setWidth}/>
            <div className={`content ${width ? "add-width" : ""}`}>
                <div className="warehouse-buttons">
                  <Link to="/warehouse/add">
                    <button className="add-warehouse-btn">Add Warehouse</button>  
                  </Link>

                </div>
              <div className="warehouse-container">
                <ul>
                    <li>Warehouse Name</li>
                    <li>Location</li>
                    <li>Contact Info</li>
                    <li>Manager</li>
                    <li>Actions</li>
                </ul>
                  { warehouse.length > 0 ? (
                    warehouse.map((warehouse,index)=>(
                    <div key={index} className="warehouse">
                    <div>{warehouse.name}</div>
                    <div>{warehouse.location}</div>
                    <div>{warehouse.contact}</div>
                    <div>{warehouse.manager ? warehouse.manager : "No Manager"}</div>
                    <div>
                      <Eye 
                      onClick={()=>displayProducts(warehouse.name)} 
                      size={20} 
                      style={{color:"green",cursor:"pointer"}}/>
                      <Link to={`/warehouse/edit/${warehouse.name}`}>
                      <Pencil size={20} style={{marginLeft:5,color:"#2666CF",cursor:"pointer"}} />
                      </Link>
                      <Trash 
                      size={20} 
                      onClick={()=>deleteWarehouse(warehouse.name)} 
                      style={{marginLeft:5,color:"red",cursor:"pointer"}}/>
                    </div>
                    </div>
                    ))
                  ) : (
                    <div className="no-warehouses-box">
                      <h3>No warehouses yet!!!</h3>
                    </div>
                  ) }
              </div>
              {viewProducts && <WarehouseProducts products={products} setViewProducts={setViewProducts}/>}
            </div>
        </div>
    </div>
  )
}

export default Warehouse
