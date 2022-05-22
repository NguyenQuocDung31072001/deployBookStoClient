import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Typography, Spin } from 'antd'
import { getBook } from '../redux/api_request'
import { numberFormat } from '../utils/formatNumber'
import { PATH_NAME } from '../config/pathName'
import UpdateBookAdmin from '../component/update_book_admin'
const { Title } = Typography

function DetailBookAdmin() {
  const { genre, slug } = useParams()
  const [book, setBook] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const getBookFnc = async slug => {
      let bookApi = await getBook(slug)
      setBook(bookApi)
      setLoading(false)
    }
    getBookFnc(slug)
    return ()=>{
      setBook([])
    }
  }, [])

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full h-[100px] bg-sky-500 ">
        <p>Chi tiết sách</p>
      </div>
      <div className="mt-[30px] w-[90%] h-[500px] shadow-md shadow-zinc-200 flex relative">
        {loading && (
          <div className="fixed w-screen h-screen z-10">
            <Spin tip="Loading..." />
          </div>
        )}
        <div className="w-[40%] p-[20px] h-[500px] flex justify-center items-center shadow-md shadow-zinc-200">
          <img
            className="w-[90%] h-full object-cover "
            src={book?.coverUrl}
            alt=""
          />
        </div>
        <div className="w-[60%] flex flex-col items-center overflow-scroll overscroll-contain">
          <div className="w-full flex justify-center">
            <Title level={2}>{book?.name}</Title>
          </div>
          <div className="w-[500px] flex items-center justify-between">
            <div>
              <Title level={4}>Tác giả:{book?.authors[0]?.fullName}</Title>
            </div>
            <div>
              <Link to={`${PATH_NAME.DETAIL_BOOK_ADMIN}/${book?.genres[0].slug}`}>
                <Title level={4}>Thể loại:{book?.genres[0]?.name}</Title>
              </Link>
            </div>
          </div>
          <div className="w-[500px] mt-[20px] flex ">
            <Title level={1}>{numberFormat(book?.price)}</Title>
          </div>
          <div className="w-[500px] flex justify-between">
            <div>
              <Title level={4}>Nhà sản xuất:{book?.publishedBy}</Title>
            </div>
            <div>
              <Title level={4}>
                Ngày xuất bản:{book?.publishedDate?.split('T')[0]}
              </Title>
            </div>
          </div>
          <div className="w-[500px] flex flex-col items-start">
            <Title level={4}>Mô tả </Title>
            <p className="text-[16px]">{book?.description}</p>
          </div>
          <div>
            {book && 
            <UpdateBookAdmin book={book}/>
            
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailBookAdmin
