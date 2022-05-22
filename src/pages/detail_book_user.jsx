import logoFooter from '../logo_footer.svg'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import { Typography, Rate, notification, Spin, Input, Modal } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'
import {
  getBook,
  addBookToCart,
  postNewReview,
  getReviewOfBook,
  updateReview,
  deleteReview,
  getAllBookUserReview,
  getAllBookUserBought
} from '../redux/api_request'
import { numberFormat } from '../utils/formatNumber'
import { getAllBookBought, getAllBookReview } from '../redux/book_bought_slices'

const { Title } = Typography
const { TextArea } = Input
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful']
function DetailBookUser() {
  const { genre, slug } = useParams()
  const dispatch = useDispatch()
  const [book, setBook] = useState()
  const [loading, setLoading] = useState(false)
  const [valueRate, setValueRate] = useState(1)
  const [updateValueRate, setUpdateValueRate] = useState(1)
  const [updateContent, setUpdateContent] = useState('')
  const [content, setContent] = useState('')
  const [allReview, setAllReview] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const currentUser = useSelector(state => state.auth.login.currentUser)
  const allBookCurrentUserBought = useSelector(
    state => state.bookBought.allBookBought
  )
  const allBookCurrentUserReview = useSelector(
    state => state.bookBought.allBookReview
  )
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    ;(async function () {
      let _bookApi = getBook(slug)
      let _bookBought
      let _bookReview
      if (currentUser) {
        _bookBought = getAllBookUserBought(currentUser._id)
        _bookReview = getAllBookUserReview(currentUser._id)
      }
      Promise.all([_bookBought, _bookReview, _bookApi]).then(
        ([bookBought, bookReview, bookApi]) => {
          if (currentUser) {
            dispatch(getAllBookBought(bookBought))
            dispatch(getAllBookReview(bookReview))
          }
          setBook(bookApi)
          setLoading(false)
        }
      )
    })()
    return () => {
      setBook('')
    }
  }, [])

  const updateValueAllBookReviewOfRedux = async () => {
    let bookReview = await getAllBookUserReview(currentUser?._id)
    dispatch(getAllBookReview(bookReview))
  }
  const getData = () => {
    ;(async function () {
      let _allBookReview = await getReviewOfBook(book._id)
      setAllReview(_allBookReview)
    })()
  }
  useEffect(() => {
    if (book) {
      const breadcrum = {
        genre_slug: genre,
        genre_name: book.genres[0].name,
        name_book: book.name
      }
      dispatch(updateBreadcrumb(breadcrum))
      getData()
    }
    return () => {
      setAllReview([])
    }
  }, [book])
  useEffect(() => {
    if (allReview.reviews?.length > 0) {
      if (currentUser) {
        allReview.reviews.forEach(review => {
          if (review.account._id === currentUser._id) {
            setUpdateValueRate(review.rating)
            setUpdateContent(review.content)
          }
        })
      }
    }
    return () => {
      setUpdateValueRate()
      setUpdateContent()
    }
  }, [allReview])
  const buyBookFnc = () => {
    if (book.amount === 0) {
      openNotification()
    } else {
      if (currentUser) {
        const id_book = book._id
        const id_account = currentUser._id
        const data = {
          book: id_book,
          account: id_account
        }
        addBookToCart(data)
        openNotification()
      } else {
        let dataCartWhenNotLogin = JSON.parse(localStorage.getItem('dataCart'))
        // console.log(dataCartWhenNotLogin)
        if (dataCartWhenNotLogin === null) {
          dataCartWhenNotLogin = []
          dataCartWhenNotLogin.push({
            key: 0,
            product: {
              _id: book._id,
              genres: book.genres[0].name,
              image: book.coverUrl,
              name: book.name,
              slug: book.slug
            },
            price: book.price,
            total: book.price,
            count: {
              status: false,
              value: 1
            }
          })
        } else {
          dataCartWhenNotLogin.push({
            key: dataCartWhenNotLogin.length,
            product: {
              _id: book._id,
              genres: book.genres[0].name,
              image: book.coverUrl,
              name: book.name,
              slug: book.slug
            },
            price: book.price,
            total: book.price,
            count: {
              status: false,
              value: 1
            }
          })
        }
        // dataCartWhenNotLogin=['meo meo']
        openNotification()
        localStorage.setItem('dataCart', JSON.stringify(dataCartWhenNotLogin))
      }
    }
  }
  const openNotification = () => {
    if (book.amount === 0) {
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
  //function of model
  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleOk = () => {
    setIsModalVisible(false)
    updateReviewFnc()
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  //change rate and content when update review
  const onChangeValueRate = e => {
    setValueRate(e)
  }
  const onChangeContent = e => {
    setContent(e.currentTarget.value)
  }
  //handle post,update,delete review
  const newReview = async () => {
    await postNewReview(currentUser._id, book._id, valueRate, content)
    updateValueAllBookReviewOfRedux()
    getData()
  }
  const updateReviewFnc = async () => {
    await updateReview(
      currentUser._id,
      book._id,
      updateValueRate,
      updateContent
    )
    updateValueAllBookReviewOfRedux()
    getData()
  }
  const deleteReviewFnc = async () => {
    await deleteReview(currentUser._id, book._id)
    updateValueAllBookReviewOfRedux()
    getData()
  }
  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="mt-[10px] w-[90%] bg-white shadow-md shadow-zinc-200 flex flex-col pb-4 relative">
        {loading && (
          <div className="fixed w-screen h-screen z-10">
            <Spin tip="Loading..." />
          </div>
        )}
        <div className="w-full h-[75px] border-b-[1px] border-solid border-gray-300 mb-8 flex items-center justify-start p-4">
          <h1 className="text-xl">Thông tin sách</h1>
        </div>
        {book && (
          <div className="flex">
            <div className="w-[500px] h-[600px] px-[20px] flex items-center justify-center shadow-md shadow-zinc-200">
              <img
                className="w-full h-full object-cover "
                src={book.coverUrl}
                alt=""
              />
            </div>
            <div className=" flex flex-col items-start px-4">
              <div className="">
                <Title level={1}>{book.name}</Title>
              </div>
              <div>
                <Title level={4}>
                  <span className="text-green-500">
                    Tác giả: {book.authors[0].fullName}
                  </span>
                </Title>
              </div>
              <div>
                <Title level={4}>
                  <span className="text-green-500">
                    Thể loại: {book.genres[0].name}
                  </span>
                </Title>
              </div>
              <div className="mt-[20px] flex ">
                <Title level={1}>{numberFormat(book.price)}</Title>
              </div>
              <div className="mb-4 flex items-center ">
                <Rate
                  allowHalf
                  disabled
                  defaultValue={book.rating}
                  style={{ fontSize: 25 }}
                />
                <span className="mx-4 text-lg font-normal">3 đánh giá</span>
                <span className="text-lg font-normal">5 người mua</span>
              </div>
              <div className="py-4">
                <span className="text-2xl text-gray-800">Nhà sản xuất:</span>
                <span className="text-2xl text-gray-500">
                  {' '}
                  {book.publishedBy}
                </span>
              </div>
              <div>
                <p className="text-2xl text-gray-500">
                  {' '}
                  Ngày xuất bản: {book.publishedDate.split('T')[0]}
                </p>
              </div>

              <div className="w-[80%] flex flex-col items-start">
                <Title level={4}>Mô tả </Title>
                <p className="text-[16px]">{book.description}</p>
              </div>
              <div className="absolute bottom-5 right-20">
                <button
                  onClick={buyBookFnc}
                  className="hover:bg-green-500 hover:text-white bg-[#fafafa] text-green-600 border-[1px] border-solid border-green-500 px-3 py-2 rounded-md duration-700"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {currentUser &&
        allBookCurrentUserBought.includes(book?._id) &&
        !allBookCurrentUserReview.includes(book?._id) && (
          <div className="mt-4 p-4 w-[90%] bg-white py-4 border-b-[1px] border-solid border-gray-300">
            <div className="w-full flex justify-start border-b-[1px] border-solid border-gray-300">
              <span className="text-xl font-medium">Đánh giá sản phẩm</span>
              <span className="pl-[100px]">
                <Rate
                  tooltips={desc}
                  onChange={onChangeValueRate}
                  value={valueRate}
                />
                {valueRate ? (
                  <span className="ml-4 text-xl font-normal">
                    {desc[valueRate - 1]}
                  </span>
                ) : (
                  ''
                )}
              </span>
            </div>
            <div>
              <div className="flex justify-start border-b-[1px] border-solid border-gray-300 mt-4 ">
                <p className="text-xl font-medium">Nhận xét</p>
              </div>
              <div className="flex p-4">
                <img
                  className="w-[50px] h-[50px] object-cover rounded-[50px] mr-4"
                  src={currentUser?.avatar_url}
                  alt=""
                />
                <TextArea
                  rows={4}
                  placeholder="maxLength is 100"
                  maxLength={100}
                  onChange={onChangeContent}
                />
              </div>
              <div className="w-full flex justify-end px-4">
                <button
                  className="bg-sky-500 px-4 py-2 rounded-sm text-white"
                  onClick={newReview}
                >
                  Nhận xét
                </button>
              </div>
            </div>
          </div>
        )}
      <div className="mt-4 flex flex-col w-[90%] bg-white py-8 mb-10">
        <div className="flex justify-start px-4 border-b-[1px] border-solid border-gray-300">
          <p className="text-xl font-medium">Tất cả nhận xét</p>
        </div>
        {allReview?.reviews?.length > 0 &&
          allReview?.reviews.map((review, index) => (
            <div
              key={index}
              className="flex mt-4 items-center justify-start border-b-[1px] border-solid border-gray-300"
            >
              <div className="w-[35%] flex items-center ml-[50px]">
                <img
                  className="w-[50px] h-[50px] rounded-[50px] object-cover"
                  src={review.account.avatar_url}
                  alt=""
                />
                <div className="ml-4">
                  <Title level={4}>{review.account.username}</Title>
                </div>
              </div>
              <div className="w-[40%] flex flex-col">
                <div className="flex items-center">
                  <Rate
                    style={{ fontSize: 15 }}
                    disabled
                    value={review.rating}
                  />
                  <span className="">{desc[review.rating - 1]}</span>
                </div>
                <div className=" flex items-center text-emerald-500">
                  <CheckCircleFilled />
                  <span>Đã mua hàng</span>
                </div>
                <div className="flex">
                  <p>{review.content}</p>
                </div>
              </div>
              {currentUser && review.account._id === currentUser._id && (
                <div className="w-[25%]">
                  <button
                    className="px-4 py-2 border-[1px] border-solid border-green-400 duration-500 
                  text-green-400 rounded-xl hover:bg-green-500 hover:text-white"
                    onClick={showModal}
                  >
                    Sửa đánh giá
                  </button>
                  <button
                    className="ml-4 px-4 py-2 border-[1px] border-solid border-green-400 duration-500 text-green-400 rounded-xl hover:bg-green-500 hover:text-white"
                    onClick={deleteReviewFnc}
                  >
                    Xóa đánh giá
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
      {currentUser && (
        <Modal
          title="Sửa đánh giá"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="flex items-center w-full p-4 border-b-[1px] border-solid border-gray-300">
            <span className="text-xl font-medium">Đánh giá</span>
            <span className="ml-8">
              <Rate
                tooltips={desc}
                onChange={e => setUpdateValueRate(e)}
                value={updateValueRate}
              />
              {updateValueRate ? (
                <span className="ant-rate-text">
                  {desc[updateValueRate - 1]}
                </span>
              ) : (
                ''
              )}
            </span>
          </div>
          <div className="flex flex-col w-full p-4">
            <div className="w-full h-[50px] pb-4 ">
              <p className="text-xl font-medium">Nhận xét</p>
            </div>
            <TextArea
              rows={4}
              placeholder="maxLength is 100"
              maxLength={100}
              value={updateContent}
              onChange={e => setUpdateContent(e.currentTarget.value)}
            />
          </div>
        </Modal>
      )}
      <div className="w-full mt-[50px] h-[200px] bg-black flex justify-around items-center">
        <div>
          <img
            className="w-[200px] h-[200px] object-cover"
            src={logoFooter}
            alt=""
          />
        </div>
        <div className="">
          <h1 className="text-white">Nguyễn Quốc Dũng</h1>
        </div>
        <div className="text-white">
          <h1 className="text-white">Trần Lương Ngyên</h1>
        </div>
      </div>
    </div>
  )
}

export default DetailBookUser
