import { useState } from "react"
import { X } from "lucide-react"
import "../css/RestockDialog.css"



const RestockDialog = ({setPopUp,productId,setNewStock,setRetrievedID}) => {
  const [stockValue,setStockValue] = useState('')
  const [errMsg,setErrMsg] = useState('')

  const closePopUp = () => {
    setPopUp(false)
  }

  const restockButtonClick = () => {
    setNewStock(stockValue)
    setRetrievedID(productId)
    setPopUp(false)
  }

  const handleChange = (event) => {
      const inputValue = event.target.value 
      if(/^\d*$/.test(inputValue)){
        setStockValue(inputValue)
        setErrMsg('')
      }else{
          setErrMsg("Numbers only")
      }
  }
  return (
    <div className="restockPopUp-container">
      <div className="restock-table">
        <div className="headerSection">
          <h3>Restock Product</h3>
          <X onClick={closePopUp} />
        </div>
        <div className="contentSection">
          <input type="text" 
          onChange={handleChange}
          value={stockValue}
          placeholder='Enter Numbers(no letters/symbols)...'
          />
          <p className="error-msg">{errMsg}</p>
          <button onClick={()=>restockButtonClick()}>Restock</button>
        </div>
      </div>
    </div>
  )
}

export default RestockDialog


