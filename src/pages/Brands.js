import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { onSnapshot,collection,deleteDoc,doc,getDoc,updateDoc,getDocs } from "firebase/firestore"
import { db } from "../firebase"
import { Loader,Eye,Pencil,Trash } from "lucide-react"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import ViewBrandProducts from "../components/ViewBrandProducts"
import "../css/Brands.css"

const Brands = () => {
  const allBrands = localStorage.getItem("brands") !== null ? JSON.parse(localStorage.getItem("brands")) : []
  const [width,setWidth] = useState(false)
  const [brands,setBrands] = useState([])
  const [displayProducts,setDisplayProducts] = useState(false)
  const [brand,setBrand] = useState("")
  const [products,setProducts] = useState([])
  const [deleting,setDeleting] = useState(false)

  const showProducts = (name) =>{
    const foundCategory = allBrands.find((c)=>c.name == name)
    setProducts(foundCategory.products)
    setBrand(foundCategory.name)
    setDisplayProducts(true)
   }


  const fetchBrands = () => {
    const unsub = onSnapshot(collection(db,"Brands"),(snapshot)=>{
      let list = []
      snapshot.forEach((doc)=>{
       list.unshift({id:doc.id,...doc.data()})
      })
      setBrands(list)
      localStorage.setItem("brands",JSON.stringify(list))
    })
    return unsub;
   }

   const deletePopUp = (Id,brandName) =>{
    Swal.fire({
      title: "Are you sure?",
      text: "Deleting this brand will delete all products associated with this brand",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async(result) => {
      if (result.isConfirmed) {
        await deleteBrand(Id,brandName)
      }
    });
   }


   const deleteBrand = async(brandID,brandName) =>{
    try{
      setDeleting(true)
      const productsColRef = doc(db,"Products","Product Arrays")
      const productsDoc = await getDoc(productsColRef);
      if (productsDoc.exists()) {
          const productsArray = productsDoc.data().products;
          const updatedProductsArray = productsArray.filter((p)=>p.brand !== brandName)
          await updateDoc(productsColRef,{
          products:updatedProductsArray
          })
      }
      await deleteBrandProductsInCategory(brandName)
      const docRef = doc(db,"Brands",brandID)
      await deleteDoc(docRef)
      setDeleting(false)
      toast.success("Brand Deleted",{
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

   const deleteBrandProductsInCategory = async(brandName) =>{
    try{
    const categoryColRef = collection(db,"Categories")
    const allCategoryDocs = await getDocs(categoryColRef)

    allCategoryDocs.forEach(async(categoryDoc)=>{
      if(categoryDoc){
        const categoryID = categoryDoc.id;
        const categoryProducts = categoryDoc.data().products
        const updatedCategoryProducts = categoryProducts.filter((p)=>p.brand !== brandName)
        const categoryDocRef = doc(db,"Categories",categoryID)
        await updateDoc(categoryDocRef,{
          products:updatedCategoryProducts
        })
    }
    })
   }catch(error){
    console.log(error)
  }
}

  useEffect(()=>{
  fetchBrands()
  },[])

  return (
    <div>
    <Navbar/>
    <div className="main-container">
      <Sidebar width={width} setWidth={setWidth}/>
      <div className={`content ${width ? "add-width" : ""}`}>
        <div className="brands-header-section">
        <h2>Brands</h2>
        <Link to="/brands/add">
        <button>Add Brand</button>
        </Link>
        </div>

        <div className="brands-container">
            <ul>
              <li>Id</li>
              <li>Name</li>
              <li>Created On</li>
              <li>Actions</li>
            </ul>
            {brands.length > 0 ? (
        brands.map((brand,index)=>(
          <div key={index} className="category">
            <div>
              <p>{brand.id}</p>
            </div>
            <div>
              <p>{brand.name}</p>
            </div> 
            <div>
              <p>{brand.createdAt}</p>
            </div>
            <div>
            { deleting ? (
              <button className="delete-loader"><Loader size={17} style={{color:"white"}} /></button>
            ) : (
              <div>
              <Eye onClick={()=>showProducts(brand.name)} size={20} style={{color:"green",cursor:"pointer"}}/>
              <Link to={`/brands/edit/${brand.id}`}>
              <Pencil size={20} style={{marginLeft:5,color:"#2666CF",cursor:"pointer"}} />
              </Link>
              <Trash onClick={()=>deletePopUp(brand.id,brand.name)} size={20} style={{marginLeft:5,color:"red",cursor:"pointer"}}/>
              </div>
            )}
            </div>
          </div>
        ))
      )
      :
      (<h3>No brands yet!!!</h3>)
      }
        </div>
      </div>
  </div>
  {displayProducts && (<ViewBrandProducts products={products} brand={brand} setDisplayProducts={setDisplayProducts}/>)}
</div>
  )
}

export default Brands
