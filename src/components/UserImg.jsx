import { X } from "lucide-react"
import "../css/UserImg.css"
import User from "../images/no-user-Img.png"

const UserImg = ({setFullImg,FoundUser}) => {

    const closeImgPopUp = () =>{
        setFullImg(false)
    }
    
  return (
    <div className="userImg-container">
      {console.log(FoundUser.Img)}
       <div className="userImg-box">
        <div onClick={closeImgPopUp} className="closeImg-popUp">
          <X style={{cursor:"pointer"}}  size={30}/>
        </div>
          <img src={FoundUser.Img ? FoundUser.Img : User} alt="User"/>
      </div>
    </div>
    
  )
}

export default UserImg
