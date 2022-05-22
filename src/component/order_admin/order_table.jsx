import { Anchor, Table, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { getOrders } from '../../redux/api_request'
import moment from 'moment'
import ActionContainer from './action_container'

function OrderTable(props) {
  const { status, filter, onLoading, onLoaded } = props
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
      if (filter.status != undefined && filter.status != 5)
        filterQuery.status = filter.status

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
      const orders = await getOrders(page, sortedInfo, filterQuery)
      onLoaded()
      setData(orders)
    }
    getOrderData()
  }, [page, filteredInfo, sortedInfo, filter])

  function handleUpdateOrder(updatedOrder) {
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
      title: 'Tình trạng',
      dataIndex: 'statusName',
      key: 'statusName',
      sorter: (a, b) => {
        return a.status - b.status
      },
      sortOrder: sortedInfo.columnKey === 'statusName' && sortedInfo.order,
      render: status => {
        let color = ''
        switch (status) {
          case 'Không thành công':
          case 'Hủy':
          case 'Từ chối': {
            color = 'red'
            break
          }
          case 'Chờ xác nhận': {
            color = 'gray'
            break
          }
          case 'Đã xác nhận': {
            color = 'lime'
            break
          }
          case 'Đã vận chuyển': {
            color = 'blue'
            break
          }
          case 'Giao hàng thành công':
          case 'Đã nhận hàng': {
            color = 'green'
            break
          }
        }
        return (
          <Tag color={color} key={status}>
            {status}
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
        <ActionContainer
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

export default OrderTable
