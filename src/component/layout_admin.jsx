import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Menu, Spin } from 'antd'
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  AppstoreAddOutlined,
  EyeOutlined,
  CheckOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  LineChartOutlined
} from '@ant-design/icons'

const IMAGE_URL = 'http://localhost:5000/image_avatar/avatar_admin.png'
const { SubMenu } = Menu

function LayoutAdmin() {
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const [image, setImage] = useState()
  useEffect(() => {
    if (currentUser?.avatar_url) {
      setImage(currentUser.avatar_url)
    }
  }, [currentUser])
  const handleClick = e => {
    console.log(e)
  }
  //currentUser.avatar_url
  return (
    <div className="w-[256px] h-full bg-[#001529] fixed top-0">
      <Link to="/admin/setting">
        <div className="w-[110px] flex justify-between items-center m-auto text-white">
          <img
            className="h-[50px] w-[50px] object-cover cursor-pointer rounded-[50px]"
            src={image ? currentUser?.avatar_url : IMAGE_URL}
            alt=""
          />
          <span>{currentUser?.username}</span>
        </div>
      </Link>
      <Menu
        onClick={handleClick}
        style={{ width: 256 }}
        // defaultSelectedKeys={['1']}
        // defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
      >
        <Menu.Item icon={<AreaChartOutlined />} key="dashboard">
          <Link to="/admin/dashboard">Dashboard</Link>
        </Menu.Item>
        <SubMenu key="sub1" icon={<SettingOutlined />} title="Manage book">
          <Menu.Item icon={<AppstoreAddOutlined />} key="add_book">
            <Link to="/admin/add_book">Thêm sách</Link>
          </Menu.Item>
          <Menu.Item icon={<EyeOutlined />} key="book">
            <Link to="/admin/all_book">Xem sách</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item icon={<BarChartOutlined />} key="genre">
          <Link to="/admin/genre">Thể loại</Link>
        </Menu.Item>
        <Menu.Item icon={<LineChartOutlined />} key="author">
          <Link to="/admin/author">Tác giả</Link>
        </Menu.Item>
        <Menu.Item key="confirm">
          <Link to="/admin/confirm"> Phê duyệt</Link>
        </Menu.Item>
        <Menu.Item key="anonymous">
          <Link to="/admin/anonymous"> Khách vãng lai</Link>
        </Menu.Item>
        <Menu.Item key="voucher">
          <Link to="/admin/voucher"> Khuyễn mãi</Link>
        </Menu.Item>
      </Menu>
    </div>
  )
}

export default LayoutAdmin
