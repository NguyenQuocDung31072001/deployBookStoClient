import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginApi } from '../redux/api_request'
import { Form, Input, Button, Checkbox } from 'antd';


export default function LoginPages() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loginSubmit = e => {
    e.preventDefault()
    const user = {
      email: email,
      password: password
    }
    loginApi(user, dispatch, navigate)
  }


  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  
  return (
    <div className="h-screen flex justify-center items-center  ">
      <div className="w-screen h-screen fixed ">
        <img
          className="w-full h-full object-cover"
          src="https://thumbs.dreamstime.com/b/modern-ebook-reader-books-man-taking-bookshelf-107296999.jpg"
          alt=""
        />
      </div>
      <div className="w-[300px] h-[350px] flex flex-col justify-center items-center bg-white rounded-[10px] z-10">
        
      <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input onChange={e => setEmail(e.target.value)}/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password onChange={e => setPassword(e.target.value)}/>
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox onChange={e=>console.log(e.target.checked)}>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" onClick={loginSubmit}>
          Submit
        </Button>
      </Form.Item>
    </Form>
        {/* <form
          className="flex flex-col justify-center items-center w-[260px] h-full relative "
          action=""
          // onSubmit={loginSubmit}
        >
          <div className="flex flex-col justify-center items-center bg-sky-600 w-[260px] h-[80px] absolute top-[-20px] rounded-xl text-white text-[20px]">
            <h2>Sign in</h2>
          </div>

          <div className=" mb-[10px]">
            <Input
              className="w-[260px]"
              type="text"
              label="Email"
              placeholder='email'
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className=" mb-[20px]">
            <Input
              className="w-[260px]"
              type="password"
              label="Password"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <Button className="w-full" variant="contained" onClick={loginSubmit}>
            Sign in
          </Button>
          <div className="absolute bottom-[20px] ">
            <span>
              If you don't have account?
              <Link className="text-sky-600" to="/register">
                Register
              </Link>
            </span>
          </div>
        </form> */}
      </div>
    </div>
  )
}
