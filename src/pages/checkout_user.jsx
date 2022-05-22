import { Button, Row, Col, Table, notification, Input } from 'antd'
import Text from 'antd/lib/typography/Text'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  createNewOrder,
  getShippingCost,
  getVoucher
} from '../redux/api_request'
import ShipModal from '../component/checkout/ship_modal'
import { useSelector } from 'react-redux'

export default function Checkout(props) {
  const { state } = useLocation()
  const [shipData, setShipData] = useState(state.shipData)
  const [shippingCost, setShippingCost] = useState(0)
  const [voucher, setVoucher] = useState({
    success: false,
    error: true,
    code: null,
    discount: null
  })
  const [voucherCode, setVoucherCode] = useState()
  const [payment, setPayment] = useState('cod')
  const [openShipModal, setOpenShipModal] = useState(false)
  const currentUser = useSelector(state => state.auth.login.currentUser)

  const calSubTotal = () => {
    // console.log(state)
    let total = 0
    state.product.forEach(item => {
      total += item.price * item.count.value
    })
    return total
  }

  const calTotal = () => {
    let total = calSubTotal() + shippingCost.total
    console.log(voucher)
    if (voucher.success) {
      total -= voucher.discount
    }
    return total
  }

  const applyVoucher = async () => {
    const voucher = await getVoucher(calSubTotal(), voucherCode)
    setVoucher(voucher)
  }

  useEffect(() => {
    const getShippingCostFnc = async () => {
      const address = {
        ProvinceID: shipData.address.province.ProvinceID,
        DistrictID: shipData.address.district.DistrictID,
        WardCode: shipData.address.ward.WardCode.toString()
      }
      const books = state.product.map(item => {
        return {
          book: item.product._id,
          amount: item.count.value
        }
      })

      // const user = currentUser._id
      const shippingCost = await getShippingCost(address, books)
      setShippingCost(shippingCost)
    }
    if (shipData && shipData.address?.province?.ProvinceID) getShippingCostFnc()
  }, [shipData])

  const closeShipModal = () => {
    setOpenShipModal(false)
  }

  const saveShipInfo = data => {
    console.log('data', data)
    setShipData({ ...data, username: data.customer })
    setOpenShipModal(false)
  }

  const openNotification = message => {
    notification.error({
      message: `Không thành công`,
      description: message,
      placement: 'topRight'
    })
  }

  const checkData = () => {
    if (!shipData) {
      openNotification('Vui lòng nhập đầy đủ thông tin nhận hàng')
      return false
    }

    const shipAddress = shipData.address
    const phoneNumber = shipData.phoneNumber
    const books = state.product.map(item => item.product._id)
    if (
      !shipData ||
      !shipAddress.province.ProvinceID ||
      !shipAddress.district.DistrictID ||
      !shipAddress.ward.WardCode ||
      !shipAddress.street ||
      !shipData.username ||
      !phoneNumber
    ) {
      openNotification('Vui lòng nhập đầy đủ thông tin nhận hàng')
      return false
    }

    if (books.length === 0) {
      openNotification('Đơn hàng phải gồm ít nhất một sản phẩm!')
      return false
    }

    return true
  }

  const createNewOrderFnc = async () => {
    if (!checkData()) return
    const address = {
      ProvinceID: shipData.address.province.ProvinceID,
      DistrictID: shipData.address.district.DistrictID,
      WardCode: shipData.address.ward.WardCode?.toString(),
      street: shipData.address.street
    }
    const phoneNumber = shipData.phoneNumber
    const email = shipData.email
    const customer = shipData.username
    const books = state.product.map(item => {
      return {
        book: item.product._id,
        amount: item.count.value
      }
    })
    const user = currentUser ? currentUser._id : null
    const data = { user, customer, phoneNumber, email, address, books, payment }
    if (currentUser) data.account = currentUser._id
    if (voucher.success) data.voucherCode = voucher.code
    const result = await createNewOrder(data)
    if (result.error) {
      switch (result.status) {
        case 1: {
          openNotification('Tài khoản không hợp lệ')
          break
        }
        case 2: {
          openNotification('Phương thức thanh toán không hợp lệ')
          break
        }
        case 4: {
          openNotification('Số lượng sách còn lại không đủ')
          break
        }
        case 5: {
          openNotification('Địa chỉ đặt hàng không phù hợp')
          break
        }
        default: {
          openNotification(
            'Đã xảy ra lỗi trong quá trình tạo đơn hàng, vui lòng kiểm tra và thử lại'
          )
          break
        }
      }
    } else {
      if (result.redirect) {
        window.location.replace(result.redirectTo)
      }
    }
  }

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      render: product => (
        <div className="flex items-center">
          <img className="h-[60px]" src={product.image} alt="" />
          <span className="ml-[20px]">{product.name}</span>
        </div>
      )
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      align: 'right',
      render: price => (
        <p>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(price)}
        </p>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      align: 'right',
      render: (count, record) => {
        return <p>{count.value}</p>
      }
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      align: 'right',
      render: total => (
        <p>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(total)}
        </p>
      )
    }
  ]

  return (
    <>
      {openShipModal && (
        <ShipModal
          visible={openShipModal}
          shipData={shipData}
          onCancel={closeShipModal}
          onSave={saveShipInfo}
        />
      )}
      <div className="flex flex-col items-center space-y-4 ">
        <div className="container flex flex-col space-y-4 max-w-screen-xl py-6">
          <div className="text-left bg-white pt-6 pb-6 px-8">
            <Text strong className="text-lg">
              Địa Chỉ Nhận Hàng
            </Text>
            <div className="flex flex-row items-center space-x-6">
              {shipData && shipData.username && (
                <Text className="text-base font-medium capitalize">{`${shipData.username} - ${shipData.phoneNumber}`}</Text>
              )}

              {shipData && shipData.address && (
                <Text className="text-base capitalize">{`${shipData.address?.street}, ${shipData.address?.ward.WardName}, ${shipData.address?.district.DistrictName}, ${shipData.address?.province.ProvinceName}`}</Text>
              )}
              {(!shipData || !shipData.address) && (
                <span className="text-base font-medium text-orange-600">
                  Vui lòng điền đầy đủ thông tin liên hệ trước khi tiến hành đặt
                  hàng!
                </span>
              )}
              <Button
                onClick={() => {
                  setOpenShipModal(true)
                }}
              >
                THAY ĐỔI
              </Button>
            </div>
          </div>

          <div className="w-full py-4 px-2 md:px-4 lg:px-8 bg-white">
            <Table
              className="w-full"
              columns={columns}
              pagination={false}
              dataSource={state.product}
            />
          </div>

          <div className="w-full py-3 px-8 bg-white flex flex-row ">
            <div className="w-full text-left flex flex-row justify-between items-center space-x-6">
              <Text strong className="text-lg whitespace-nowrap">
                Mã giảm giá:
              </Text>
              <Input
                size="large"
                placeholder="Mã giảm giá"
                className="w-full"
                onChange={e => {
                  setVoucherCode(e.target.value)
                }}
              />
              <Button
                size="large"
                type="primary"
                onClick={() => {
                  applyVoucher(true)
                }}
              >
                Áp dụng
              </Button>
            </div>
          </div>

          <div className="w-full py-3 px-8 bg-white flex flex-row justify-end">
            <div className="w-full flex flex-col sm:flex-row justify-between items-center pt-4">
              <div className="order-2 sm:order-1 w-full my-4 md:my-0 md:w-max flex flex-col md:flex-row md:flex-nowrap space-y-4 md:space-y-0 md:space-x-4  px-4  ">
                <div
                  className={`px-2 py-2 font-medium border cursor-pointer ${
                    payment === 'cod' ? 'text-orange-600 border-orange-600' : ''
                  }`}
                  onClick={() => {
                    setPayment('cod')
                  }}
                >
                  Thanh toán khi nhận hàng
                </div>
                <div
                  className={` px-2  py-2 font-medium border cursor-pointer ${
                    payment === 'paypal'
                      ? 'text-orange-600 border-orange-600'
                      : ''
                  }`}
                  onClick={() => {
                    setPayment('paypal')
                  }}
                >
                  Thanh toán thông qua Paypal
                </div>
              </div>
              <div className="w-full md:w-max order-1 sm:order-2">
                <div className="w-full flex flex-row justify-end items-center pt-2">
                  <div> Tạm tính:</div>
                  <div className="w-36 text-base text-right px-4">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(calSubTotal())}
                  </div>
                </div>
                <div className="w-full flex flex-row justify-end items-center py-4">
                  <div> Phí vận chuyển:</div>
                  <div className="w-36 text-base text-right px-4">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(shippingCost.total || 0)}
                  </div>
                </div>
                {voucher.success && (
                  <div className="w-full flex flex-row justify-end items-center pb-4">
                    <div> Giảm giá:</div>
                    <div className="w-36 text-base text-right px-4">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(voucher.discount)}
                    </div>
                  </div>
                )}

                <div className="w-full flex flex-row justify-end items-center">
                  <div> Tổng số tiền:</div>
                  <div className="w-36 text-right px-4 text-xl font-medium text-orange-600">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(calTotal() || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full py-3 px-8 bg-white flex flex-row justify-end">
            <Button
              type="primary"
              size="large"
              danger
              onClick={createNewOrderFnc}
            >
              Đặt Hàng
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
