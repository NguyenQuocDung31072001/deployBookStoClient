import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Input, Checkbox } from 'antd'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginApi, registerApi } from '../redux/api_request'

function LoginAndRegister() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const showModal = () => {
    setIsModalVisible(true)
    setIsLogin(true)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  useEffect(() => {
    setEmail('')
    setUsername('')
    setPassword('')
  }, [isLogin])

  const loginSubmit = e => {
    e.preventDefault()
    const user = {
      email: email,
      password: password
    }
    loginApi(user, dispatch, navigate)
  }

  const registerSubmit = e => {
    e.preventDefault()
    const user = {
      // username: username,
      email: email,
      password: password
    }
    // console.log(user)
    registerApi(user, dispatch)
    setIsLogin(true)
  }

  return (
    <div>
      <div
        className=" cursor-pointer"
        onClick={showModal}
      >
        <p className='text-blue-700'>Đăng nhập/Đăng kí</p>
      </div>
      {isLogin && (
        <Modal
          title="Login"
          visible={isModalVisible}
          width={400}
          onCancel={handleCancel}
          footer={null}
          cancelButtonProps
        >
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            className="flex flex-col "
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input onChange={e => setEmail(e.target.value)} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            >
              <Input.Password onChange={e => setPassword(e.target.value)} />
            </Form.Item>

            {/* <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox onChange={e => console.log(e.target.checked)}>
                Remember me
              </Checkbox>
            </Form.Item> */}

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" onClick={loginSubmit}>
                Submit
              </Button>
            </Form.Item>
            <Form.Item className="flex flex-col items-center justify-center">
            <p
                className="text-sky-500 cursor-pointer"
                onClick={() => navigate('/forgotPassword')}
              >
                Quên mật khẩu
              </p>
              <p
                className="text-sky-500 cursor-pointer"
                onClick={() => setIsLogin(false)}
              >
                Đăng ký tài khoản
              </p>
            </Form.Item>
          </Form>
        </Modal>
      )}
      {!isLogin && (
        <Modal
          title="Register"
          visible={isModalVisible}
          width={400}
          onCancel={handleCancel}
          footer={null}
          cancelButtonProps
        >
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input onChange={e => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            >
              <Input.Password onChange={e => setPassword(e.target.value)} />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox onChange={e => console.log(e.target.checked)}>
                Remember me
              </Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" onClick={registerSubmit}>
                Register
              </Button>
            </Form.Item>
            <Form.Item className="flex justify-center">
              <span>If you alraedy have account?</span>
              <span
                className="text-sky-500 cursor-pointer"
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  )
}

export default LoginAndRegister
