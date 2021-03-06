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
          Kh??i ph???c m???t kh???u
        </h2>
      </div>
      <div className="px-4 py-4 border-b">
        {error && (
          <div className="text-red-500 border border-red-500 py-2 font-semibold rounded-md mb-2">
            {error}
          </div>
        )}
        <div className="text-lg text-left mb-4">
          Vui l??ng nh???p email ????? kh??i ph???c m???t kh???u c???a b???n
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
                message: 'Vui l??ng nh???p email b???n ???? d??ng ????? ????ng k?? t??i kho???n!'
              }
            ]}
          >
            <Input size="large" className="rounded-md" type="email"></Input>
          </Form.Item>
        </Form>
      </div>
      <div className="px-4 py-4 border-b space-x-4 flex flex-row justify-end">
        <Button size="large" className="rounded-md" onClick={onBack}>
          H???y
        </Button>
        <Button
          type="primary"
          size="large"
          className="rounded-md"
          onClick={() => form.submit()}
        >
          Ti???p t???c
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
          Nh???p m?? b???o m???t
        </h2>
      </div>
      <div className="px-4 py-4 border-b">
        {error && (
          <div className="text-red-500 border border-red-500 py-2 font-semibold rounded-md mb-2">
            {error}
          </div>
        )}
        <div className="text-lg text-left mb-4">
          Vui l??ng ki???m tra m?? trong email c???a b???n. M?? n??y g???m 6 k?? t???.
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
                  message: 'Vui l??ng nh???p m?? x??c nh???n!'
                }
              ]}
            >
              <Input size="large" className="rounded-md"></Input>
            </Form.Item>
          </Form>

          <div className="text-sm text-left mb-4">
            Ch??ng t??i ???? g???i cho b???n m?? v??o email c???a b???n
          </div>
        </div>
      </div>
      <div className="px-4 py-4 border-b space-x-4 flex flex-row justify-end">
        <Button size="large" className="rounded-md" onClick={onBack}>
          Tr??? l???i
        </Button>
        <Button
          type="primary"
          size="large"
          className="rounded-md"
          onClick={() => {
            form.submit()
          }}
        >
          Ti???p t???c
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
          T???o m???t kh???u m???i
        </h2>
      </div>
      <div className="px-4 py-4 border-b">
        {error && (
          <div className="text-red-500 border border-red-500 py-2 font-semibold rounded-md mb-2">
            {error}
          </div>
        )}
        <div className="text-lg text-left mb-4">
          Vui l??ng t???o m???t kh???u m???i cho t??i kho???n c???a b???n
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
                message: 'Vui l??ng nh???p m???t kh???u!'
              },
              {
                type: 'string',
                min: 6,
                message: 'M???t kh???u ph???i ??t nh???t 6 k?? t???'
              }
            ]}
          >
            <Input.Password size="large" className="rounded-md" />
          </Form.Item>
        </Form>
      </div>
      <div className="px-4 py-4 border-b space-x-4 flex flex-row justify-end">
        <Button size="large" className="rounded-md" onClick={onBack}>
          quay l???i
        </Button>
        <Button
          type="primary"
          size="large"
          className="rounded-md"
          onClick={() => form.submit()}
        >
          Ti???p t???c
        </Button>
      </div>
    </div>
  )
}
