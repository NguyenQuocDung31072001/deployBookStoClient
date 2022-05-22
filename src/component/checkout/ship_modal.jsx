import React, { useEffect, useState } from 'react'
import { Modal, Button, Input, Select, Form } from 'antd'
import { useSelector } from 'react-redux'
import {
  getDistrictData,
  getProvinceData,
  getWardData
} from '../../redux/api_request'

function ShipModal(props) {
  const { visible, shipData, onSave, onCancel } = props
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const [customer, setCustomer] = useState(
    (shipData && shipData.username) || ''
  )
  const [phoneNumber, setPhoneNumber] = useState(
    (shipData && shipData.phoneNumber) || ''
  )

  const [email, setEmail] = useState((shipData && shipData.email) || '')
  const [province, setProvince] = useState(
    (shipData && shipData.address?.province) || {}
  )
  const [district, setDistrict] = useState(
    (shipData && shipData.address?.district) || {}
  )
  const [ward, setWard] = useState((shipData && shipData.address?.ward) || {})
  const [street, setStreet] = useState(
    (shipData && shipData.address?.street) || ''
  )

  const [provinceData, setProvinceData] = useState([])
  const [districtData, setDistrictData] = useState([])
  const [wardData, setWardData] = useState([])

  useEffect(() => {
    const getData = async () => {
      const provinceData = await getProvinceData()
      setProvinceData(provinceData)
      if (province.ProvinceID) {
        const [districts, wards] = await Promise.all([
          getDistrictData(province.ProvinceID),
          getWardData(district.DistrictID)
        ])
        setDistrictData(districts)
        setWardData(wards)
      }
    }
    getData()
  }, [])

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
    const _ward = wardData.find(war => war.WardCode === value)
    setWard(_ward)
  }

  const saveShipInfo = value => {
    console.log(value)
    const data = {
      customer: value.customer,
      phoneNumber: value.phoneNumber,
      email: value.email,
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
        street: value.street
      }
    }
    // console.log(data)
    onSave(data)
  }

  return (
    <>
      <Modal
        title="Thay đổi địa chỉ giao hàng"
        visible={visible}
        footer={null}
        // onOk={saveShipInfo}
        onCancel={onCancel}
      >
        <Form
          name=""
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{
            customer: customer,
            phoneNumber: phoneNumber,
            province: province.ProvinceID,
            district: district.DistrictID,
            ward: ward.WardCode?.toString(),
            email: email,
            street: street
          }}
          onFinish={saveShipInfo}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Nguời nhận"
            name="customer"
            rules={[
              { required: true, message: 'Vui lòng nhập tên người nhận!' }
            ]}
          >
            <Input
              size="large"
              // value={customer}
              // onChange={e => setCustomer(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Địa chỉ Email"
            name="email"
            rules={[
              {
                type: 'email',
                required: currentUser ? false : true,
                message: 'Vui lòng nhập Email!'
              }
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label=" Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' }
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Tỉnh/Thành Phố"
            name="province"
            rules={[
              { required: true, message: 'Vui lòng nhập Tỉnh/Thành phố!' }
            ]}
          >
            <Select
              size="large"
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
          </Form.Item>

          <Form.Item
            label="Quận/Huyện"
            name="district"
            rules={[{ required: true, message: 'Vui lòng nhập Quận/Huyện!' }]}
          >
            <Select
              size="large"
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
          </Form.Item>

          <Form.Item
            label="Xã/Phường"
            name="ward"
            rules={[
              { required: true, message: 'Vui lòng nhập tên Xã/Phường!' }
            ]}
          >
            <Select
              size="large"
              name="ward"
              id=""
              onChange={updateWard}
              placeholder={ward.WardName || 'Chọn Phường/Xã'}
            >
              {wardData.map(ward => {
                return (
                  <Select.Option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="street"
            rules={[{ required: true, message: 'Vui lòng nhập tên địa chỉ!' }]}
          >
            <Input
              size="large"
              value={street}
              onChange={e => setStreet(e.target.value)}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
            <div className="flex flex-row justify-center space-x-4">
              <Button type="primary" htmlType="submit">
                Xong
              </Button>
              <Button type="" htmlType="button" onClick={onCancel}>
                Hủy
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ShipModal
