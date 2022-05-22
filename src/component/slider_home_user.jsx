import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Rate, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import { PATH_NAME } from '../config/pathName'
import { getTopBook } from '../redux/api_request'
import { numberFormat } from '../utils/formatNumber'
export default function TopRatingSlider() {
  const [topBookRating, setTopBookRating] = useState()
  useEffect(() => {
    ;(async function () {
      let arr = await getTopBook(10, 'rating')
      setTopBookRating(arr)
    })()
    return () => {
      setTopBookRating()
    }
  }, [])
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true
  }
  return (
    <div className='mb-4'>
      <div className="p-4 mb-4 flex justify-start border-b-[1px] border-gray-300">
        <p className="text-xl font-medium">Sách yêu thích</p>
      </div>
      <Slider {...settings}>
        {topBookRating &&
          topBookRating.map((book, index) => (
            <div key={index}>
              <div className="group flex items-center w-[356px] h-[209px] px-[15px]">
                <div className="relative w-[148px] h-[209px]">
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
                <div className="relative flex flex-col w-[208px] h-[185px] text-black">
                  <p className='text-xl font-medium'>{book.name}</p>
                  <span className='text-gray-600 text-[16px] font-medium'>Tác giả: {book.authors[0]?.fullName}</span>
                  <span className='text-gray-600 text-[16px] font-medium'>Thể loại: {book.genres[0]?.name}</span>
                  <div className='my-2'>
                    <Rate
                      allowHalf
                      disabled
                      defaultValue={book.rating}
                      style={{ fontSize: 12 }}
                    />
                  </div>
                  <div className="">
                    <p className="text-lg font-bold">
                      {numberFormat(book.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </Slider>
    </div>
  )
}
