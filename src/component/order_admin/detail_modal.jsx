import { Button, Col, Modal, Row } from 'antd'
import Text from 'antd/lib/typography/Text'
import { useState } from 'react'
import BooksTable from './books_table'

export default function DetailModal(props) {
  const {
    data,
    onClose,
    onConfirm,
    onRefuse,
    visible,
    action,
    step,
    isAnonymous = false
  } = props
  // const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  function handleOk() {
    setConfirmLoading(true)
    setTimeout(() => {
      setConfirmLoading(false)
    }, 2000)
  }

  function refuseTitle() {
    if (action === 'show') {
      if (isAnonymous) return 'Từ chối'
      if (step === 0) return 'Từ chối'
      else if (step === 1) return 'Không thể vận chuyển'
      else if (step === 2) return 'Giao hàng không thành công'
    } else if (action === 'confirm' || action === 'refuse') {
      return 'Hủy'
    }
  }

  function confirmTitle() {
    if (action === 'confirm' || action === 'show') {
      if (isAnonymous) return 'Xác nhận'
      if (step === 0) return 'Chấp nhận'
      else if (step === 1) return 'Tiến hành vận chuyển'
      else if (step === 2) return 'Giao hàng thành công'
    } else if (action === 'refuse') {
      if (isAnonymous) return 'Từ chối'
      if (step === 0) return 'Từ chối'
      else if (step === 1) return 'Không thể vận chuyển'
      else if (step === 2) return 'Giao hàng không thành công'
    }
  }

  return (
    <>
      <Modal
        title="Đơn hàng"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={onClose}
        width={768}
        footer={[
          <Button key="back" onClick={action === 'show' ? onRefuse : onClose}>
            {refuseTitle()}
          </Button>,
          <Button
            key="next"
            onClick={action === 'refuse' ? onRefuse : onConfirm}
          >
            {confirmTitle()}
          </Button>
        ]}
      >
        <Row gutter={[0, 12]}>
          <Col span={12}>
            <Text strong> Mã đơn hàng:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong>{data._id}</Text>
          </Col>

          <Col span={12}>
            <Text strong>Khách hàng:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong> {data.customer}</Text>
          </Col>

          <Col span={12}>
            <Text strong>Liên hệ:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong> {data.phone}</Text>
          </Col>

          <Col span={12}>
            <Text strong>Địa chỉ giao hàng:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong>
              {`${data.address.ward.WardName} - ${data.address.district.DistrictName} - ${data.address.province.ProvinceName}`}
            </Text>
          </Col>

          <Col span={12}>
            <Text strong>Tình trạng thanh toán:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong>
              {data.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </Text>
          </Col>

          <Col span={12}>
            <Text strong>Hình thức thanh toán:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong>{data.paymentMethod}</Text>
          </Col>

          <Col span={24}>
            <BooksTable data={data.books} />
          </Col>
          <Col span={12}>
            <Text strong>Tạm tính:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(data.subTotal)}
            </Text>
          </Col>

          <Col span={12}>
            <Text strong>Phí vận chuyển:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(data.shippingCost)}
            </Text>
          </Col>

          <Col span={12}>
            <Text strong>Giảm giá:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(data.voucher ? data.voucher.discount : 0)}
            </Text>
          </Col>

          <Col span={12}>
            <Text strong>Tổng cộng:</Text>
          </Col>
          <Col
            span={12}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
              paddingRight: '1rem'
            }}
          >
            <Text strong>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(data.total)}
            </Text>
          </Col>
        </Row>
      </Modal>
    </>
  )
}
