import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { onSnapshot,collection,deleteDoc,doc, updateDoc,getDoc,getDocs } from "firebase/firestore"
import { Eye,Loader,Pencil,Trash } from "lucide-react"
import { db } from "../firebase"
import Swal from "sweetalert2"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
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
    const foundCategory = allCategories.find((c)=>c.name === name)
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

   const deletePopUp = (Id,categoryName) =>{
    Swal.fire({
      title: "Are you sure?",
      text: "Deleting this category will delete all products associated with this category",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async(result) => {
      if (result.isConfirmed) {
        await deleteCategory(Id,categoryName)
      }
    });
   }

   const deleteCategory = async(Id,categoryName) =>{
    try{
      setDeleting(true)
      const productsColRef = doc(db,"Products","Product Arrays")
      const productsDoc = await getDoc(productsColRef);
      if (productsDoc.exists()) {
          const productsArray = productsDoc.data().products;
          const updatedProductsArray = productsArray.filter((p)=>p.category !== categoryName)
          await updateDoc(productsColRef,{
          products:updatedProductsArray
          })
      }
      await deleteCategoryProductsInBrand(categoryName)
      const docRef = doc(db,"Categories",Id)
      await deleteDoc(docRef)
      setDeleting(false)
      toast.success("Category Deleted",{
        autoClose:1000
      })
    }catch(error){
      console.log(error)
      setDeleting(false)
      toast.error("Network Error",{
        autoClose:2000
      })
    }
   }

   const deleteCategoryProductsInBrand = async(categoryName) =>{
    try{
    const brandColRef = collection(db,"Brands")
    const allBrandDocs = await getDocs(brandColRef)

    allBrandDocs.forEach(async(brandDoc)=>{
      if(brandDoc){
        const brandID = brandDoc.id;
        const brandProducts = brandDoc.data().products
        const updatedBrandProducts = brandProducts.filter((p)=>p.category !== categoryName)
        const brandDocRef = doc(db,"Brands",brandID)
        await updateDoc(brandDocRef,{
          products:updatedBrandProducts
        })
    }
    })
   }catch(error){
    console.log(error)
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
              <Trash onClick={()=>deletePopUp(category.id,category.name)} size={20} style={{marginLeft:5,color:"red",cursor:"pointer"}}/>
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
