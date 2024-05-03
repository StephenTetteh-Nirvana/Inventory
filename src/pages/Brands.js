import { useState } from "react"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import "../css/Brands.css"

const Brands = () => {
  const [width,setWidth] = useState(false)


  return (
    <div>
    <Navbar/>
    <div className="main-container">
        <Sidebar width={width} setWidth={setWidth}/>
        <div className={`content ${width ? "add-width" : ""}`}>
          <div className="brands-header-section">
          <h2>Brands</h2>
          <button>Add Brand</button>
          </div>

          <div className="brands-container">
              <ul>
                <li>Id</li>
                <li>Name</li>
                <li>Created On</li>
                <li>Actions</li>
              </ul>
          </div>
        </div>
    </div>
</div>
  )
}

export default Brands
