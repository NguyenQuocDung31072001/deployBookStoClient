import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SlideshowUser from '../component/slideshow_user'
import TopRatingSlider from '../component/slider_home_user'
import Footer from "../component/footer"
import { getAllBook } from '../redux/api_request'
import { Spin } from 'antd'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import RenderBookComponent from '../component/render_book_component'
import {ConvertViToEn} from "../utils/convertViToEn"
export default function HomePagesUser() {
  const querySearch = useSelector(state => state.search.search)
  const [bookData, setBookData] = useState([])
  const [bookRender, setBookRender] = useState([])
  const dispatch = useDispatch()
  useEffect(() => {
    ;(async function () {
      let data = await getAllBook()
      setBookData(data)
      setBookRender(data)
    })()
    const breadcrum = {
      genre_slug: 'Home Pages',
      genre_name: 'Home Pages',
      name_book: ''
    }
    dispatch(updateBreadcrumb(breadcrum))
  }, [])
  useEffect(() => {
    let dataQuery
    if (querySearch.type === 'name') {
      let querySearchName= ConvertViToEn(querySearch.query.name.toLowerCase())
      dataQuery = bookData?.filter(book =>
        ConvertViToEn(book.name.toLowerCase()).includes(querySearchName)
      )
    }
    setBookRender(dataQuery)
    window.scrollTo(0,0)
    return () => {
      setBookRender()
    }
  }, [querySearch])

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-[350px]">
        <SlideshowUser />
      </div>
      {bookData?.length === 0 && (
        <div className="w-full h-full flex items-center justify-center">
          <Spin tip="Loading..." />
        </div>
      )}
      <RenderBookComponent books={bookRender} />
      <div className="w-[97%] p-4 mb-8 bg-white">
        <TopRatingSlider />
      </div>
      <Footer/>
    </div>
  )
}
