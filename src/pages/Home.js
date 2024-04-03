import { useState } from "react";
import "../css/Home.css"
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

const Home = () => {
    const [user,setUser] = useState(true)

    if(!user){
        return(
            <div className="no-user-display">
                <Navbar user={user}/>
                <h1>Nothing to see here</h1>
            </div>
        )
    }else{       
         return(
           <div>
            <Navbar user={user}/>
            <Sidebar/>
           </div>
        )
    }
}

export default Home
