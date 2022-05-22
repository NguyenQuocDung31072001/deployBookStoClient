import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Space, Tooltip } from 'antd'
import { useState } from 'react'
import { updateAnonymousOrder, updateOrder } from '../../redux/api_request'
import DetailModal from './detail_modal'

function AnonymousActionContainer(props) {
  const { data, onUpdate, onLoading, ...other } = props
  const [openModal, setOpenModal] = useState({})

  const hideModal = () => {
    setOpenModal({
      ...openModal,
      open: false
    })
  }

  const handleConfirm = async () => {
    onLoading()
    const updateInfo = {
      _id: data._id,
      confirmed: true
    }
    const updatedOrder = await updateAnonymousOrder(updateInfo)
    onUpdate(updatedOrder)
    setOpenModal({
      ...openModal,
      open: false
    })
  }

  const handleCancel = async () => {
    onLoading()
    const updateInfo = {
      _id: data._id,
      confirmed: false
    }
    const updatedOrder = await updateAnonymousOrder(updateInfo)
    console.log(updatedOrder)
    onUpdate(updatedOrder)
    setOpenModal({
      ...openModal,
      open: false
    })
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
      {!data.isVerified && (
        <Tooltip title="Xác nhận">
          <Button
            shape="circle"
            icon={<CheckOutlined />}
            onClick={showConfirmModal}
            className="md:invisible lg:visible"
          />
        </Tooltip>
      )}
      {!data.isVerified && (
        <Tooltip title="Từ chối">
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
        step={data.isVerified ? 3 : 0}
        action={openModal.action}
      />
      {/* {console.log(data)} */}
    </Space>
  )
}

export default AnonymousActionContainer
