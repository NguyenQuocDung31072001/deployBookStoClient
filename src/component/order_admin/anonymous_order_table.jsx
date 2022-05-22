import { Anchor, Table, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { getAnonymousOrders, getOrders } from '../../redux/api_request'
import moment from 'moment'
import ActionContainer from './action_container'
import AnonymousActionContainer from './anonymous_action_container'

function AnonymousOrderTable(props) {
  const { filter, onLoading, onLoaded } = props
  const { Link } = Anchor

  const [filteredInfo, setFilteredInfo] = useState(filter)

  const [sortedInfo, setSortedInfo] = useState({})

  const [page, setPage] = useState(1)

  const [data, setData] = useState([])

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter)
  }

  useEffect(() => {
    const getOrderData = async () => {
      const filterQuery = {}
      if (filter.paid != undefined && filter.paid != 2) {
        if (filter.paid == 1) filterQuery.paid = true
        else filterQuery.paid = false
      }

      if (filter.customer != undefined && filter.customer != '')
        filterQuery.customer = filter.customer

      if (filter.payment != undefined && filter.payment != 2)
        filterQuery.payment = filter.payment

      if (filter.time != undefined && filter.time[0]) {
        filterQuery.from = filter.time[0].format('YYYY-MM-DD')
        filterQuery.to = filter.time[1].format('YYYY-MM-DD')
      }
      // console.log(filterQuery)
      const orders = await getAnonymousOrders(page, sortedInfo, filterQuery)
      onLoaded()
      setData(orders)
    }
    getOrderData()
  }, [page, filteredInfo, sortedInfo, filter])

  function handleUpdateOrder(updatedOrder) {
    console.log(updatedOrder)
    const index = data.findIndex(item => item._id == updatedOrder._id)
    let newData = [...data]
    newData.splice(index, 1, updatedOrder)
    setData(newData)
    onLoaded()
  }

  const columns = [
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => {
        // return moment(a.createdAt) > moment(b.createdAt) ? 1 : -1
      },
      sortOrder: sortedInfo.columnKey === 'createdAt' && sortedInfo.order,
      render: createdAt => <> {moment(createdAt).format('DD-MM-YYYY')}</>,
      ellipsis: true
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      sorter: (a, b) => {
        return a.customer > b.customer ? 1 : -1
      },
      sortOrder: sortedInfo.columnKey === 'customer' && sortedInfo.order,
      ellipsis: true
    },
    {
      title: 'Sách',
      dataIndex: 'books',
      key: 'books',
      render: books => (
        <div className="flex flex-col max-h-40  hover:overflow-auto overflow-hidden">
          {books.map(item => (
            <a
              href="/"
              title={`${item.book.name} - sl: ${item.amount}`}
            >{`${item.book.name} - sl: ${item.amount}`}</a>
          ))}
        </div>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => {},
      sortOrder: sortedInfo.columnKey === 'total' && sortedInfo.order,
      ellipsis: true
    },
    {
      title: 'Xác thực',
      dataIndex: 'isVerified',
      key: 'isVerified',
      sorter: (a, b) => {
        if (a.isVerified) return 1
      },
      sortOrder: sortedInfo.columnKey === 'isVerified' && sortedInfo.order,
      render: isVerified => {
        if (isVerified)
          return (
            <Tag color={'green'} key={isVerified}>
              Đã xác thực
            </Tag>
          )
        else
          return (
            <Tag color={'red'} key={isVerified}>
              Chưa xác thực
            </Tag>
          )
      }
    },
    {
      title: 'Tình trạng',
      dataIndex: '',
      key: 'confirmed',
      sorter: (a, b) => {
        if (a.confirmed) return 1
      },
      sortOrder: sortedInfo.columnKey === 'confirmed' && sortedInfo.order,
      render: order => {
        if (order.isVerified && order.confirmed)
          return (
            <Tag color={'green'} key={order._id}>
              Đã xác nhận
            </Tag>
          )
        else if (order.isVerified && !order.confirmed)
          return (
            <Tag color={'red'} key={order._id}>
              Đã hủy
            </Tag>
          )
        else
          return (
            <Tag color={'blue'} key={order._id}>
              Chờ xác thực
            </Tag>
          )
      }
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
      key: 'payment',
      sorter: (a, b) => {
        return a.payment - b.payment
      },
      sortOrder: sortedInfo.columnKey === 'payment' && sortedInfo.order,
      ellipsis: true
    },
    {
      title: 'Thay đổi',
      key: 'action',
      render: (text, record) => (
        <AnonymousActionContainer
          data={record}
          onUpdate={handleUpdateOrder}
          onLoading={onLoading}
        />
      )
    }
  ]

  return (
    <Table
      className="admin_order_table"
      columns={columns}
      dataSource={data}
      onChange={handleChange}
      sticky
    />
  )
}

export default AnonymousOrderTable
