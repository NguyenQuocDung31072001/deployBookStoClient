import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Image, Input, Typography, Menu } from 'antd'
import LoginAndRegister from './login_register'
import { updateQuery } from '../redux/search_slices'
import BreadcrumbsUser from './breadcrumbs_user'
import {
  SearchOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  FilterOutlined,
  HomeOutlined,
  ShopOutlined
} from '@ant-design/icons'
const IMAGE_URL = 'http://localhost:5000/image_avatar/avatar_user.png'
function TopUser() {
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const breadcrumbName=useSelector(state => state.breadcrumb.breadcrumb.genre_name)
  const dispatch = useDispatch()
  const [query, setQuery] = useState('')
  const [image, setImage] = useState()
  const [openMenu,setOpenMenu]=useState(false)
  useEffect(() => {
    if (currentUser?.avatar_url) {
      setImage(currentUser.avatar_url)
    }
  }, [currentUser])

  useEffect(() => {
    let search = {
      query: { name: query },
      type: 'name'
    }
    dispatch(updateQuery(search))
  }, [query])
  //currentUser.avatar_url
  return (
    <div className="md:ml-[300px] w-[100%] md:w-[81%] h-[80px] bg-[#ecf0f1] fixed top-0 text-white border-b-[1px] border-slate-300 z-50">
      <div className="flex justify-between items-center mt-[20px]">
        <div className="ml-[20px] text-black">
          <div className="hidden md:block">
            <BreadcrumbsUser />
          </div>
          <div className="block relative md:hidden  ">
            <MenuUnfoldOutlined style={{fontSize:30}} onClick={()=>{setOpenMenu(openMenu=>!openMenu)}}/>
            {openMenu && (
              <div className="absolute left-[-20px] top-[45px]">
                <Menu style={{ width: 170 }} mode="inline" theme="light">
                  <Menu.Item icon={<HomeOutlined />} key="dashboard">
                    <Link to="/user/home">HomePage</Link>
                  </Menu.Item>
                  <Menu.Item icon={<FilterOutlined />} key="category">
                    <Link to="/user/category">Category Book</Link>
                  </Menu.Item>
                  <Menu.Item icon={<ShoppingCartOutlined />} key="cart">
                    <Link to="/user/cart">Giỏ hàng</Link>
                  </Menu.Item>
                  <Menu.Item icon={<ShopOutlined />} key="purchase">
                    <Link to="/user/purchase">Đơn hàng của bạn</Link>
                  </Menu.Item>
                  <Menu.Item icon={<SettingOutlined />} key="setting">
                    <Link to="/user/setting">Thông tin cá nhân</Link>
                  </Menu.Item>
                </Menu>
              </div>
            )}
          </div>
        </div>
        {(breadcrumbName==='Home Pages' || breadcrumbName==='Category Pages') && (
          <div className="flex w-[120px] md:w-[300px] items-center rounded-[5px]">
            <Input
              size="large"
              placeholder="Tìm kiếm"
              style={{ width: 300 }}
              value={query}
              onChange={e => setQuery(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </div>
        )}
        <div className=" flex justify-between items-center  mr-[40px]">
          <div className="hidden md:block">
            <Link to="/user/cart">
              <div className="mr-4">
                <ShoppingCartOutlined
                  style={{ fontSize: '45px', color: '#2c3e50' }}
                />
              </div>
            </Link>
          </div>
          {currentUser && (
            <Link to="/user/setting">
              <div className="flex items-center text-xl text-black">
                <img
                  className="h-[50px] w-[50px] object-cover cursor-pointer rounded-[50px]"
                  src={image ? currentUser?.avatar_url : IMAGE_URL}
                  alt=""
                />
                <p className="hidden md:block font-bold ml-4">
                  {currentUser.username}
                </p>
              </div>
            </Link>
          )}
          {!currentUser && (
            <div>
              <LoginAndRegister />
            </div>
          )}
        </div>
      </div>
      {/* <div className="flex justify-center">
        {typeBook.map((type, key) => (  
          <div key={key} className="mx-[10px] cursor-pointer ">
            <Link to={`/user/home/${type}`}>
              <span className="text-white"> {type}</span>
            </Link>
          </div>
        ))}
      </div> */}
    </div>
  )
}

export default TopUser
