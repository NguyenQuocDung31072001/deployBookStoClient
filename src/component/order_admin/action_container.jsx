import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Space, Tooltip } from 'antd'
import { useState } from 'react'
import { updateOrder } from '../../redux/api_request'
import DetailModal from './detail_modal'

function ActionContainer(props) {
  const { data, onUpdate, onLoading, ...other } = props
  const [openModal, setOpenModal] = useState({})
  //   const showModal = action => {

  //   }

  const hideModal = () => {
    setOpenModal({
      ...openModal,
      open: false
    })
  }

  const handleConfirm = async () => {
    const currentStatus = data.status
    if (currentStatus >= 0 && currentStatus < 3) {
      onLoading()
      const newStatus = currentStatus + 1
      const updateInfo = {
        _id: data._id,
        currentStatus,
        newStatus
      }
      const updatedOrder = await updateOrder(updateInfo)
      onUpdate(updatedOrder)
      setOpenModal({
        ...openModal,
        open: false
      })
    }
  }

  const handleCancel = async () => {
    const currentStatus = data.status
    if (currentStatus >= 0 && currentStatus < 3) {
      onLoading()
      const updateInfo = {
        _id: data._id,
        currentStatus,
        newStatus: -1
      }
      const updatedOrder = await updateOrder(updateInfo)
      onUpdate(updatedOrder)
      setOpenModal({
        ...openModal,
        open: false
      })
    }
  }

  function confirmTitle(status) {
    if (status == 0) return 'Xác nhận'
    else if (status == 1) return 'Đã tiến hành vận chuyển'
    else if (status == 2) return 'Xác nhận giao hàng thành công'
  }

  function refuseTitle(status) {
    if (status == 0) return 'Từ chối '
    else if (status == 1) return 'Sự cố'
    else if (status == 2) return 'Giao hàng không thành công'
  }

  function showDetailModal() {
    setOpenModal({
      open: true,
      action: 'show'
    })
  }

  function showConfirmModal() {
    setOpenModal({
      open: true,
      action: 'confirm'
    })
  }

  function showRefuseModal() {
    setOpenModal({
      open: true,
      action: 'refuse'
    })
  }

  return (
    <Space size="middle">
      <Tooltip title="Chi tiết">
        <Button
          shape="circle"
          icon={<EyeOutlined />}
          onClick={showDetailModal}
        />
      </Tooltip>
      {data.status >= 0 && data.status < 3 && (
        <Tooltip title={confirmTitle(data.status)}>
          <Button
            shape="circle"
            icon={<CheckOutlined />}
            onClick={showConfirmModal}
            className="md:invisible lg:visible"
          />
        </Tooltip>
      )}
      {data.status >= 0 && data.status < 3 && (
        <Tooltip title={refuseTitle(data.status)}>
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={showRefuseModal}
            className="md:invisible lg:visible"
          />
        </Tooltip>
      )}
      <DetailModal
        visible={openModal.open}
        onClose={() => hideModal()}
        data={data}
        onRefuse={handleCancel}
        onConfirm={handleConfirm}
        step={data.status}
        action={openModal.action}
      />
      {/* {console.log(data)} */}
    </Space>
  )
}

export default ActionContainer
