import "../css/OutOfStock.css"




const OutOfStock = () => {
  const noStock = localStorage.getItem("OutOfStock") !== null ? JSON.parse(localStorage.getItem("OutOfStock")) : []

  return (
    <div>
      { noStock.length > 0 ? (
           noStock.map((product,index)=>(
            <div className="noStock-product" key={index}> 
              <div>
                <p>{product.id}</p>
              </div>

              <div className="name">
                <p>{product.product}</p>
              </div>

              <div>
               <p>{product.Measurement}</p>
              </div>

              <div>
               <p>${product.price}.00</p>
              </div>

              <div>
               <p>{product.stockLevel}</p>
              </div>

              <div>
               <p>{product.category}</p>
              </div>

              <div>
               <p>{product.brand}</p>
              </div>
              <div>
               <p style={{fontWeight:"700"}}>No Actions</p>
              </div>
            </div>
           ))
      ): (
        <h3>All products are available at the moment!!</h3>
      )
      }
    </div>
  )
}

export default OutOfStock
