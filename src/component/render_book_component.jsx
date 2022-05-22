import { ShoppingCartOutlined } from '@ant-design/icons'
import { notification, Rate, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { PATH_NAME } from '../config/pathName'
import { addBookToCart } from '../redux/api_request'
import { numberFormat } from '../utils/formatNumber'
import PaginationFunc from './pagination'
const { Title } = Typography
const RenderBookComponent = ({ books }) => {
  // console.log(books)
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const navigate = useNavigate()
  const [bookRender, setBookRender] = useState()
  useEffect(() => {
    if (books) {
      let limit = 16
      setBookRender(books.slice(0, limit))
    }
  }, [books])

  const buyBookFnc = (idOfBook, amount) => {
    if (amount === 0) {
      openNotification(amount)
    } else {
      if (currentUser) {
        const id_book = idOfBook
        const id_account = currentUser._id
        const data = {
          book: id_book,
          account: id_account
        }
        addBookToCart(data)
        openNotification(amount)
      } else {
        let _bookClick = bookRender.find(book => book._id === idOfBook)
        // console.log(_bookClick)
        let dataCartWhenNotLogin = JSON.parse(localStorage.getItem('dataCart'))
        // console.log(dataCartWhenNotLogin)
        if (dataCartWhenNotLogin === null) {
          dataCartWhenNotLogin = []
          dataCartWhenNotLogin.push({
            key: 0,
            product: {
              genres: _bookClick.genres[0].name,
              image: _bookClick.coverUrl,
              name: _bookClick.name,
              slug: _bookClick.slug,
              _id: _bookClick._id
            },
            price: _bookClick.price,
            total: _bookClick.price,
            count: {
              status: false,
              value: 1
            }
          })
        } else {
          dataCartWhenNotLogin.push({
            key: dataCartWhenNotLogin.length,
            product: {
              genres: _bookClick.genres[0].name,
              image: _bookClick.coverUrl,
              name: _bookClick.name,
              slug: _bookClick.slug,
              _id: _bookClick._id
            },
            price: _bookClick.price,
            total: _bookClick.price,
            count: {
              status: false,
              value: 1
            }
          })
        }
        // dataCartWhenNotLogin=['meo meo']
        openNotification(amount)
        localStorage.setItem('dataCart', JSON.stringify(dataCartWhenNotLogin))
      }
    }
  }
  const openNotification = amount => {
    if (amount === 0) {
      notification.open({
        message: 'Đã hết sách!',
        description: 'Bạn vui lòng chờ nhập thêm sách vào kho hàng!',
        style: {
          width: 400,
          backgroundColor: '#ffbe76',
          color: '#535c68'
        }
      })
    } else {
      notification.open({
        message: 'Đã thêm vào giỏ hàng!',
        description: 'Sách đã được thêm vào giỏ hàng. Click để xem chi tiết!',
        style: {
          width: 400
        },
        onClick: () => {
          navigate('/user/cart')
        }
      })
    }
  }
  const onChangePage = current => {
    window.scrollTo(0, 0)
    console.log(current)
    const limit = 16
    let _bookRender = [...books].slice(limit * (current - 1), limit * current)
    setBookRender(_bookRender)
  }
  return (
    <div className="w-full flex flex-col items-center justify-center mb-8">
      <div className="md:flex md:flex-wrap bg-white h-fit md:w-[97%] mb-4">
        {bookRender?.length > 0 &&
          bookRender?.map((book, key) => (
            <div
              key={key}
              className="group w-[260px] h-[220px] m-4 p-2 overflow-hidden "
            >
              <div className="flex w-fullh-[182px]">
                <div className=" w-[130px] h-[182px] mr-2 relative ">
                  <img
                    src={book.coverUrl}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                  <div className="w-full h-full duration-[0.5s] flex items-center justify-center absolute top-0 left-0 right-0 opacity-0 group-hover:opacity-100 group-hover:bg-[#00000090] ">
                    <div>
                      <Link
                        to={`${PATH_NAME.USER_HOME_PAGE}/${book.genres[0]?.slug}/${book.slug}`}
                        className="cursor-pointer"
                      >
                        <div className="">
                          <button className="hover:bg-green-500 hover:text-white bg-[#fafafa] text-green-600 border-none px-3 py-2 rounded-md duration-700">
                            Xem sách
                          </button>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="relative w-[130px] text-black">
                  <Title level={5}>{book.name}</Title>
                  <span>{book.authors[0]?.fullName}</span>
                  <Rate
                    allowHalf
                    disabled
                    defaultValue={book.rating}
                    style={{ fontSize: 12 }}
                  />
                  <div className="">
                    <p className="text-lg font-bold">
                      {numberFormat(book.price)}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-4">
                    <ShoppingCartOutlined
                      style={{ color: '#27ae60', fontSize: 30 }}
                      onClick={() => buyBookFnc(book._id, book.amount)}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full h-[38px] ">
                {book.amount === 0 && (
                  <div className="w-full h-full bg-gradient-to-r from-sky-400 to-indigo-300">
                    <p className="text-[18px] font-bold text-red-500">
                      Đã hết sách
                    </p>
                  </div>
                )}
                {book.amount !== 0 && (
                  <div className="w-full h-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
                    <p className="text-[18px] font-bold text-yellow-300">
                      Còn {book.amount} cuốn
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      {bookRender?.length > 0 && (
        <PaginationFunc
          limit={16}
          total={books?.length}
          handlePageChange={onChangePage}
        />
      )}
    </div>
  )
}

export default RenderBookComponent
