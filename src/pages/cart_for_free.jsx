import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Input, Spin } from 'antd'
import { DeleteOutlined, DeleteTwoTone, DeleteFilled } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'

import BreadcrumbsUser from '../component/breadcrumbs_user'
import { PATH_NAME } from '../config/pathName'
import ShipModal from '../component/checkout/ship_modal'
import { numberFormat } from '../utils/formatNumber'
import Footer from '../component/footer'

export default function CartForFree() {
  const [flat, setFlat] = useState(0)
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
              onClick={() => decreaseCartFnc(record.key)}
              disabled={!count.status}
            >
              -
            </button>
            <div className="text-center border-y-[1px] border-gray-300 h-[20px] w-[30px]">
              <p>{count.value}</p>
            </div>
            <button
              className="w-[20px] h-[20px] text-center border-[1px] border-gray-300 hover:border-sky-500"
              onClick={() => increaseCartFnc(record.key)}
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
          onClick={() => deleteCartFnc(record.key)}
          className="text-[20px] cursor-pointer"
        />
      )
    }
  ]
  useEffect(() => {
    if (currentUser) {
      navigate('/user/cart')
    }
    window.scrollTo(0, 0)
    const breadcrumb = {
      genre_slug: 'cart_for_free',
      genre_name: 'Giỏ hàng',
      name_book: ''
    }
    dispatch(updateBreadcrumb(breadcrumb))
    // console.log(JSON.parse(localStorage.getItem('dataCart')))
    setData(JSON.parse(localStorage.getItem('dataCart')))
  }, [])

  useEffect(() => {
    setData(JSON.parse(localStorage.getItem('dataCart')))
  }, [flat])

  const increaseCartFnc = recordKey => {
    let dataOfLocalStorage = JSON.parse(localStorage.getItem('dataCart'))
    let dataRowItem = dataOfLocalStorage.find(item => item.key === recordKey)
    dataRowItem.count.value += 1
    dataRowItem.count.status = true
    if (rowChecked.includes(dataRowItem.key)) {
      setTotalFinal(value => (value = value + dataRowItem.price))
    }
    dataRowItem.total = dataRowItem.count.value * dataRowItem.price
    dataOfLocalStorage[dataRowItem.key] = dataRowItem
    localStorage.setItem('dataCart', JSON.stringify(dataOfLocalStorage))
    setFlat(flat => (flat += 1))
  }
  const decreaseCartFnc = recordKey => {
    let dataOfLocalStorage = JSON.parse(localStorage.getItem('dataCart'))
    let dataRowItem = dataOfLocalStorage.find(item => item.key === recordKey)
    if (dataRowItem.count.value > 1) {
      dataRowItem.count.value -= 1
      if (rowChecked.includes(dataRowItem.key)) {
        setTotalFinal(value => (value = value - dataRowItem.price))
      }
      if (dataRowItem.count.value === 1) {
        dataRowItem.count.status = false
      } else {
        dataRowItem.count.status = true
      }
      dataRowItem.total = dataRowItem.count.value * dataRowItem.price
      dataOfLocalStorage[dataRowItem.key] = dataRowItem
      localStorage.setItem('dataCart', JSON.stringify(dataOfLocalStorage))
      setFlat(flat => (flat += 1))
    }
  }
  const deleteCartFnc = recordKey => {
    let dataOfLocalStorage = JSON.parse(localStorage.getItem('dataCart'))
    let dataRowItem = dataOfLocalStorage.find(item => item.key === recordKey)
    if (rowChecked.includes(dataRowItem.key)) {
      setTotalFinal(value => (value = value - dataRowItem.total))
    }
    dataOfLocalStorage.splice(dataRowItem.key, 1)
    dataOfLocalStorage.forEach((item, index) => {
      item.key = index
    })
    localStorage.setItem('dataCart', JSON.stringify(dataOfLocalStorage))
    setFlat(flat => (flat += 1))
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(selectedRowKeys,selectedRows)
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
    console.log(selectedRows)
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
                        <span className="text-[15px] font-medium">
                          Thay đổi
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
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
                <Button className="" style={{ width: 170 }} onClick={checkout}>
                  Mua hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
        {!currentUser && (
          <div className="mt-[170px]">
            <Footer />
          </div>
        )}
        {currentUser && (
          <div className="mt-[50px]">
            <Footer />
          </div>
        )}
      </div>
    </>
  )
}
