import { useState } from "react"
import { Eye,Pencil,Trash } from "lucide-react"
import "../css/Users.css"
import User from "../images/brothers.png"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import UserImg from "../components/UserImg"
import AddNewUser from "../components/AddNewUser"



const Users = () => {
    const [width,setWidth] = useState(false)
    const [fullImg,setFullImg] = useState(false)
    const [newUser,setnewUser] = useState(false)

    const toggleFullImage = () =>{
        setFullImg(true)
    }

    const AddNewUserPopup = () => {
        setnewUser(true)
    }

    return(
    <div>
        <Navbar/>
        <div className="main-container">
            <Sidebar width={width} setWidth={setWidth}/>
            <div className={`content ${width ? "add-width" : ""}`}>
                <div className="users-header-section">
                <h1>Users</h1>
                <button onClick={AddNewUserPopup}>Add New</button>
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
        {newUser && <AddNewUser setnewUser={setnewUser}/>}
        {fullImg && <UserImg setFullImg={setFullImg}/>}
    </div>
     )
}

export default Users
