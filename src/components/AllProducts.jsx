import { useState } from "react"
import { Eye,Pencil,Trash,Loader } from "lucide-react"
import { Link } from "react-router-dom"
import { updateDoc,doc,collection,getDocs,getDoc } from "firebase/firestore"
import { db } from "../firebase"
import "../css/AllProducts.css"
import ViewProduct from "./ViewProduct"
import { toast } from "react-toastify"

const AllProducts = () => {
    const products = localStorage.getItem("products") !== null ? JSON.parse(localStorage.getItem("products")) : []
    const [viewProduct,setViewProduct] = useState(false)
    const [product,setProduct] = useState(null)
    const [loading,setLoading] = useState(false)

    const toggleProductDetails = (id) =>{
        const foundProduct = products.find((p)=>p.id === id)
        if(foundProduct){
            setViewProduct(true)
            setProduct(foundProduct)
        }
    }

    const deleteProduct = async(Id,category,brand,warehouse) =>{
      setLoading(true)
      try{
        const productArrayReference = doc(db,"Products","Product Arrays")
        const productData = await getDoc(productArrayReference)
        const productArr = productData.data().products
        const updatedProductsArr = productArr.filter((p)=>p.id !== Id)
        await updateDoc(productArrayReference,{
          products:updatedProductsArr
        })
        toast.success("Product Deleted",{
          autoClose:1000
        })
        await deleteProductFromWarehouse(Id,warehouse)
        await deleteFromCategories(Id,category)
        await deleteFromBrands(Id,brand)
        setLoading(false)
        localStorage.setItem("products",JSON.stringify(updatedProductsArr))
      }catch(error){
        setLoading(false)
         console.log(error)
         toast.error("Network Error")
      }
    }

    const deleteFromCategories = async(Id,category) => {
      try{
          const colRef = collection(db,"Categories")
          const docRef = await getDocs(colRef)
    
          docRef.forEach(async(document)=>{
            const docId = document.id;
            const docName = document.data().name;
            if(category === docName){
              const productsArr = document.data().products
              const productToDelete = productsArr.filter((p)=>p.id !== Id)
              const categoryRef = doc(db,"Categories",docId)
              await updateDoc(categoryRef,{
                products:productToDelete
              })
              }
          })
          }catch(error){
             console.log(error)
             toast.error("Network Error")
           }  
         }

    const deleteFromBrands = async(Id,brand) => {
    try{
        const colRef = collection(db,"Brands")
        const docRef = await getDocs(colRef)
  
        docRef.forEach(async(document)=>{
          const docId = document.id;
          const docName = document.data().name;
          if(brand === docName){
              const brandRef = doc(db,"Brands",docId)
              const productsArr = document.data().products
              const productToDelete = productsArr.filter((p)=>p.id !== Id)
            await updateDoc(brandRef,{
              products:productToDelete
            })
            }
        })
        }catch(error){
            console.log(error)
            toast.error("Network Error")
          }  
        }

    const deleteProductFromWarehouse = async(Id,warehouse) => {
      try{
        const colRef = collection(db,"Warehouses")
        const docRef = await getDocs(colRef)

        docRef.forEach(async(document)=>{
          if(warehouse === document.id){
            const warehouseRef = doc(db,"Warehouses",document.id)
            const productsArr = document.data().products
            const productToDelete = productsArr.filter((p)=>p.id !== Id)
            await updateDoc(warehouseRef,{
             products:productToDelete
           })
          }
        })
     
      }catch(error){
        console.log(error)
        toast.error("Network Error")
      }  
    }


  return (
    <div>
        {products && products.map((product,index)=>(
                  <div className="product" key={index}>
                    <div>
                    <p>{product.id}</p>
                    </div>

                    <div className="product-name">
                    <p>{product.product}</p>
                    </div>

                    <div>
                    <p>{product.Measurement}</p>
                    </div>
                    
                    <div>
                    <p>${product.price.toLocaleString()}.00</p>
                    </div>

                    <div>
                    <p>{product.stockLevel}
                    {product.stockLevel === "0" && <span className="out-of-stock-span">Out Of Stock</span>}
                    {product.stockLevel === product.lowStock && <span className="low-stock-span">Low Stock</span>}
                    </p>
                    </div>

                    <div>
                    <p>{product.category}</p>
                    </div>

                    <div>
                    <p>{product.brand}</p>
                    </div>

                    <div>
                      { loading ? (
                        <button className="delete-loader"><Loader size={17} style={{color:"white"}} /></button>
                      ) : (
                        <div>
                        <Eye onClick={()=>toggleProductDetails(product.id)} 
                        size={20} style={{color:"green",cursor:"pointer"}}
                        />
                        <Link to={`/dashboard/editProduct/${product.id}`}>
                        <Pencil size={20} style={{marginLeft:5,color:"#2666CF",cursor:"pointer"}} />
                        </Link>
                        <Trash 
                        onClick={()=>deleteProduct(product.id,product.category,product.brand,product.warehouse)} 
                        size={20} style={{marginLeft:5,color:"red",cursor:"pointer"}}
                        />
                        </div>
                      )
                      }
                    </div>
                  </div>
                ))
        }
        {viewProduct && <ViewProduct product={product} setViewProduct={setViewProduct}/>}
    </div>
  )
}

export default AllProducts
