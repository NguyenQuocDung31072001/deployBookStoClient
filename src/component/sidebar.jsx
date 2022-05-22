import bookPicture from '../book.svg'
import Icon from '../icon.png'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Typography } from 'antd'
import {
  SettingOutlined,
  ShoppingCartOutlined,
  FilterOutlined,
  HomeOutlined,
  UserSwitchOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  ProfileOutlined,
  ShopOutlined
} from '@ant-design/icons'
import {
  getAllGenresForAddBook,
  getAllAuthorForAddBook
} from '../redux/api_request'
const { SubMenu } = Menu
const { Title } = Typography
function SideBar() {
  const [allGenres, setAllGenres] = useState([])
  const [allAuthors, setAllAuthors] = useState([])
  const navigate = useNavigate()
  const handleClick = e => {
    // console.log(e)
  }
  useEffect(() => {
    ;(async function () {
      const allGenre = await getAllGenresForAddBook() //load api lấy tất cả thể loại
      const allGenreName = []
      for (let i = 0; i < allGenre.length; i++) {
        allGenreName.push({
          name: allGenre[i].name,
          slug: allGenre[i].slug
        })
      }
      setAllGenres(allGenreName)
      const allAuthor = await getAllAuthorForAddBook() //load api lấy tất cả tác giả
      const allAuthorName = []
      for (let i = 0; i < allAuthor.length; i++) {
        allAuthorName.push({
          name: allAuthor[i].fullName,
          slug: allAuthor[i].slug
        })
      }
      setAllAuthors(allAuthorName)
    })()
  }, [])
  return (
    <div className="hidden h-full bg-white overflow-y-auto fixed top-0 left-0 z-40 md:block md:w-[300px]">
      <div className=" text-green-500">
        <Link to="/user/home">
          <div className="flex items-center justify-start ml-4 p-8">
            <img className="w-[60px] object-cover" src={Icon} alt="" />
            <div className="mt-3">
              <Title level={2} style={{ color: 'green', fontWeight: 800 }}>
                BookStore
              </Title>
            </div>
          </div>
        </Link>
      </div>
      <Menu
        onClick={handleClick}
        style={{ width: 300 }}
        mode="inline"
        theme="light"
      >
        <Menu.Item icon={<HomeOutlined />} key="dashboard">
          <Link to="/user/home">HomePage</Link>
        </Menu.Item>
        <Menu.Item icon={<FilterOutlined />} key="category">
          <Link to="/user/category">Category Book</Link>
        </Menu.Item>
        <Menu.Item icon={<ShoppingCartOutlined />} key="cart">
          <Link to="/user/cart">Giỏ hàng</Link>
        </Menu.Item>

        <SubMenu key="sub2" icon={<MedicineBoxOutlined />} title="Thể loại">
          {allGenres.length > 0 &&
            allGenres.map((genres, index) => (
                <Menu.Item icon={<ProfileOutlined />} key={index + 'genres'} >
                  <Link to={`/user/home/${genres.slug}`}>{genres.name}</Link>
                </Menu.Item>
              )
            )}
        </SubMenu>
        <SubMenu key="sub3" icon={<UserSwitchOutlined />} title="Tác Giả">
          {allAuthors.length > 0 &&
            allAuthors.map((authors, index) => (
              <Menu.Item icon={<UserOutlined />} key={index + 'authors'}>
                <Link to={`/user/home/${authors.slug}`}>{authors.name}</Link>
              </Menu.Item>
            ))}
        </SubMenu>
        <Menu.Item icon={<ShopOutlined />} key="purchase">
          <Link to="/user/purchase">Đơn hàng của bạn</Link>
        </Menu.Item>
        <Menu.Item icon={<SettingOutlined />} key="setting">
          <Link to="/user/setting">Thông tin cá nhân</Link>
        </Menu.Item>
      </Menu>
      <div className="mt-[40px]">
        <img src={bookPicture} alt="" />
      </div>
    </div>
  )
}

export default SideBar
