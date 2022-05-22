import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  getDistrictData,
  getProvinceData,
  getWardData,
  updateAccountAdmin,
  updateAccountPassword
} from '../redux/api_request'
import { loginFailed, logout } from '../redux/auth_slices'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import { Input, Button, Image, Select, Form, notification } from 'antd'
import Footer from '../component/footer'
import { cleanBookBought } from '../redux/book_bought_slices'
const { TextArea } = Input

const IMAGE_URL = 'https://bookstoapi.herokuapp.com/image_avatar/avatar_user.png'

function SettingUser() {
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const [email, setEmail] = useState(currentUser?.email)
  const [username, setUsername] = useState(currentUser?.username)
  const [address, setAddress] = useState(currentUser?.address || '')
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '')
  const [birthDate, setBirthDate] = useState(currentUser?.birthDate || '')
  const [image, setImage] = useState()
  const [imageBase64, setImageBase64] = useState()
  const [province, setProvince] = useState(currentUser.address.province || {})
  const [district, setDistrict] = useState(currentUser.address.district || {})
  const [ward, setWard] = useState(currentUser.address.ward || {})
  const [street, setStreet] = useState(currentUser.address.street || '')

  const [provinceData, setProvinceData] = useState([])
  const [districtData, setDistrictData] = useState([])
  const [wardData, setWardData] = useState([])

  const [oldPassword, setOldPassword] = useState()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    const breadcrumb = {
      genre_slug: 'setting',
      genre_name: 'Setting',
      name_book: ''
    }
    dispatch(updateBreadcrumb(breadcrumb))

    const getData = async () => {
      const provinceData = await getProvinceData()
      // console.log(provinceData)
      setProvinceData(provinceData)
    }
    getData()
  }, [])

  useEffect(() => {
    if (image) {
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onloadend = () => {
        // console.log(reader.result)
        setImageBase64(reader.result)
      }
      reader.onerror = () => {
        console.error('AHHHHHHHH!!')
      }
    }
  }, [image])

  const changeImage = e => {
    const image = e.target.files[0]
    if (image) {
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onloadend = () => {
        setImageBase64(reader.result)
      }
      reader.onerror = () => {
        console.error('AHHHHHHHH!!')
      }
    } else {
      setImageBase64(null)
    }
  }

  const updateAccount = e => {
    e.preventDefault()
    const account = {
      email: email,
      username: username,
      address: {
        province: {
          ProvinceID: province.ProvinceID,
          ProvinceName: province.ProvinceName
        },
        district: {
          DistrictID: district.DistrictID,
          DistrictName: district.DistrictName
        },
        ward: {
          WardCode: ward.WardCode,
          WardName: ward.WardName
        },
        street: street
      },
      phoneNumber: phoneNumber,
      birthDate: birthDate,
      avatarBase64: imageBase64
    }
    // console.log(account)
    updateAccountAdmin(currentUser, account, dispatch)
  }

  const logout_fnc = () => {
    dispatch(logout())
    dispatch(cleanBookBought())
  }

  const updatePassword = async() => {

    if (newPassword !== confirmPassword) {
      notification.open({
        message: 'Cảnh báo',
        description: 'Mật khẩu không trùng khớp vui lòng kiểm tra lại!',
        style: {
          width: 400,
          backgroundColor: '#f1c40f',
          color: '#535c68'
        }
      })
    } else {
      const account = {
        _id: currentUser._id,
        oldPassword: oldPassword,
        newPassword: newPassword
      }
      await updateAccountPassword(currentUser, account, dispatch)
      .then(res=>{
        if(res.message==='invalid_password'){
          notification.open({
            message: 'Cảnh báo',
            description: 'Mật khẩu bị sai, nhập lại mật khẩu hoặc reset mật khẩu!',
            style: {
              width: 400,
              backgroundColor: '#f1c40f',
              color: '#535c68'
            }
          })

        }else{
          notification.open({
            message: 'Chúc mừng',
            description: 'Bạn đã thay đổi mật khẩu thành công!',
            style: {
              width: 400,
              backgroundColor: '#2ecc71',
              color: '#535c68'
            }
          })

        }
      })
    }
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }
useEffect(() => {
  console.log("old password")
},[oldPassword])
  const updateProvince = value => {
    const _province = provinceData.find(
      province => province.ProvinceID == value
    )
    setProvince(_province)
    const fetchDistrict = async () => {
      const districts = await getDistrictData(_province.ProvinceID)
      setDistrictData(districts)
    }
    fetchDistrict()
  }

  const updateDistrict = value => {
    const _district = districtData.find(dis => dis.DistrictID == value)
    setDistrict(_district)
    const fetchWard = async () => {
      const wards = await getWardData(_district.DistrictID)
      setWardData(wards)
    }
    fetchWard()
  }
  const updateWard = value => {
    const _ward = wardData.find(war => war.WardCode == value)
    setWard(_ward)
  }

  return (
    <div className="flex flex-col justify-center items-center w-full relative space-y-10">
      <div className="flex flex-col justify-center items-center w-full relative space-y-4">
        <div className="w-full lg:w-2/3 xl:w-1/2 px-6 ">
          <h2 className="text-xl font-semibold text-left mb-0">
            Hồ sơ của tôi
          </h2>
          <h3 className="w-full text-md text-left font-normal text-gray-500">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </h3>
          <hr className="my-3" />
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-stretch space-y-8 lg:space-x-8  lg:space-y-0 w-full lg:w-2/3 xl:w-1/2 px-6">
          <div className="flex flex-col h-full justify-start items-center space-y-6  w-full  lg:w-1/3 order-1 lg:order-2">
            <Image
              width={150}
              height={150}
              style={{
                borderRadius: '50%',
                overflow: 'hidden',
                objectFit: 'cover'
              }}
              src={imageBase64 || currentUser?.avatar_url || IMAGE_URL}
            />
            <label
              htmlFor="avatar_id"
              className="px-4 py-2 border border-gray-300 cursor-pointer hover:bg-gray-50 text-base"
            >
              Chọn Ảnh{' '}
            </label>
            <input
              className="hidden"
              id="avatar_id"
              type="file"
              accept="image/png, image/gif, image/jpeg"
              onChange={changeImage}
            />
          </div>
          <div className="flex flex-col h-full text-sm space-y-6 md:space-y-6 w-full order-2 lg:order-1 ">
            <div className="flex flex-row items-center space-x-4">
              <div className="w-24 min-w-[6rem] text-right ">
                <label className="text-right whitespace-nowrap text-gray-600">
                  {' '}
                  Email
                </label>
              </div>
              <Input
                size="large"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-row items-center space-x-4">
              <div className="w-24 min-w-[6rem] text-right ">
                <label className="text-right whitespace-nowrap text-gray-600">
                  Tên đăng nhập
                </label>
              </div>
              <Input
                size="large"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-row items-center space-x-4">
              <div className="w-24 min-w-[6rem] text-right ">
                <label className="text-right whitespace-nowrap text-gray-600">
                  {' '}
                  Số điện thoại
                </label>
              </div>
              <Input
                size="large"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="flex flex-row items-center space-x-4">
              <div className="w-24 min-w-[6rem] text-right ">
                <label className="text-right whitespace-nowrap text-gray-600">
                  Ngày sinh
                </label>
              </div>
              <Input
                size="large"
                type="date"
                value={birthDate.split('T')[0]}
                onChange={e => setBirthDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col  space-y-3">
              <div className="flex flex-row items-center space-x-4">
                <div className="w-24 min-w-[6rem] text-right ">
                  <label className="text-right whitespace-nowrap text-gray-600">
                    Địa chỉ
                  </label>
                </div>
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 relative w-full">
                  <Select
                    size="large"
                    style={{ width: '33.33%', maxWidth: '33.33%' }}
                    name="provice"
                    id=""
                    onChange={updateProvince}
                    placeholder={province.ProvinceName || 'Chọn Tỉnh/Thành Phố'}
                  >
                    {provinceData.map(province => {
                      return (
                        <Select.Option
                          key={province.ProvinceID}
                          value={province.ProvinceID}
                        >
                          {province.ProvinceName}
                        </Select.Option>
                      )
                    })}
                  </Select>
                  <Select
                    size="large"
                    style={{ width: '33.33%', maxWidth: '33.33%' }}
                    name="district"
                    id=""
                    onChange={updateDistrict}
                    placeholder={district.DistrictName || 'Chọn Quận/Huyện'}
                  >
                    {districtData.map(district => {
                      return (
                        <Select.Option
                          key={district.DistrictID}
                          value={district.DistrictID}
                        >
                          {district.DistrictName}
                        </Select.Option>
                      )
                    })}
                  </Select>
                  <Select
                    size="large"
                    style={{ width: '33.33%', maxWidth: '33.33%' }}
                    name="ward"
                    id=""
                    onChange={updateWard}
                    placeholder={ward.WardName || 'Chọn Phường/Xã'}
                  >
                    {wardData.map(ward => {
                      return (
                        <Select.Option
                          key={ward.WardCode}
                          value={ward.WardCode}
                        >
                          {ward.WardName}
                        </Select.Option>
                      )
                    })}
                  </Select>
                </div>
              </div>

              <div className="flex flex-row items-start space-x-4">
                <div className="w-24 min-w-[6rem] text-right "></div>
                <Input
                  size="large"
                  name="street"
                  type="text"
                  placeholder="Địa chỉ cụ thể ( Ví dụ: 52, đường Trần Hưng Đạo )"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row space-x-6">
          <Button
            // className="w-[100px] h-[60px] bg-teal-500 text-white rounded-[5px]"
            onClick={updateAccount}
          >
            Lưu
          </Button>
          <Button
            // className="w-[100px] h-[60px] bg-teal-500 text-white rounded-[5px]"
            onClick={logout_fnc}
          >
            Đăng xuất
          </Button>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full relative space-y-4">
        <div className="w-full lg:w-2/3 xl:w-1/2 px-6">
          <h2 className="text-xl font-semibold text-left mb-0">
            Thay đổi mật khẩu
          </h2>
          <h3 className="w-full text-md text-left font-normal text-gray-500">
            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
          </h3>
          <hr className="my-3" />
        </div>

        <div className="w-full lg:w-2/3 xl:w-1/2 px-6 flex flex-col space-y-6">
          <Form
            form={form}
            name="updatePassword"
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            // onFinish={handler}
            autoComplete="off"
          >
            <div className="flex flex-row items-center space-x-4  w-full lg:w-2/3 ">
              <div className="w-40 min-w-[8rem] text-right">
                <label className="text-right whitespace-nowrap text-gray-600">
                  Mật Khẩu Hiện Tại
                </label>
              </div>
              <Form.Item
                name="old_password"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mật khẩu!'
                  },
                  {
                    type: 'string',
                    min: 6,
                    message: 'Mật khẩu phải ít nhất 6 kí tự'
                  },
        
                ]}
              >
                <Input.Password
                  size="large"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                />
              </Form.Item>
            </div>
            <div className="flex flex-row items-center space-x-4  w-full lg:w-2/3 ">
              <div className="w-40 min-w-[8rem] text-right">
                <label className="text-right whitespace-nowrap text-gray-600">
                  Mật Khẩu Mới
                </label>
              </div>
              <Form.Item
                name="new_password"
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
                <Input.Password
                  size="large"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </Form.Item>
            </div>
            <div className="flex flex-row items-center space-x-4  w-full lg:w-2/3 ">
              <div className="w-40 min-w-[8rem] text-right">
                <label className="text-right whitespace-nowrap text-gray-600">
                  Xác Nhận Mật Khẩu
                </label>
              </div>
              <Form.Item
                name="confirm_password"
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
                <Input.Password
                  size="large"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </Form.Item>
            </div>
          </Form>
        </div>

        <div className="flex flex-row space-x-6">
          <Button
            // className="w-[100px] h-[60px] bg-teal-500 text-white rounded-[5px]"
            onClick={updatePassword}
          >
            Lưu
          </Button>
          <Button
            // className="w-[100px] h-[60px] bg-teal-500 text-white rounded-[5px]"
            onClick={()=>navigate('/forgotPassword')}
          >
            Reset 
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SettingUser
