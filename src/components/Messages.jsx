import { ChevronLeft, Trash } from "lucide-react"
import noUser from "../images/no-user-Img.png"
import "../css/Messages.css"
import { Link } from "react-router-dom"
import { doc,updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import { toast } from "react-toastify"

const Messages = ({setShowMessages,messages}) =>{
  const userData = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : []

    const hideMessages = () =>{
         setShowMessages(false)
    }

    const deleteMessage = async(Id) =>{
        try{
            const filteredMessages = messages.filter((m)=>m.email !== Id)
            const userDocRef = doc(db,"users",userData.uid)
            await updateDoc(userDocRef,{
               messages:filteredMessages
            })
            setShowMessages(filteredMessages)
        }catch(error){
            console.log(error)
            toast.error("Network Error")
        }
    }

    return(
        <div className="messages-container">
            <div className="messages-form">
                <div className="nav-section"> 
                    <ChevronLeft size={30} style={{cursor:"pointer"}} onClick={hideMessages}/>
                    <h3>Messages</h3>
                </div>
                {messages.length > 0 ? (
                    messages.map((message,index)=>(
                        <div key={index} className="message">
                           <div className="image-box">
                            <img src={message.Img ? message.Img : noUser} alt="user"/>
                            </div>
                            <div className="user-details">
                                <h3>{message.name}</h3>
                                <p>{message.message}</p>
                            </div>
                            <div className="message-buttonBox">
                                <Link to="/warehouse">
                                <button>Assign</button>
                                </Link>
                                <Trash onClick={()=>deleteMessage(message.email)}
                                size={20}
                                style={{color:"red",marginTop:"6px",marginLeft:"20px",cursor:"pointer"}} />
                            </div>
                       </div>
                    ))
                ) : (
                   <h3 style={{marginTop:"20px",textAlign:"center"}}>No messages yet!!!</h3>
                )
            }
            </div>
        </div>
    )
}

export default Messages;
