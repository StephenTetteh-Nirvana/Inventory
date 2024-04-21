import { useState,useEffect } from "react"
import { SendHorizontal,ChevronLeft } from "lucide-react"
import { auth, db } from "../firebase"
import { collection, getDocs, getDoc, updateDoc,doc } from "firebase/firestore"
import Loader from "../components/Loader.jsx"
import "../css/ContactAdmin.css"


const ContactAdmin = ({setShowPopUp}) => {
    const admins = localStorage.getItem("Admins") !== null ? JSON.parse(localStorage.getItem("Admins")) : []
    const [disabled] = useState(true)
    const [admin,setAdmin] = useState("")
    const [errMsg,setErrMsg] = useState("")
    const [loading,setLoading] = useState(false)

    const message = "Hi Admin,please assign me to a warehouse."

    const closePopup = () =>{
        setShowPopUp(false)
    }

    const SendMsg = async() =>{
        try{
            setLoading(true)
            const colRef = collection(db,"users")
            const docRef = await getDocs(colRef)

            docRef.forEach(async(document)=>{
             const role = document.data().role;
             const username = document.data().userName;
             if(role === "Admin" && username === admin){
                const adminDocRef = doc(db,"users",document.id)
                await updateDoc(adminDocRef,{
                    messages:[]
                })
                await addMsg(document,adminDocRef)
                setShowPopUp(false) 
                localStorage.setItem("Sent",JSON.stringify(true))
             }
            })
        }catch(error){
            setErrMsg("Bad Connection! Check Your Network")
            setLoading(false)
            console.log(error)
        } 
    }

    const addMsg = async(document,adminDocRef) =>{
        const user = auth.currentUser;
        const userDocRef = doc(db,"users",user.uid)
        const userDocData = await getDoc(userDocRef)
        const messageObj = {
            Img:userDocData.data().Img,
            name:userDocData.data().userName,
            email:userDocData.data().email,
            message:message
        }
        await updateDoc(userDocRef,{
            sent:true
        })
        const existingMessages = document.data().messages || [];
        const updatedMessages = [...existingMessages, messageObj];
        await updateDoc(adminDocRef,{
            messages:updatedMessages
        })
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
        fetchLocalAdmins()
      },[admin])

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
            {<p className="error-msg">{errMsg}</p>}
            { loading ? (
               <Loader/>
            ) : (
                <button 
                onClick={SendMsg}>Send Message<SendHorizontal size={18} 
                style={{marginLeft:"7px",transform:"translateY(5px)"}} />
                </button>
            )
            }
           
        </div>
      
    </div>
  )
}

export default ContactAdmin
