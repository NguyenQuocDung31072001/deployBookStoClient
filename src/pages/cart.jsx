import React, { useState, useEffect } from 'react'
import { Table, Button, Input, Spin } from 'antd'
import { DeleteOutlined, DeleteTwoTone, DeleteFilled } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import {
  getCart,
  deleteCart,
  increaseCart,
  decreaseCart,
  getShippingInfo
} from '../redux/api_request'
import BreadcrumbsUser from '../component/breadcrumbs_user'
import { PATH_NAME } from '../config/pathName'
import ShipModal from '../component/checkout/ship_modal'
import { numberFormat } from '../utils/formatNumber'
import Footer from '../component/footer'

export default function Cart() {
  const [loading, setLoading] = useState(false)
  const [firstLoading, setFirstLoading] = useState(true)
  const [totalFinal, setTotalFinal] = useState(0)
  const [rowChecked, setRowChecked] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [shipData, setShipData] = useState({})
  const [openShipModal, setOpenShipModal] = useState(false)
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const columns = [
    {
      title: 'Tất cả sản phẩm',
      dataIndex: 'product',
      render: product => (
        <div className="flex items-center">
          <Link to={`/user/home/${product.genres}/${product.slug}`}>
            <img className="w-[50px] h-[50px]" src={product.image} alt="" />
            <span className="ml-[20px]">{product.name}</span>
          </Link>
        </div>
      )
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      render: price => <p>{numberFormat(price)}</p>
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      render: (count, record) => {
        return (
          <div className="flex ">
            <button
              className="w-[20px] h-[20px] text-center border-[1px] border-gray-300 hover:border-sky-500"
              onClick={() => decreaseFnc(record.key)}
              disabled={count.status}
            >
              -
            </button>
            <div className="text-center border-y-[1px] border-gray-300 h-[20px] w-[30px]">
              {/* <Input value={count.value}  style={{width:20,height:20}}/> */}
              <p>{count.value}</p>
            </div>
            <button
              className="w-[20px] h-[20px] text-center border-[1px] border-gray-300 hover:border-sky-500"
              onClick={() => increaseFnc(record.key)}
            >
              +
            </button>
          </div>
        )
      }
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      render: total => <p>{numberFormat(total)}</p>
    },
    {
      title: <DeleteFilled />,
      render: record => (
        <DeleteOutlined
          onClick={() => deleteProduct(record.key)}
          className="text-[20px] cursor-pointer"
        />
      )
    }
  ]
  useEffect(() => {
    if(!currentUser){
      navigate('/user/cart_for_free')
    }
    window.scrollTo(0, 0)
    setLoading(true)
    const breadcrumb = {
      genre_slug: 'cart',
      genre_name: 'Giỏ hàng',
      name_book: ''
    }
    dispatch(updateBreadcrumb(breadcrumb))
    ;(async function () {
      if(currentUser){
        const _cart = getCart(currentUser._id)
        const _info = getShippingInfo(currentUser._id)
        Promise.all([_cart, _info]).then(([cart, info]) => {
          let cartDataRender = []
          if (cart) {
            for (let i = 0; i < cart.length; i++) {
              let dataCart = {
                key: i + 1,
                product: {
                  image: cart[i].book.coverUrl,
                  name: cart[i].book.name,
                  genres: cart[i].book.genres,
                  slug: cart[i].book.slug,
                  _id: cart[i].book._id
                },
                price: cart[i].book.price,
                count: {
                  value: cart[i].amount,
                  status: cart[i].amount > 1 ? false : true
                },
                total: cart[i].book.price * cart[i].amount,
                id: cart[i].book._id
              }
              console.log(dataCart)
              cartDataRender.push(dataCart)
            }
          }
          setShipData(info)
          setData(cartDataRender)
          setFirstLoading(false)
          setLoading(false)
        })
      }
    })()
    return () => {
      // setShipData()
      setFirstLoading(false)
      setLoading(false)
    }
  }, [])

  const increaseFnc = key => {
    setLoading(true)
    let indexKeyOfArray
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        indexKeyOfArray = i
        break
      }
    }
    const dataToIncreaseCart = {
      account: currentUser._id,
      book: data[indexKeyOfArray].id
    }
    const increaseCartfnc = async () => {
      await increaseCart(dataToIncreaseCart)
      setLoading(false)
    }
    increaseCartfnc()
    let newData = [...data]
    let item = { ...newData[indexKeyOfArray] }
    item.count.value += 1
    item.count.status = false
    item.total = item.price * item.count.value
    newData[indexKeyOfArray] = item
    setData(newData)
    if (rowChecked.includes(key)) {
      setTotalFinal(prev => prev + item.price)
    }
  }
  const decreaseFnc = key => {
    setLoading(true)
    let indexKeyOfArray
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        indexKeyOfArray = i
        break
      }
    }
    const decreaseCartFnc = async () => {
      await decreaseCart(currentUser._id, data[indexKeyOfArray].id)
      setLoading(false)
    }
    decreaseCartFnc()
    let newData = [...data]
    let item = { ...newData[indexKeyOfArray] }
    item.count.value -= 1
    if (item.count.value === 1) {
      item.count.status = true
    }
    item.total = item.price * item.count.value
    newData[indexKeyOfArray] = item
    setData(newData)
    if (rowChecked.includes(key)) {
      setTotalFinal(prev => prev - item.price)
    }
  }
  const deleteProduct = key => {
    setLoading(true)
    let indexKeyOfArray
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        indexKeyOfArray = i
        break
      }
    }
    setTotalFinal(prev => prev - data[indexKeyOfArray].total)
    const deleteCartFnc = async (id_account, id_book) => {
      await deleteCart(id_account, id_book)
      setLoading(false)
    }
    deleteCartFnc(currentUser._id, data[indexKeyOfArray].id)
    const newData = data.filter(data => data.key !== key)
    setData(newData)
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowChecked(selectedRowKeys)
      setSelectedRows(selectedRows)
      let tong_cong = 0
      for (let i = 0; i < selectedRows.length; i++) {
        tong_cong += selectedRows[i]?.total
      }
      setTotalFinal(tong_cong)
    }
  }
  const closeShipModal = () => {
    setOpenShipModal(false)
  }
  const saveShipInfo = data => {
    setShipData({ ...data, username: data.customer })
    setOpenShipModal(false)
  }
  const checkout = () => {
    navigate('/user/checkout', {
      state: {
        shipData: shipData,
        product: selectedRows
      }
    })
  }
  return (
    <>
      {shipData.address && (
        <ShipModal
          visible={openShipModal}
          shipData={shipData}
          onCancel={closeShipModal}
          onSave={saveShipInfo}
        />
      )}
      <div className="flex flex-col justify-center ">
        <div className="flex justify-center mx-[20px]">
          {firstLoading && currentUser && (
            <div className="fixed w-full h-full z-10">
              <Spin tip="Loading..." />
            </div>
          )}
          {loading && currentUser && (
            <div className="fixed w-full h-full z-10">
              <Spin tip="Loading..." />
            </div>
          )}
          <div>
            <Table
              className="w-[750px]"
              rowSelection={{
                type: 'checkbox',
                ...rowSelection
              }}
              columns={columns}
              dataSource={data}
            />
          </div>
          <div className="w-[350px] ml-[20px] h-fit pb-8 bg-white ">
            <div className="flex flex-col p-4">
              <div className="">
                <div className="flex relative pb-4">
                  <span className="text-[15px] font-medium">Giao tới</span>
                  {currentUser && (
                    <div className="absolute top-1 right-4">
                      <Link
                        to={`${PATH_NAME.USER_CART}`}
                        onClick={() => {
                          setOpenShipModal(true)
                        }}
                      >
                        <span className="text-[15px] font-medium">Thay đổi</span>
                      </Link>
                    </div>
                  )}
                </div>
                {currentUser && (
                  <>
                  <div className="flex ">
                    <p className="text-[15px] font-medium">{shipData.username}</p>
                    <p className="text-[15px] font-medium ml-16">
                      {shipData.phoneNumber}
                    </p>
                  </div>
                  <div className="flex flex-col items-start mb-[20px] text-gray-500">
                    <p>{shipData.address?.street}</p>
                    <div className="flex ">
                      <p>{shipData.address?.ward.WardName}, </p>
                      <p>{shipData.address?.district.DistrictName}, </p>
                      <p>{shipData.address?.province.ProvinceName}</p>
                    </div>
                  </div>
                  </>
                )}
              </div>
              <div className="flex justify-between pr-4">
                <div>
                  <h1> Tạm tính</h1>
                </div>
                <div>
                  <h1>{numberFormat(totalFinal)}</h1>
                </div>
              </div>
              <div className="flex justify-between pr-4">
                <div>
                  <h1>Tổng cộng</h1>
                </div>
                <div>
                  <h1>{numberFormat(totalFinal)}</h1>
                </div>
              </div>
              <div className="flex justify-center w-full ">
                <Button
                  className=""
                  style={{ width: 170 }}
                  onClick={checkout}
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
        {!currentUser &&(
        <div className="mt-[170px]">
          <Footer />
        </div>
        )}
        {currentUser &&(
        <div className="mt-[50px]">
          <Footer />
        </div>
        )}
      </div>
    </>
  )
}
