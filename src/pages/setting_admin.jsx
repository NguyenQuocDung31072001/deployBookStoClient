import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateAccountAdmin } from "../redux/api_request";
import { loginFailed,logout } from "../redux/auth_slices";

const IMAGE_URL = "http://localhost:5000/image_avatar/avatar_admin.png";

function SettingAdmin() {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const [email, setEmail] = useState(currentUser.email);
  const [username, setUsername] = useState(currentUser.username);
  const [password, setPassword] = useState(currentUser.password);
  const [image, setImage] = useState();
  const [imageBase64, setImageBase64] = useState();

  const dispatch = useDispatch();
  const navigate=useNavigate()

  const Logout=()=>{
      console.log('logout')
      dispatch(logout())
  }

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        // console.log(reader.result)
        setImageBase64(reader.result);
      };
      reader.onerror = () => {
        console.error("AHHHHHHHH!!");
      };
    }
  }, [image]);

  const changeImage = (e) => {
    setImage(e.target.files[0]);
  };

  const updateAccount = (e) => {
    e.preventDefault();
    const account = {
      email: email,
      username: username,
      password: password,
      avatarBase64: imageBase64
    }
    updateAccountAdmin(currentUser, account, dispatch);
  };

  return (
    <div>
      <div className="flex">
        {!currentUser.avatar_url && (
          <img
            className="h-[50px] w-[50px] object-cover rounded-[50px]"
            src={image ? URL.createObjectURL(image) : IMAGE_URL}
            alt=""
          />
        )}
        {currentUser.avatar_url && (
          <img
            className="h-[50px] w-[50px] object-cover rounded-[50px]"
            src={image ? URL.createObjectURL(image) : currentUser.avatar_url}
            alt=""
          />
        )}
        <label htmlFor="avatar_id">
          <i className="fa-solid fa-user-tie text-[50px] cursor-pointer"></i>
          <input
            className="hidden"
            id="avatar_id"
            type="file"
            accept="image/png, image/gif, image/jpeg"
            onChange={changeImage}
          />
        </label>
      </div>

      <div className="flex">
        <label> Email</label>
        <input
          className="ml-[20px] w-[500px]"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex">
        <label>Username</label>
        <input
          className="ml-[20px] w-[500px]"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex">
        <label> Password</label>
        <input
          className="ml-[20px] w-[500px]"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button
          className="w-[100px] h-[60px] bg-teal-500 text-white rounded-[5px]"
          onClick={updateAccount}
        >
          Update Account
        </button>
      </div>
      <button className="" onClick={()=>Logout()}>
            logout
        </button>
    </div>
  );
}

export default SettingAdmin;
