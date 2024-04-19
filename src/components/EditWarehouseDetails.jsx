import { ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams,useNavigate } from 'react-router-dom'
import Loader from "./Loader.jsx"
import "../css/EditWarehouseDetails.css"
import { collection,deleteDoc,doc, getDoc, getDocs, updateDoc, setDoc } from "firebase/firestore"
import { db } from "../firebase.js"
import { toast } from "react-toastify"

const EditWarehouseDetails = () => {
    const { id } = useParams()
    const warehouses = localStorage.getItem("warehouses") !== null ? JSON.parse(localStorage.getItem("warehouses")) : []
    const regularUsers = localStorage.getItem("regularUsers") !== null ? JSON.parse(localStorage.getItem("regularUsers")) : []
    const foundWarehouse = warehouses.find((w)=>w.name === id)
 
    const [manager,setManager] = useState("")
    const [NewManager,setNewManager] = useState("")
    const [name,setName] = useState("")
    const [location,setLocation] = useState("")
    const [contact,setContact] = useState("")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const closeuserPopup = () =>{
        navigate(-1)
    }

    const editWarehouse = async(warehouseName) =>{
        try{
            if(name !== "" && location !== "" && contact !== ""){
                setLoading(true)
                const docRef = doc(db,"Warehouses",warehouseName)
                const docData = await getDoc(docRef)
                const productArr = docData.data().products
                const newDocRef = doc(db,"Warehouses",name)
                await setDoc(newDocRef,{
                   name:name,
                   location:location,
                   contact:contact,
                   manager:`${NewManager === "" ? manager : NewManager }`,
                   products:productArr
                })
                const newDocData = await getDoc(newDocRef)
                const products = newDocData.data().products
                const updatedProductArray = products.map((product)=>{
                      const updatedProduct = {
                        ...product,
                        warehouse:name
                }
                return updatedProduct;
                })
                await updateDoc(newDocRef,{
                    products:updatedProductArray
                })
                await ReAssignProductWarehouse(warehouseName)
                await deleteDoc(docRef)
                if(NewManager !== ""){
                    await unAssignManager()
                    await assignWarehouseToUser() 
                }else{
                    await assignWarehouseToUser() 
                }
                toast.success("Warehouse Updated",{
                    autoClose:1000
                })
                navigate(-1)
            }else{
                toast.error("Fill The Form",{
                    autoClose:1500,
                    position:"top-center"
                })
            }
        }catch(error){
            console.log(error)
            setLoading(false)
            toast.error("Network Error")
        }
    }

    const ReAssignProductWarehouse = async(warehouseName) =>{
       const colRef = collection(db,"Products")
       const docRef = doc(colRef,"Product Arrays")
       const docData = await getDoc(docRef)

       const allProducts = docData.data().products;
       const updatedProducts = allProducts.map((product) => {
        if (product.warehouse === warehouseName) {
            return { ...product, warehouse: name };
        } else {
            return product;
        }
        });
        await updateDoc(docRef,{
            products:updatedProducts
        })
    }

    
    const unAssignManager = async() =>{
        try{
            const userColRef = collection(db,"users")
            const userDocRef = await getDocs(userColRef)
            userDocRef.forEach(async(document)=>{
                if(document.data().userName === manager){
                    const foundUser = doc(db,"users",document.id)
                     await updateDoc(foundUser,{
                        warehouse:"Not Assigned"
                     })
                }
            })
        }catch(error){
            console.log(error)
        }
       
    }

    const assignWarehouseToUser = async() =>{
        try{
            const userColRef = collection(db,"users")
            const userDocRef = await getDocs(userColRef)
            userDocRef.forEach(async(document)=>{
                if(NewManager !== "" && document.data().userName === NewManager){
                  const foundUser = doc(db,"users",document.id)
                  await updateDoc(foundUser,{
                      warehouse:name
                  })
                }
             })
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        setManager(foundWarehouse.manager)
        setName(foundWarehouse.name)
        setLocation(foundWarehouse.location)
        setContact(foundWarehouse.contact)
    },[NewManager])

  return (
    <div className="edit-warehouse-container">
    <form onSubmit={(e)=>e.preventDefault()}>
    <div className="form-title">
       <span><ChevronLeft onClick={closeuserPopup} style={{cursor:"pointer"}} size={30}/></span>
       <h2>Edit Warehouse</h2>
    </div>
    
    <div className="edit-warehouse-inputs">
    <div className="current-manager">
          <label>Current Manager</label><br/>
          <input type="text" value={manager} readOnly/>
        </div>

       <div className="edit-manager">
        <label>Select New Manager</label><br/>
           <select onChange={(e)=>setNewManager(e.target.value)}>
           <option value={NewManager}>Select Manager</option>
            {regularUsers.length > 0 ? regularUsers.map((user,index)=>(
                    <option key={index}>{user.userName}</option>
                  )) : (<option>No managers found!!!</option>)  
            }
          </select>
        </div>

        <div className="edit-warehouse-name">
          <label>Name</label><br/>
          <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
        </div>

        <div className="edit-warehouse-price">
          <label>Location</label><br/>
          <input type="text" value={location} onChange={(e)=>setLocation(e.target.value)}/>
        </div>
        <div className="edit-warehouse-quantity">
          <label>Contact Info</label><br/>
          <input type="text" value={contact} onChange={(e)=>setContact(e.target.value)}/>
        </div>
    </div>
    <div className="edit-warehouse-buttons">
        { loading ? (
            <Loader/>
        ) : (
            <button className="edit-warehouse-saveBtn" onClick={()=>editWarehouse(foundWarehouse.name)}>Save Changes</button>
        )}
    </div>
    </form>
</div>
  )
}

export default EditWarehouseDetails
