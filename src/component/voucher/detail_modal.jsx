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
            label="M?? voucher"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p m?? khuy???n m??i!'
              }
            ]}
          >
            <Input disabled={data ? true : false} style={{ color: 'black' }} />
          </Form.Item>

          <Form.Item
            // name="isLimit"
            label="S??? l?????ng"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p s??? l?????ng m?? khuy???n m??i!'
              }
            ]}
          >
            <Radio.Group
              onChange={e => {
                setIsLimited(e.target.value)
              }}
              value={isLimited}
            >
              <Radio value={1}>S??? l?????ng c?? h???n</Radio>
              <Radio value={2}>Kh??ng gi???i h???n</Radio>
            </Radio.Group>
          </Form.Item>

          {isLimited === 1 && (
            <Form.Item
              name="limit"
              label="S??? l?????ng t???i ??a"
              rules={[
                {
                  required: true,
                  type: 'number',
                  message: 'Vui l??ng nh???p s??? l?????ng m?? khuy???n m??i t???i ??a!'
                }
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          )}

          <Form.Item
            name="time"
            label="Th???i gian khuy???n m??i"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p th???i gian khuy???n m??i!'
              }
            ]}
          >
            <RangePicker
              showTime
              placeholder={['Th???i gian b???t ?????u', 'Th???i gian k???t th??c']}
              style={{ width: '100%' }}
              format={'HH:mm:ss DD-MM-YYYY'}
            />
          </Form.Item>

          <Form.Item
            name="minSpend"
            label="M???c chi t???i thi???u (??)"
            rules={[
              {
                type: 'number',
                required: true,
                message:
                  'Vui l??ng nh???p m???c chi ti??u t???i thi???u ???????c s??? d???ng khuy???n m??i t???i ??a!'
              }
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Lo???i m?? gi???m">
            <Radio.Group
              onChange={e => {
                setType(e.target.value)
              }}
              value={type}
            >
              <Radio value={1}>Gi???m theo t??? l???</Radio>
              <Radio value={2}>Gi???m theo m???c c??? ?????nh</Radio>
            </Radio.Group>
          </Form.Item>
          {type == 1 && (
            <>
              <Form.Item
                name="discountPercentage"
                label="T??? l??? gi???m (%)"
                rules={[
                  {
                    type: 'number',
                    min: 0,
                    required: true,
                    message: 'Vui l??ng nh???p t??? l??? khuy???n m??i!'
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
                  ??p d???ng m???c khuy???n m??i t???i ??a
                </Checkbox>
              </Form.Item>
              {discountLimit === true && (
                <Form.Item
                  name="discountCap"
                  label="M???c gi???m t???i ??a (??)"
                  rules={[
                    {
                      type: 'number',
                      min: 0,
                      required: true,
                      message: 'Vui l??ng nh???p m???c gi???m t???i ??a!'
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
              label="M???c gi???m (??)"
              rules={[
                {
                  type: 'number',
                  min: 0,
                  required: true,
                  message: 'Vui l??ng nh???p m???c gi???m khuy???n m??i!'
                }
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          )}
          <Form.Item
            name="description"
            label="M?? t???"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p m?? t??? cho khuy???n m??i!'
              }
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Space size={16}>
              <Button type="primary" htmlType="submit">
                L??u
              </Button>
              <Button type="" onClick={onClose}>
                H???y b???
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
