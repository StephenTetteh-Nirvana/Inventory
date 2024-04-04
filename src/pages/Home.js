import "../css/Home.css"
import noUser from "../images/no-user.png"
import Navbar from "../components/Navbar.jsx";

const Home = () => {

    return(
        <div className="no-user-display">
            <Navbar />
            <div className="homePage-container">
              <img src={noUser} alt="Logo"/>
              <h2>Nothing To See Here...</h2>
            </div>
        </div>
    )
}

export default Home
