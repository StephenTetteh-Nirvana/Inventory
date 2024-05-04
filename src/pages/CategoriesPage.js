import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { onSnapshot,collection,deleteDoc,doc } from "firebase/firestore"
import { Eye,Loader,Pencil,Trash } from "lucide-react"
import { db } from "../firebase"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { toast } from "react-toastify"
import ViewCategoryProducts from "../components/ViewCategoryProducts"
import "../css/CategoriesPage.css"

const CategoriesPage = () => {
   const allCategories = localStorage.getItem("categories") !== null ? JSON.parse(localStorage.getItem("categories")) : []
   const [width,setWidth] = useState(false)
   const [categories,setCategories] = useState([])
   const [displayProducts,setDisplayProducts] = useState(false)
   const [products,setProducts] = useState([])
   const [category,setCategory] = useState("")
   const [deleting,setDeleting] = useState(false)

   const showProducts = (name) =>{
    const foundCategory = allCategories.find((c)=>c.name == name)
    setProducts(foundCategory.products)
    setCategory(foundCategory.name)
    setDisplayProducts(true)
   }

   const fetchCategories = () => {
    const unsub = onSnapshot(collection(db,"Categories"),(snapshot)=>{
      let list = []
      snapshot.forEach((doc)=>{
       list.unshift({id:doc.id,...doc.data()})
      })
      setCategories(list)
      localStorage.setItem("categories",JSON.stringify(list))
    })
    return unsub;
   }

   const deleteCategory = async(Id) =>{
    try{
      setDeleting(true)
      const docRef = doc(db,"Categories",Id)
      await deleteDoc(docRef)
      setDeleting(false)
      toast.success("Category Deleted",{
        autoClose:1000
      })
    }catch(error){
      console.log(error)
      setDeleting(false)
      toast.error("Operation Failed",{
        autoClose:2000
      })
    }
   }

   useEffect(()=>{
    fetchCategories()
   },[])

  return (
    <div>
    <Navbar/>
    <div className="main-container">
      <Sidebar width={width} setWidth={setWidth}/>
      <div className={`content ${width ? "add-width" : ""}`}>
        <div className="categories-header-section">
        <h2>Categories</h2>
        <Link to="/categories/add">
        <button>Add Category</button>
        </Link>
        </div>

        <div className="categories-container">
            <ul>
              <li>Id</li>
              <li>Name</li>
              <li>Created On</li>
              <li>Actions</li>
            </ul>

      {categories.length > 0 ? (
        categories.map((category,index)=>(
          <div key={index} className="category">
            <div>
              <p>{category.id}</p>
            </div>
            <div>
              <p>{category.name}</p>
            </div> 
            <div>
              <p>{category.createdAt}</p>
            </div>
            <div>
            { deleting ? (
              <button className="delete-loader"><Loader size={17} style={{color:"white"}} /></button>
            ) : (
              <div>
              <Eye onClick={()=>showProducts(category.name)} size={20} style={{color:"green",cursor:"pointer"}}/>
              <Link to={`/categories/edit/${category.id}`}>
              <Pencil size={20} style={{marginLeft:5,color:"#2666CF",cursor:"pointer"}} />
              </Link>
              <Trash onClick={()=>deleteCategory(category.id)} size={20} style={{marginLeft:5,color:"red",cursor:"pointer"}}/>
              </div>
            )}
            </div>
          </div>
        ))
      )
      :
      (<h3>No categories yet!!!</h3>)
      }
      </div>
    </div>
  </div>
  {displayProducts && (<ViewCategoryProducts products={products} category={category} setDisplayProducts={setDisplayProducts}/>)}
</div>
  )
}

export default CategoriesPage
