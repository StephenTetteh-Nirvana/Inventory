import "../css/AddNewWarehouse.css"

const AddNewWarehouse = ({warehousePopup,setWarehousePopup}) => {
    const closePopup = () =>{
        setWarehousePopup(false)
    }
  return (
    <div className={`${warehousePopup ? "new-warehouse-container showing" : "" }`}>
       <form className="new-warehouse-form" onSubmit={(e)=>e.preventDefault()}>
          <h3>Add New Warehouse</h3>
          <div className="all-newWarehouse-inputs">
          <div className="warehouse-manager-section">
                <label>Assign Manager</label><br/>
                <select>
                    <option>User 1</option>
                    <option>User 2</option>
                    <option>User 3</option>
                </select>
            </div>
            <div className="new-warehouse-name">
                <label>Warehouse Name</label><br/>
                <input type="text" placeholder="Enter Warehouse Name"/>
            </div>
            <div className="new-warehouse-location">
                <label>Location</label><br/>
                <input type="text" placeholder="Location"/>
            </div>
            <div className="new-warehouse-contactInfo">
                <label>Contact Info</label><br/>
                <input type="text" placeholder="Contact Details"/>
            </div>
            <div className="new-warehouse-capacity">
                <label>Capacity</label><br/>
                <input type="number" placeholder="Capacity"/>
            </div>
          </div>
          <div className="new-warehouse-buttons">
            <button className="save-product-btn">Save</button>
            <button className="cancel-product-btn" onClick={closePopup}>Cancel</button>
          </div>
       </form>
    </div>
  )
}

export default AddNewWarehouse
