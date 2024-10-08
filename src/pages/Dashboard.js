import { useEffect, useState } from "react";
import { db } from "../firebase"
import {collection,onSnapshot,doc } from "firebase/firestore"
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
          const newList = list.filter((p)=>p.stockLevel === 0)
          localStorage.setItem("OutOfStock",JSON.stringify(newList))
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    });
    return unsub;
  }
  
  const fetchUnits = () =>{
    const unsub = onSnapshot(collection(db,"Units"),(snapshot)=>{
      let list = []
      snapshot.forEach((doc)=>{
        list.unshift({id:doc.id,...doc.data()})
      })
      localStorage.setItem("units",JSON.stringify(list))
    })
    return unsub;
    }

  const fetchCategories = () => {
    const unsub = onSnapshot(collection(db,"Categories"),(snapshot)=>{
      let list = []
      snapshot.forEach((doc)=>{
        list.unshift({id:doc.id,...doc.data()})
      })
      localStorage.setItem("categories",JSON.stringify(list))
    })
    return unsub;
    }

  const fetchBrands = () => {
  const unsub = onSnapshot(collection(db,"Brands"),(snapshot)=>{
    let list = []
    snapshot.forEach((doc)=>{
      list.unshift({id:doc.id,...doc.data()})
    })
    localStorage.setItem("brands",JSON.stringify(list))
  })
  return unsub;
  }

  const fetchWarehouses = async()=>{
    const unsub = onSnapshot(collection(db, "Warehouses"), (snapshot) => {
      try {
          let list = [];
          snapshot.forEach((doc) => {
              list.push(doc.data());
          })
          localStorage.setItem("warehouses",JSON.stringify(list))
      } catch (error) {
          console.error("Error fetching data: ", error);
      }
      return unsub;
  })
  }


  const totalAmount = async() =>{
      const colRef = collection(db,"Products")
      const unsub = onSnapshot(doc(colRef,"Product Arrays"), (snapshot) => {
      try {
        let sum = 0;
        const products = snapshot.data().products;
        products.forEach((item)=>{
        const unitPrice = item.price;
        const stockLevel = item.stockLevel;
        let total = unitPrice*stockLevel;
        sum += total
        localStorage.setItem("totalAmount",JSON.stringify(sum))
      })
      } catch (error) {
          console.error("Error fetching data: ", error);
      }
    })
    return unsub;
  }

  useEffect(()=>{
    fetchProducts()
    totalAmount()
    fetchUnits()
    fetchCategories()
    fetchBrands()
    fetchWarehouses()
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
