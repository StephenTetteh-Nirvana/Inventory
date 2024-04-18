import { useEffect, useState } from "react";
import { db } from "../firebase"
import {collection,onSnapshot,doc,getDocs } from "firebase/firestore"
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import InventoryStats from "../components/InventoryStats.jsx";
import ProductsTable from "../components/ProductsTable.jsx";


const Dashboard = () => {
    const [width,setWidth] = useState(false)
    const [data,setData] = useState([])

    const fetchProducts = async() =>{
        const colRef = collection(db,"Products")
        const unsub = onSnapshot(doc(colRef,"Product Arrays"), (snapshot) => {
          try {
            let list = [];
            list = snapshot.data().products;
            setData(list);
            localStorage.setItem("products",JSON.stringify(list))
            const newList = list.filter((p)=>p.quantity === "0")
            localStorage.setItem("OutOfStock",JSON.stringify(newList))
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
      });
      return unsub;
      }

      const totalAmount = async() =>{
        const colRef = collection(db,"Products")
        const unsub = onSnapshot(doc(colRef,"Product Arrays"), (snapshot) => {
        try {
        const products = snapshot.data().products;
        let sum = 0;
          
              products.forEach((product)=>{
                const total = product.price*product.quantity;
                sum += total;
              })
            localStorage.setItem("totalAmount",JSON.stringify(sum))
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
      });
      return unsub;
      }


      useEffect(()=>{
         fetchProducts()
         totalAmount()
      },[])

    return(
    <div>
        <Navbar/>
        <div className="main-container">
            <Sidebar width={width} setWidth={setWidth}/>
            <div className={`content ${width ? "add-width" : ""}`}>
            <InventoryStats />
            <ProductsTable data={data} fetchProducts={fetchProducts}/>
            </div>
        </div>
    </div>
     )
}

export default Dashboard
