import { useState,useEffect } from "react"
import { Eye,Pencil,Trash } from "lucide-react"
import { onSnapshot,collection, getDocs } from "firebase/firestore";
import { auth,db } from "../firebase";
import { deleteUser } from "firebase/auth";
import { Link } from "react-router-dom";
import User from "../images\/no-user-Img.png"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import UserImg from "../components/UserImg"
import "../css/Users.css"




const Users = () => {
    const [data,setData] = useState([])
    const [width,setWidth] = useState(false)
    const [fullImg,setFullImg] = useState(false)
    const [userEdit,setUserEdit] = useState(null)
    const [FoundUser,setFoundUser] = useState(null)

    const toggleFullImage = (id) =>{
        setFullImg(true)
        const foundUser = data.find((p)=>p.id === id)
        setFoundUser(foundUser)
    }

    const toggleUserEdit = (id)=>{
        const foundUser = data.find((p)=>p.id === id)
        setUserEdit(foundUser)
    }

    const fetchUsers = async () =>{
        const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
            try {
                let list = [];
                snapshot.forEach((doc) => {
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

    const deleteUserDoc = async(userId) => {
         const colRef = collection(db,"users")
         const docRef = await getDocs(colRef)

         docRef.forEach((doc)=>{
            if(doc.id === userId){
                console.log(userId)
            } 
         })
    }

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
                        <li>Assigned To</li>
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

                          <Link to={`/users/edit/${user.id}`}>
                          <Pencil 
                            onClick={()=>toggleUserEdit(user.id)} 
                            size={20} 
                            style={{marginLeft:5,color:"#2666CF",cursor:"pointer"}} />
                          </Link>
                          
                          <Trash onClick={()=>deleteUserDoc(user.id)} size={20} style={{marginLeft:5,color:"red",cursor:"pointer"}} />
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
