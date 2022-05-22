import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginFailed } from "../redux/auth_slices";
import { logout } from "../redux/auth_slices";

export default function HomePagesAdmin() {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Logout=()=>{
      console.log('logout')
      dispatch(logout())
  }
  return (
    <div>
      
        <div >
          HomePages admin
        </div>
        <button className="" onClick={()=>Logout()}>
            logout
        </button>
    </div>
  )

}
