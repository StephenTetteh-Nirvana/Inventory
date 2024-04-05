import { useState } from "react"
import "../css/Users.css"
import User from "../images/brothers.png"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"


const Users = () => {
    const [width,setWidth] = useState(false)

    return(
    <div>
        <Navbar/>
        <div className="main-container">
            <Sidebar width={width} setWidth={setWidth}/>
            <div className={`content ${width ? "add-width" : ""}`}>
                <div className="users-header-section">
                <h1>Users</h1>
                <button>Add New</button>
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
                            <p>View/Delete</p>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
     )
}

export default Users
