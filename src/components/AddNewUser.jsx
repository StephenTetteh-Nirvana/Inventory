import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "../firebase"
import {Images} from "lucide-react"
import noUser from "../images/no-user-Img.png"
import "../css/AddNewUser.css"
import { useEffect, useState } from "react"

const AddNewUser = ({setnewUser}) => {
    const [file,setFile] = useState("")
    const [imageUrl,setImageUrl] = useState(null)
    const [Trackprogress,setTrackProgress] = useState(null)

    const closeuserPopup = () =>{
        setnewUser(false)
    }

    const handleImgChange = (e) =>{
        const selectedFile = e.target.files[0]
        setFile(selectedFile)
        uploadUserImg(selectedFile)
    }

    const uploadUserImg = (file) =>{
        const storageRef = ref(storage, 'images/' + file.name);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setTrackProgress(progress)
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
            }
        }, 
        (error) => {
            console.log(error)
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setImageUrl(downloadURL)
            });
        })
    }
    

  return (
    <div className="add-user-container">
        <form onSubmit={(e)=>e.preventDefault()}>
        <h2>Add New User</h2>
        <div className="userImg-section">
            <img src={imageUrl ? imageUrl : noUser} alt="noUser" />
            <label htmlFor="file-upload"><Images style={{cursor:"pointer"}} /></label>
            <input id="file-upload" type="file" onChange={handleImgChange} style={{display:"none"}}/>
        </div>
        {Trackprogress !== null && <p className="progress">{`Image upload is ${Math.round(Trackprogress)}% done`}</p>}
        <div className="new-user-inputs">
            <div className="new-userName">
             <label>Username</label><br/>
             <input type="text" placeholder="Username"/>
            </div> 
            <div className="new-role">
             <label>Role</label><br/>
             <select>
                <option>Admin</option>
                <option>Regular</option>
             </select>
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
            <button className="new-user-saveBtn" onClick={uploadUserImg}>Save</button>
            <button onClick={closeuserPopup} className="new-user-cancelBtn">Cancel</button>
        </div>
        </form>
    </div>
  )
}

export default AddNewUser
