import { useEffect, useState } from "react"
import { collection,onSnapshot, doc , getDoc , updateDoc, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import RestockDialog from "../components/RestockDialog"
import DeleteLoader from "../components/DeleteLoader"
import "../css/Restock.css"


const Restock = () => {
  const currentUser = localStorage.getItem("userRole") !== null ? JSON.parse(localStorage.getItem("userRole")) : "" 
  const userData = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : "" 
  const [width,setWidth] = useState(false)
  const [products,setProducts] = useState([])
  const [popUp,setPopUp] = useState(false)
  const [stockLevel,setStockLevel] = useState('')
  const [newStock,setNewStock] = useState(0)
  const [productId,setProductId] = useState('')
  const [retrievedID,setRetrievedID] = useState('')
  const [loading,setLoading] = useState(false)
  const [disabled,setDisabled] = useState(true)

  const openRestockDialog = (stock,Id) => {
    setPopUp(true)
    setStockLevel(stock)
    setProductId(Id)
  }

  const restockProducts = async() => {
    try{
      setLoading(true)
      const docRef = doc(db,"Products","Product Arrays")
      const docData = await getDoc(docRef)
      if(docData.exists()){
        await updateDoc(docRef,{
          products:products
        })
      }
      await updatingProductsInCategory()
      await updatingProductsInBrands()
      await updatingProductsWarehouse()
      toast.success("Products restocked",{
        autoClose: 2000
      })
    }catch(error){
      toast.error("Network Error")
    }finally{
      setLoading(false)
      setDisabled(true)
    }
  }

  const updatingProductsInCategory = async() => {
    try {
      const colRef = collection(db, "Categories");
      const querySnapshot = await getDocs(colRef);

      const updatePromises = [];
  
      for (const document of querySnapshot.docs) {
        const docId = document.id;
        const categoryName = document.data().name;
        const categoryProducts = document.data().products;
  
        const updatedProductsArray = categoryProducts.map((product) => {
          const matchingProduct = products.find(item => item.id === product.id && item.category === categoryName);
          if (matchingProduct) {
            return { ...product, stockLevel: matchingProduct.stockLevel };
          }
          return product;
        });
  
        const updatedDoc = doc(db, "Categories", docId);
        updatePromises.push(updateDoc(updatedDoc, { products: updatedProductsArray }));
      }
        await Promise.all(updatePromises);
    } catch (error) {
      toast.error("Network Error")
    }
  }

    const updatingProductsInBrands = async() => {
    try {
      const colRef = collection(db, "Brands");
      const querySnapshot = await getDocs(colRef);
      
      const updatePromises = [];
  
      for (const document of querySnapshot.docs) {
        const docId = document.id;
        const brandName = document.data().name;
        const brandProducts = document.data().products;
  
        const updatedProductsArray = brandProducts.map((product) => {
          const matchingProduct = products.find(item => item.id === product.id && item.brand === brandName);
          if (matchingProduct) {
            return { ...product, stockLevel: matchingProduct.stockLevel };
          }
          return product;
        });
  
        const updatedDoc = doc(db, "Brands", docId);
        updatePromises.push(updateDoc(updatedDoc, { products: updatedProductsArray }));
      }
  
      await Promise.all(updatePromises);
    } catch (error) {
      toast.error("Network Error")
    }
  }

  const updatingProductsWarehouse = async() => {
    try {
      const colRef = collection(db, "Warehouses");
      const querySnapshot = await getDocs(colRef);

      const updatePromises = [];
  
      for (const document of querySnapshot.docs) {
        const docId = document.id;
        const warehouseName = document.data().name;
        const warehouseProducts = document.data().products;
  
        const updatedProductsArray = warehouseProducts.map((product) => {
          const matchingProduct = products.find(item => item.id === product.id && item.warehouse === warehouseName);
          if (matchingProduct) {
            return { ...product, stockLevel: matchingProduct.stockLevel };
          }
          return product;
        });
  
        const updatedDoc = doc(db, "Warehouses", docId);
        updatePromises.push(updateDoc(updatedDoc, { products: updatedProductsArray }));
      }
        await Promise.all(updatePromises);
    } catch (error) {
      toast.error("Network Error")
    }
  }


  const fetchProducts = async() =>{
    setDisabled(true)
    const colRef = collection(db,"Products")
    const unsub = onSnapshot(doc(colRef,"Product Arrays"), (snapshot) => {
      try {
        let list = [];
        list = snapshot.data().products;
        setProducts([...list]);
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
  });
  return unsub;
  }

  const fetchWarehouseProducts = async() => {
    try{
      setDisabled(true)
      const colRef = collection(db,"Warehouses")
      const warehouseDocs = await getDocs(colRef)

      for( let document of warehouseDocs.docs){
       const warehouseName = document.data().name
       if(warehouseName === userData.warehouse){
          const warehouseRef = doc(db,"Warehouses",userData.warehouse)
          const unsub = onSnapshot(warehouseRef,(snapshot)=>{
            const productsArr = snapshot.data().products
            setProducts([...productsArr])
          })
         return unsub;
       }else{
        console.log("not found",document.data().manager)
       }
      }
    }catch(error){
      console.log(error)
    }
  }

  const updateStock = () => {
    try{
      let list = []
      const updatedProductArray = products.map((item)=>{
      if(item.id === retrievedID){
      console.log("product found")
      const updatedProduct = {
        ...item,
        stockLevel:stockLevel + Number(newStock)
      }
      return updatedProduct;
    }else{
      return item;
    }
    })
    list = updatedProductArray
    setProducts([...list])
    }catch(error){
      console.log(error)
    }
  }
    
  useEffect(()=>{
    if(newStock !== "" && retrievedID !== ""){
      updateStock()
      setDisabled(false)
    }else{
      setDisabled(true)
      console.log("no new stocks")
    }
  },[newStock,retrievedID])

  const checkUserRole = () =>{
    if(currentUser === "Admin"){
      fetchProducts()
    }else if(currentUser === "Regular"){
      fetchWarehouseProducts()
    }
  }

  useEffect(()=>{
    checkUserRole()
  },[])


  return (
    <div>
      <Navbar/>
      {popUp && <RestockDialog 
      setPopUp={setPopUp} 
      setNewStock={setNewStock}
      productId={productId} 
      setRetrievedID={setRetrievedID}
      />}
        <div className="main-container">
          {currentUser === "Admin" && <Sidebar width={width} setWidth={setWidth}/>}
          <div className={`content ${width ? "add-width" : ""}`}>
            <div className="restock-header">
              <h1>Restock</h1>
              <div className="restock-btnBox">
                <button 
                disabled={disabled}
                style={disabled ? {cursor:"not-allowed",opacity:"0.5"} : {cursor:"pointer"}} 
                className="savebtn" onClick={()=>restockProducts()}>Save Changes</button>
                <button
                style={disabled ? {cursor:"not-allowed",opacity:"0.5"} : {cursor:"pointer"}} 
                className="cancelbtn" onClick={()=>checkUserRole()}>Cancel</button>
              </div>
            </div>
            <div className="content-container">
              <ul>
                <li>Name</li>
                <li>Stock Level</li>
                <li>Actions</li>
              </ul>
              {products.length > 0 ? products.map((item)=>(
              <div key={item.id} className="restock-product">
                <div>{item.product}</div>
                <div>{item.stockLevel}</div>
                <div><button className="restock-btn" onClick={()=>openRestockDialog(item.stockLevel,item.id)}>Restock</button></div>
              </div>
              ))
              : 
              (
              <h3>No products yet!!!</h3>
              )
              }
            </div>
          </div>
        </div>
        {loading && <DeleteLoader/>}
    </div>
)}

export default Restock