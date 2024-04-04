import "../css/AddNewProduct.css"

const AddNewProduct = ({productPopup,setProductPopup}) => {
    const closePopup = () =>{
        setProductPopup(false)
    }
  return (
    <div className={`${productPopup ? "new-product-container showing" : "" }`}>
       <form className="new-product-form" onSubmit={(e)=>e.preventDefault()}>
          <h3>Add New Product</h3>
          <div className="all-newProduct-inputs">
          <div className="warehouse-section">
                <label>Select Warehouse</label><br/>
                <select>
                    <option>Fruits Warehouse</option>
                    <option>Electronics Warehouse</option>
                    <option>Accessories Warehouse</option>
                </select>
            </div>
            <div className="new-product-name">
                <label>Product Name</label><br/>
                <input type="text" placeholder="Enter Product Name..."/>
            </div>
            <div className="new-product-price">
                <label>Product Price</label><br/>
                <input type="text" placeholder="Enter Product Price..."/>
            </div>
            <div className="new-product-quantity">
                <label>Quantity</label><br/>
                <input type="text" placeholder="Quantity..."/>
            </div>
          </div>
          <div className="new-product-buttons">
            <button className="save-product-btn">Save</button>
            <button className="cancel-product-btn" onClick={closePopup}>Cancel</button>
          </div>
       </form>
    </div>
  )
}

export default AddNewProduct
