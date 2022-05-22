import {
  Button,
  Col,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Radio,
  Checkbox,
  Space
} from 'antd'
import { useState } from 'react'
import moment from 'moment'
import { createNewVoucher, updateVoucher } from '../../redux/api_request'

export default function VoucherDetailModal(props) {
  const { data, onClose, onUpdate, onLoading, onError, visible } = props
  // const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [type, setType] = useState(
    data && typeof data.discountPercentage !== 'undefined' ? 1 : 2
  )
  const [isLimited, setIsLimited] = useState(
    data && typeof data.limit !== 'undefined' ? 1 : 2
  )
  const [discountLimit, setDiscountLimit] = useState(
    data &&
      typeof data.discountPercentage !== 'undefined' &&
      typeof data.discountCap !== 'undefined'
      ? true
      : false
  )
  const { RangePicker } = DatePicker

  const saveUpdateVoucher = async value => {
    if (data) {
      onLoading()
      const voucher = {
        ...value,
        startTime: value.time[0].toDate(),
        endTime: value.time[1].toDate(),
        _id: data._id
      }
      console.log('new voucher', voucher)
      const res = await updateVoucher(voucher)
      if (res.success) onUpdate(res.voucher)
      else onError(res.message)
    } else {
      onLoading()
      const voucher = {
        ...value,
        startTime: value.time[0].toDate(),
        endTime: value.time[1].toDate()
      }
      console.log('value', value)
      console.log('new voucher', voucher)
      const res = await createNewVoucher(voucher)
      if (res.success) onUpdate(res.voucher)
      else onError(res.message)
    }
  }

  return (
    <>
      <Modal
        title="Voucher"
        visible={visible}
        // onOk={handleOk}
        // confirmLoading={confirmLoading}
        onCancel={onClose}
        width={768}
        footer={null}
      >
        <Form
          name="voucher"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={saveUpdateVoucher}
          initialValues={
            data
              ? {
                  code: data.code,
                  discountPercentage: data.discountPercentage,
                  discountCap: data.discountCap,
                  limit: data.limit,
                  minSpend: data.minSpend,
                  time: [moment(data.startTime), moment(data.endTime)],
                  description: data.description
                }
              : {}
          }
        >
          <Form.Item
            name="code"
            label="Mã voucher"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mã khuyến mãi!'
              }
            ]}
          >
            <Input disabled={data ? true : false} style={{ color: 'black' }} />
          </Form.Item>

          <Form.Item
            // name="isLimit"
            label="Số lượng"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số lượng mã khuyến mãi!'
              }
            ]}
          >
            <Radio.Group
              onChange={e => {
                setIsLimited(e.target.value)
              }}
              value={isLimited}
            >
              <Radio value={1}>Số lượng có hạn</Radio>
              <Radio value={2}>Không giới hạn</Radio>
            </Radio.Group>
          </Form.Item>

          {isLimited === 1 && (
            <Form.Item
              name="limit"
              label="Số lượng tối đa"
              rules={[
                {
                  required: true,
                  type: 'number',
                  message: 'Vui lòng nhập số lượng mã khuyến mãi tối đa!'
                }
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          )}

          <Form.Item
            name="time"
            label="Thời gian khuyến mãi"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập thời gian khuyến mãi!'
              }
            ]}
          >
            <RangePicker
              showTime
              placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
              style={{ width: '100%' }}
              format={'HH:mm:ss DD-MM-YYYY'}
            />
          </Form.Item>

          <Form.Item
            name="minSpend"
            label="Mức chi tối thiểu (đ)"
            rules={[
              {
                type: 'number',
                required: true,
                message:
                  'Vui lòng nhập mức chi tiêu tối thiểu được sử dụng khuyến mãi tối đa!'
              }
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Loại mã giảm">
            <Radio.Group
              onChange={e => {
                setType(e.target.value)
              }}
              value={type}
            >
              <Radio value={1}>Giảm theo tỉ lệ</Radio>
              <Radio value={2}>Giảm theo mức cố định</Radio>
            </Radio.Group>
          </Form.Item>
          {type == 1 && (
            <>
              <Form.Item
                name="discountPercentage"
                label="Tỉ lệ giảm (%)"
                rules={[
                  {
                    type: 'number',
                    min: 0,
                    required: true,
                    message: 'Vui lòng nhập tỉ lệ khuyến mãi!'
                  }
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                wrapperCol={{ offset: 6, span: 18 }}
                valuePropName="checked"
              >
                <Checkbox
                  checked={discountLimit}
                  onChange={e => {
                    setDiscountLimit(e.target.checked)
                  }}
                >
                  Áp dụng mức khuyến mãi tối đa
                </Checkbox>
              </Form.Item>
              {discountLimit === true && (
                <Form.Item
                  name="discountCap"
                  label="Mức giảm tối đa (đ)"
                  rules={[
                    {
                      type: 'number',
                      min: 0,
                      required: true,
                      message: 'Vui lòng nhập mức giảm tối đa!'
                    }
                  ]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              )}
            </>
          )}
          {type === 2 && (
            <Form.Item
              name="discountCap"
              label="Mức giảm (đ)"
              rules={[
                {
                  type: 'number',
                  min: 0,
                  required: true,
                  message: 'Vui lòng nhập mức giảm khuyến mãi!'
                }
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          )}
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mô tả cho khuyễn mãi!'
              }
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Space size={16}>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
              <Button type="" onClick={onClose}>
                Hủy bỏ
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
