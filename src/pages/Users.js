import { useState,useEffect } from "react"
import { Eye } from "lucide-react"
import { onSnapshot,collection, doc, getDocs,updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import User from "../images/no-user-Img.png"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import UserImg from "../components/UserImg"
import "../css/Users.css"

const Users = () => {
    const [data,setData] = useState([])
    const [width,setWidth] = useState(false)
    const [fullImg,setFullImg] = useState(false)
    const [FoundUser,setFoundUser] = useState(null)

    const toggleFullImage = (id) =>{
        setFullImg(true)
        const foundUser = data.find((p)=>p.id === id)
        setFoundUser(foundUser)
    }

    const fetchUsers = async () =>{
        const unsub =  onSnapshot(collection(db, "users"),(snapshot) => {
            try {
                let list = [];
                snapshot.forEach((doc) => {
                    checkAdminState()
                    list.push({id:doc.id, ...doc.data()});
                })
                setData([...list]);
                localStorage.setItem("userList",JSON.stringify(list))
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
            return unsub;
        })
    }

    const checkAdminState = async() =>{
        const colRef = collection(db,"users")
        const docRef = await getDocs(colRef)

        docRef.forEach(async(document)=>{
            if(document.data().role === "Admin"){
                const warehouseRef = doc(db,"users",document.id)
                await updateDoc(warehouseRef,{
                    warehouse:"Can't Assign Admin"
                })
            }
        }) 
    }

    // eslint-disable-next-line
    useEffect(()=>{
        fetchUsers()
    },[])

    return(
    <div>
        <Navbar/>
        <div className="main-container">
            <Sidebar width={width} setWidth={setWidth}/>
            <div className={`content ${width ? "add-width" : ""}`}>
                <div className="users-header-section">
                <h1>Users</h1>
                <Link to="/users/new">
                <button>Add New</button>
                </Link> 
                </div>
                <div className="users-table-header">
                    <ul>
                        <li>User</li>
                        <li>Name</li>
                        <li>Email</li>
                        <li>Role</li>
                        <li>Warehouse</li>
                        <li>Actions</li>
                    </ul>
                    { 
                    data.length > 0 ? ( 
                    data.map((user,index)=>(
                          <div key={index} className="user">
                          <div className="user-image-box">
                           <img src={user.Img ? user.Img : User} alt="User"/>
                          </div>
                          <div>
                              <p>{user.userName}</p>
                          </div>
                          <div>
                              <p>{user.email}</p>
                          </div>
                          <div>
                              <p>{user.role}</p>
                          </div>
                          <div>
                              <p>{user.warehouse}</p>
                          </div>
                          <div>
                          <Eye 
                          size={20} 
                          onClick={()=>toggleFullImage(user.id)} 
                          style={{color:"green",cursor:"pointer"}}/>
                          </div>
                      </div>
                    ))
                    ) : (
                        <div className="loading-users">
                        <h1>No Users</h1>
                        </div>
                    )
                }
                </div>
            {fullImg && <UserImg setFullImg={setFullImg} FoundUser={FoundUser}/>}
            </div>
        </div>
    </div>
     )
}

export default Users
