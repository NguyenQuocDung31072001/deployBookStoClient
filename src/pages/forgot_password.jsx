import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  confirmVerifyCode,
  forgotRequest,
  loginApi,
  updateNewPassword
} from '../redux/api_request'
import { Form, Input, Button } from 'antd'
import { string } from 'prop-types'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const navigate = useNavigate()

  function cancelHandler() {
    navigate('/')
  }

  function submitHandler() {
    setStep(step + 1)
  }

  function backHandler() {
    setError('')
    setStep(step - 1)
  }

  async function resetRequestHandler(value) {
    setEmail(value.email)
    const result = await forgotRequest(value)
    if (result.success) setStep(step + 1)
    else setError(result.message)
  }

  async function verifyCodeHandler(value) {
    setVerifyCode(value.verifyCode)
    const result = await confirmVerifyCode(email, value.verifyCode)
    if (result.success) setStep(step + 1)
    else setError(result.message)
  }

  async function updatePasswordHandler(value) {
    const password = value.password
    const result = await updateNewPassword(email, verifyCode, password)
    console.log(result)
    if (result.success) navigate('/')
    else setError(result.message)
  }

  return (
    <div className="h-screen flex justify-center items-center">
      {step === 1 && (
        <EmailForm
          onBack={cancelHandler}
          handler={resetRequestHandler}
          error={error}
        />
      )}

      {step == 2 && (
        <VerifyForm
          onBack={backHandler}
          handler={verifyCodeHandler}
          error={error}
        />
      )}

      {step == 3 && (
        <UpdateForm
          onBack={backHandler}
          handler={updatePasswordHandler}
          error={error}
        />
      )}
    </div>
  )
}

function EmailForm(props) {
  const { onBack, handler, error } = props
  const [form] = Form.useForm()
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  return (
    <div className="bg-white rounded-md overflow-hidden w-[500px]">
      <div className="bg-white border-b ">
        <h2 className="text-xl font-bold text-left px-4 py-4 mb-0">
          Khôi phục mật khẩu
        </h2>
      </div>
      <div className="px-4 py-4 border-b">
        {error && (
          <div className="text-red-500 border border-red-500 py-2 font-semibold rounded-md mb-2">
            {error}
          </div>
        )}
        <div className="text-lg text-left mb-4">
          Vui lòng nhập email để khôi phục mật khẩu của bạn
        </div>
        <Form
          form={form}
          name="resetEmail"
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          onFinish={handler}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Vui lòng nhập email bạn đã dùng để đăng kí tài khoản!'
              }
            ]}
          >
            <Input size="large" className="rounded-md" type="email"></Input>
          </Form.Item>
        </Form>
      </div>
      <div className="px-4 py-4 border-b space-x-4 flex flex-row justify-end">
        <Button size="large" className="rounded-md" onClick={onBack}>
          Hủy
        </Button>
        <Button
          type="primary"
          size="large"
          className="rounded-md"
          onClick={() => form.submit()}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  )
}

function VerifyForm(props) {
  const { handler, onBack, error } = props
  const [form] = Form.useForm()

  return (
    <div className="bg-white rounded-md overflow-hidden w-[500px]">
      <div className="bg-white border-b ">
        <h2 className="text-xl font-bold text-left px-4 py-4 mb-0">
          Nhập mã bảo mật
        </h2>
      </div>
      <div className="px-4 py-4 border-b">
        {error && (
          <div className="text-red-500 border border-red-500 py-2 font-semibold rounded-md mb-2">
            {error}
          </div>
        )}
        <div className="text-lg text-left mb-4">
          Vui lòng kiểm tra mã trong email của bạn. Mã này gồm 6 kí tự.
        </div>
        <div className="flex flex-row items-start space-x-4">
          <Form
            form={form}
            name="resetEmail"
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            onFinish={handler}
            autoComplete="off"
          >
            <Form.Item
              name="verifyCode"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mã xác nhận!'
                }
              ]}
            >
              <Input size="large" className="rounded-md"></Input>
            </Form.Item>
          </Form>

          <div className="text-sm text-left mb-4">
            Chúng tôi đã gửi cho bạn mã vào email của bạn
          </div>
        </div>
      </div>
      <div className="px-4 py-4 border-b space-x-4 flex flex-row justify-end">
        <Button size="large" className="rounded-md" onClick={onBack}>
          Trở lại
        </Button>
        <Button
          type="primary"
          size="large"
          className="rounded-md"
          onClick={() => {
            form.submit()
          }}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  )
}

function UpdateForm(props) {
  const { handler, onBack, error } = props
  const [form] = Form.useForm()
  return (
    <div className="bg-white rounded-md overflow-hidden w-[500px]">
      <div className="bg-white border-b ">
        <h2 className="text-xl font-bold text-left px-4 py-4 mb-0">
          Tạo mật khẩu mới
        </h2>
      </div>
      <div className="px-4 py-4 border-b">
        {error && (
          <div className="text-red-500 border border-red-500 py-2 font-semibold rounded-md mb-2">
            {error}
          </div>
        )}
        <div className="text-lg text-left mb-4">
          Vui lòng tạo mật khẩu mới cho tài khoản của bạn
        </div>
        <Form
          form={form}
          name="updatePassword"
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          onFinish={handler}
          autoComplete="off"
        >
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!'
              },
              {
                type: 'string',
                min: 6,
                message: 'Mật khẩu phải ít nhất 6 kí tự'
              }
            ]}
          >
            <Input.Password size="large" className="rounded-md" />
          </Form.Item>
        </Form>
      </div>
      <div className="px-4 py-4 border-b space-x-4 flex flex-row justify-end">
        <Button size="large" className="rounded-md" onClick={onBack}>
          quay lại
        </Button>
        <Button
          type="primary"
          size="large"
          className="rounded-md"
          onClick={() => form.submit()}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  )
}
