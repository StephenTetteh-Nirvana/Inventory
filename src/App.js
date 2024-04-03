
import {Routes,Route} from "react-router-dom"
import "./App.css"
import Home from "./pages/Home.js"
import Login from "./pages/Login.js"
import Register from "./pages/Register.js"
import NotFound from "./pages/NotFound.js"


function App() {
return(
  <div className="App">
     <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="*" element={<NotFound/>}></Route>
      </Routes>
  </div>
)
}

export default App;
