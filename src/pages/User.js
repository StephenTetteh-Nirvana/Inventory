

const User = () => {
    const [width,setWidth] = useState(false)
  return (
    <div>
        <Navbar/>
        <div className="main-container">
            <Sidebar width={width} setWidth={setWidth}/>
            <div className={`content ${width ? "add-width" : ""}`}>
            <h1>Warehouse</h1>
            </div>
        </div>
    </div>
)
}

export default User
