import {Images} from "lucide-react"
import noUser from "../images/no-user-Img.png"
import "../css/AddNewUser.css"

const AddNewUser = ({setnewUser}) => {
    const closeuserPopup = () =>{
        setnewUser(false)
    }
  return (
    <div className="add-user-container">
        <form onSubmit={(e)=>e.preventDefault()}>
        <h2>Add New User</h2>
        <div className="userImg-section">
            <img src={noUser} alt="noUser" />
            <label htmlFor="file-upload"><Images style={{cursor:"pointer"}} /></label>
            <input id="file-upload" type="file" style={{display:"none"}}/>
        </div>
        <div className="new-user-inputs">
            <div className="new-userName">
             <label>Username</label><br/>
             <input type="text" placeholder="Username"/>
            </div> 
            <div className="new-email">
             <label>Email</label><br/>
             <input type="text" placeholder="Email"/>
            </div> 
            <div className="new-password">
             <label>Password</label><br/>
             <input type="password" placeholder="Password"/>
            </div> 
        </div>
        <div className="new-user-buttons">
            <button className="new-user-saveBtn">Save</button>
            <button onClick={closeuserPopup} className="new-user-cancelBtn">Cancel</button>
        </div>
        </form>
    </div>
  )
}

export default AddNewUser
