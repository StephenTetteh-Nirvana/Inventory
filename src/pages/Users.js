import { useState,useEffect } from "react"
import { Eye,Pencil,Trash } from "lucide-react"
import { onSnapshot,collection } from "firebase/firestore";
import { db,auth } from "../firebase";
import "../css/Users.css"
import User from "../images/brothers.png"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import UserImg from "../components/UserImg"
import { Link } from "react-router-dom";



const Users = () => {
    const [data,setData] = useState([])
    const [width,setWidth] = useState(false)
    const [fullImg,setFullImg] = useState(false)

    const toggleFullImage = () =>{
        setFullImg(true)
    }

    const fetchUsers = async () =>{
        const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
            try {
                let list = [];
                snapshot.forEach((doc) => {
                    list.push({id:doc.id, ...doc.data()});
                })
                setData([...list]);
                console.log(list)
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
            return unsub;
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
                    <div className="user">
                        <div className="user-image-box">
                        <img src={User} alt="User"/>
                        </div>
                        <div>
                            <p>Stephen</p>
                        </div>
                        <div>
                            <p>admin@gmail.com</p>
                        </div>
                        <div>
                            <p>Admin</p>
                        </div>
                        <div>
                            <p>Fruits Warehouse</p>
                        </div>
                        <div>
                        <Eye size={20} onClick={toggleFullImage} style={{color:"green",cursor:"pointer"}} />
                        <Pencil size={20} style={{marginLeft:5,color:"#2666CF",cursor:"pointer"}} />
                        <Trash size={20} style={{marginLeft:5,color:"red",cursor:"pointer"}} />
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        {fullImg && <UserImg setFullImg={setFullImg}/>}
    </div>
     )
}

export default Users
