import { Link } from "react-router-dom"
import { Pencil, Trash,Loader } from "lucide-react"
import { ChevronLeft } from "lucide-react"
import {collection, doc, getDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../firebase"
import { useState } from "react"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import "../css/ViewUnits.css"

const ViewUnits = ({setAllUnits}) => {
  const units = localStorage.getItem("units") !== null ? JSON.parse(localStorage.getItem("units")) : []
  const [loading,setLoading] = useState(false)
  const [disabled,setDisabled] = useState(false)

  const closeAllUnits = () =>{
    setAllUnits(false)
  }

  const dummy = () =>{
    console.log("not allowed")
  }

  const deletePopUp = (Id,unit) =>{
    Swal.fire({
      title: "Are you sure?",
      text: "All products with this unit will no longer have a unit of measurement",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async(result) => {
      if (result.isConfirmed) {
        await deleteUnit(Id,unit)
      }
    });
   }

  const deleteUnit = async(Id,unit) => {
    try{
    setLoading(true)
    setDisabled(true)
    const allProducts = doc(db,"Products","Product Arrays")
    const productsData = await getDoc(allProducts)
    if(productsData.exists()){
        const productsArr = productsData.data().products
        const updatedProductsArr = productsArr.map((product)=>{
            const measurement = product.Measurement;
            const productUnit = measurement.match(/[a-zA-Z]+$/)[0];
            if(unit === productUnit){
             const updatedProduct = {
                ...product,
                Measurement:"None"
             }   
             return updatedProduct;
            }else{
              return product;
            }
        })
        await updateDoc(allProducts,{
            products:updatedProductsArr
        })
    } 
    const unitDocRef = doc(db,"Units",Id)
    await deleteDoc(unitDocRef)
    setLoading(false)
    setDisabled(false)
    toast.success("Unit Deleted",{
        autoClose:1500
    })
    await deleteUnitInCategory(unit)
    await deleteUnitInBrands(unit)
  }  
  catch(error){
    console.log(error)
    setLoading(false)
    setDisabled(false)
    toast.error("Network Error")
  }
  }

  const deleteUnitInCategory = async(unit) =>{
    try{
        const colRef = collection(db,"Categories")
        const allDocs = await getDocs(colRef)
    
        allDocs.forEach(async(document)=>{
        const docID = document.id 
        const products = document.data().products
        const updatedProductsArr = products.map((product)=>{
            const measurement = product.Measurement;
            const productUnit = measurement.match(/[a-zA-Z]+$/)[0];
            if(unit === productUnit){
             const updatedProduct = {
                ...product,
                Measurement:"None"
             }   
             return updatedProduct;
            }else{
              return product;
            }
        })
        const categoryRef = doc(db,"Categories",docID)
        await updateDoc(categoryRef,{
            products:updatedProductsArr
        })
        })
    }catch(error){
        console.log(error)
    }
}

const deleteUnitInBrands = async(unit) =>{
    try{
        const colRef = collection(db,"Brands")
        const allDocs = await getDocs(colRef)
    
        allDocs.forEach(async(document)=>{
        const docID = document.id 
        const products = document.data().products
        const updatedProductsArr = products.map((product)=>{
            const measurement = product.Measurement;
            const productUnit = measurement.match(/[a-zA-Z]+$/)[0];
            if(unit === productUnit){
             const updatedProduct = {
                ...product,
                Measurement:"None"
             }   
             return updatedProduct;
            }else{
              return product;
            }
        })
        const brandRef = doc(db,"Brands",docID)
        await updateDoc(brandRef,{
            products:updatedProductsArr
        })
        })
        console.log("deleted")
    }catch(error){
        console.log(error)
    }
}

  return (
    <div className="units-container">
       <div className="unitsDisplay-box">
        <div className="units-header">
        <span><ChevronLeft onClick={disabled ? dummy:closeAllUnits} 
        style={disabled ? {cursor:"not-allowed",opacity:"0.7" }:{cursor:"pointer"}} size={30}/>
        </span>
        <h2>Units</h2>
        </div>
        <ul>
            <li>Unit</li>
            <li>Actions</li>
        </ul>
         {units.length > 0 ? units.map((unit,index)=>(
            <div key={index} className="unit-box">
                <div>{unit.unit}</div>
                <div>
                    { loading ? (
                          <button className="delete-loader"><Loader size={17} style={{color:"white"}} /></button>
                    ) : (
                        <div>
                            <Link to={`/dashboard/editUnit/${unit.id}`}>
                             <Pencil size={20} style={{marginLeft:5,color:"#2666CF",cursor:"pointer"}}/>
                            </Link>
                            <Trash onClick={()=>deletePopUp(unit.id,unit.unit)} 
                            size={20} style={{marginLeft:5,color:"red",cursor:"pointer"}}/>
                        </div>
                    )
                    }
                </div>
            </div>
         ))
         : (
            <h2>No Units Yet!!!</h2>
         )
        }
       </div>
    </div>
  )
}

export default ViewUnits
