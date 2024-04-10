import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase.js";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import "../css/Warehouse.css"
import { Eye, Trash } from "lucide-react";
import { toast } from "react-toastify";

const Warehouse = () => {
    const [width,setWidth] = useState(false)
    const [warehouse,setWarehouse] = useState([])

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

      getAllUsers.forEach((user)=>{
       const role = user.data().role;
        if(role === "Regular"){
          userList.push(user.data())
        }
      })
      localStorage.setItem("regularUsers",JSON.stringify(userList))
   }

    const deleteWarehouse = async(name) =>{
      try{
        const colRef = collection(db,"Warehouses")
        const allWarehouses = doc(colRef,name)
        await deleteDoc(allWarehouses)
      }catch(error){
        toast.error("Bad Internet Connection")
        console.log(error)
      }
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
                <input type="text" placeholder="Search by name..."/> 
                </div>
              <div className="warehouse-container">
                <ul>
                    <li>Warehouse Name</li>
                    <li>Location</li>
                    <li>Contact Info</li>
                    <li>Capacity</li>
                    <li>Actions</li>
                </ul>
                  { warehouse.length > 0 ? (
                    warehouse.map((warehouse,index)=>(
                    <div key={index} className="warehouse">
                    <div>{warehouse.name}</div>
                    <div>{warehouse.location}</div>
                    <div>{warehouse.contact}</div>
                    <div>{warehouse.capacity}</div>
                    <div>
                      <Eye size={20} style={{color:"green",cursor:"pointer"}}/>
                      <Trash size={20} onClick={()=>deleteWarehouse(warehouse.name)} style={{marginLeft:5,color:"red",cursor:"pointer"}}/>
                    </div>
                    </div>
                    ))
                  ) : (
                    <div className="no-warehouses-box">
                      <h3>No warehouses yet!!!</h3>
                    </div>
                  ) }
              </div>
            </div>
        </div>
    </div>
  )
}

export default Warehouse
