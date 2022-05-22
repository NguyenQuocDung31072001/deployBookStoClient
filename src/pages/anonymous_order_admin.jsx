import {
  Spin,
  Tabs,
  DatePicker,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Row,
  Col
} from 'antd'
import { Option } from 'antd/lib/mentions'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import AnonymousOrderTable from '../component/order_admin/anonymous_order_table'
import OrderTable from '../component/order_admin/order_table'

function AnonymousOrdersManage() {
  const { RangePicker } = DatePicker
  const { Title } = Typography
  const { TabPane } = Tabs
  const [status, setStatus] = useState(1)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState({
    status: 5,
    payment: 2,
    time: undefined,
    customer: undefined,
    paid: 2
  })

  function handleChangeStatus(key) {
    setLoading(true)
    setStatus(key)
  }

  useEffect(() => {
    setLoading(true)
  }, [])

  function handleLoading() {
    setLoading(true)
  }

  function handleLoaded() {
    setLoading(false)
  }

  function changeFilter(value) {
    const newFilter = { ...filter, ...value }
    // if (value.time) newFilter.time = value.time
    console.log(newFilter)
    setFilter(newFilter)
  }

  return (
    <div className="py-4 px-4 flex flex-col justify-start items-center  space-y-4">
      {/* {loading && (
        <div className="z-[2000] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full  bg-gray-400 bg-opacity-30 flex justify-center items-center">
          <Spin spinning={loading} size="large" tip="Loading..."></Spin>
        </div>
      )} */}
      <Title level={2} style={{ margin: 0 }}>
        Danh sách đơn đặt hàng
      </Title>
      <div className="flex flex-row justify-center items-center ">
        <Form
          layout="inline"
          initialValues={{
            status: filter.status,
            payment: filter.payment,
            time: filter.time,
            paid: filter.paid
          }}
          onValuesChange={changeFilter}
        >
          <Form.Item name="customer" label="Khách hàng">
            <Input></Input>
          </Form.Item>

          <Form.Item name="time" label="Thời gian">
            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item name="paid" label="Trạng thái thanh toán">
            <Select style={{ minWidth: 150 }}>
              <Option value={2}>Tất cả</Option>
              <Option value={1}>Đã thanh toán</Option>
              <Option value={0}>Chưa thanh toán</Option>
            </Select>
          </Form.Item>

          <Form.Item name="payment" label="Phương thức thanh toán">
            <Select style={{ minWidth: 85 }}>
              <Option value={2}>Tất cả</Option>
              <Option value={0}>COD</Option>
              <Option value={1}>Paypal</Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
      <AnonymousOrderTable
        filter={filter}
        status={0}
        onLoading={handleLoading}
        onLoaded={handleLoaded}
      />
    </div>
  )
}
export default AnonymousOrdersManage
