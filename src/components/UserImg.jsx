import { X } from "lucide-react"
import "../css/UserImg.css"
import User from "../images/brothers.png"

const UserImg = ({setFullImg}) => {

    const closeImgPopUp = () =>{
        setFullImg(false)
    }
    
  return (
    <div className="userImg-container"> 
       <div className="userImg-box">
        <div onClick={closeImgPopUp} className="closeImg-popUp">
          <X style={{cursor:"pointer"}}  size={30}/>
        </div>
          <img src={User} alt="User"/>
      </div>
    </div>
    
  )
}

export default UserImg
