import { useNavigate } from "react-router-dom"
import {BsHouse} from "react-icons/bs"
import {BiUserCircle} from "react-icons/bi"
import {AiOutlineSearch} from "react-icons/ai"
import {MdLogout, MdLogin} from "react-icons/md"
import { useContext } from "react"
import AuthContext from "context/AuthContext"
import {getAuth, signOut} from "firebase/auth"
import { app } from "firebaseApp"
import { toast } from "react-toastify"


function MenuList() {
  const user = useContext(AuthContext)
  const navigate = useNavigate();

  const logOut = async () => {
    const auth = getAuth(app);
    await signOut(auth)
    toast.success("로그아웃 되었습니다.")
  }

  return (
    <div className='footer'>
      <div className='footer_grid'>
        <button type='button' onClick={() => navigate("/")}><BsHouse/>Home</button>
        <button type='button' onClick={() => navigate("/profile")}><BiUserCircle/>Profile</button>
        <button type='button' onClick={() => navigate("/search")}><AiOutlineSearch/>Search</button>
       { user === null ? (
       <button type='button' onClick={() => navigate("/users/login")}><MdLogin/>Login</button>
       ) : (
        <button type='button' onClick={() => logOut()}><MdLogout/>Logout</button>
       )}

      </div>
    </div>
  )
}

export default MenuList