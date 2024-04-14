import { useState,useEffect } from "react"
import { SendHorizontal,ChevronLeft } from "lucide-react"
import "../css/ContactAdmin.css"

const ContactAdmin = ({setShowPopUp}) => {
    const admins = localStorage.getItem("Admins") !== null ? JSON.parse(localStorage.getItem("Admins")) : []
    const [disabled] = useState(true)
    const [message] = useState("Hi Admin,please assign me to a warehouse !!!")
    const [admin,setAdmin] = useState("")

    const closePopup = () =>{
        setShowPopUp(false)
    }

    const fetchLocalAdmins = () =>{
        try{
          if(admins.length > 0 && admin === ""){
            setAdmin(admins[0].userName);
          }
        }catch(error){
          console.log(error)
        }
      }

      useEffect(()=>{
        fetchLocalAdmins
      },[])

  return (
    <div className="adminContact-container">
        <div className="adminContact-popUp">
        <div className="form-title">
           <span><ChevronLeft onClick={closePopup} style={{cursor:"pointer"}} size={30}/></span>
           <h2>Contact Admin</h2>
        </div>
            <div className="allAdmins-inputBox">
                <div className="admin-select-section">
                    <label>Select Admin</label>
                    <select onChange={(e)=>setAdmin(e.target.value)}>
                    {admins.length > 0 ? admins.map((admin)=>(
                      <option key={admin.email}>{admin.userName}</option>
                    )) : (<option>No Admins Available!!!</option>)}
                    </select>
                </div>
                
                <div className="message-section">
                    <label>Message</label>
                    <input type="text" disabled={disabled} value={message}/>
                </div>
            </div>
            <button>Send Message <SendHorizontal size={18} style={{marginLeft:"7px",transform:"translateY(5px)"}} /></button>
        </div>
      
    </div>
  )
}

export default ContactAdmin
