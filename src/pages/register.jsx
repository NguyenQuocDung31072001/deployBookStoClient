import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../redux/api_request";
import { Input, Button } from "antd";

export default function RegisterPages() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerSubmit = (e) => {
    e.preventDefault();
    const user = {
      username: username,
      email: email,
      password: password,
    };
    registerApi(user, dispatch, navigate);
  };

  return (
    <div className="h-screen flex justify-center items-center ">
      <div className="w-screen h-screen fixed ">
        <img
          className="w-full h-full object-cover"
          src="https://thumbs.dreamstime.com/b/man-holding-modern-ebook-reader-book-one-hand-paper-other-books-bookshelf-background-107296790.jpg"
          alt=""
          />
      </div>
      <div className="w-[300px] h-[400px] flex flex-col justify-center items-center bg-white rounded-[10px] z-10">
        <form
          className="flex flex-col justify-center items-center w-[260px] h-full relative "
          action=""
          // onSubmit={loginSubmit}
        >
          <div className="flex flex-col justify-center items-center bg-sky-600 w-[260px] h-[80px] absolute top-[-20px] rounded-xl text-white text-[20px]">
            <h2>Register</h2>
          </div>

          <div className=" mb-[10px]">
            <Input
              className="w-[260px]"
              type="text"
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className=" mb-[20px]">
            <Input
              className="w-[260px]"
              type="text"
              label="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className=" mb-[20px]">
            <Input
              className="w-[260px]"
              type="password"
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            variant="contained"
            onClick={registerSubmit}
          >
            Register
          </Button>
          <div className="absolute bottom-[20px] ">
            <span>
              If you have account?
              <Link className="text-sky-600" to="/login">
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
