import { Anchor, Table } from 'antd'

function BooksTable(props) {
  const { data } = props
  const { Link } = Anchor
  const dataRender = data.map((item, index) => {
    item.index = index + 1
    return item
  })
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '4rem',
      ellipsis: true
    },
    {
      title: 'Tên sách',
      dataIndex: ['book', 'name'],
      key: 'book',
      ellipsis: true
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
      ellipsis: true
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      ellipsis: true,
      render: item =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(item)
    },
    {
      title: 'Thành tiền',
      dataIndex: '',
      key: 'price',
      ellipsis: true,
      align: 'right',
      render: item =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(item.amount * item.price)
    }
  ]

  return <Table columns={columns} dataSource={data} pagination={false} />
}

export default BooksTable
