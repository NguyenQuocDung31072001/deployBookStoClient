import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateBreadcrumb } from '../redux/breadcrumb_slices'
import { getBookOfGenres, getBookOfAuthors } from '../redux/api_request'
import RenderBookComponent from '../component/render_book_component'
import Footer from '../component/footer'

function GenresAuthorsBookUser() {
  const { slug } = useParams()
  const [book, setBook] = useState([])
  const [nameSlug, setNameSlug] = useState()
  const dispatch = useDispatch()
  useEffect(() => {
    ;(async function () {
      let bookData = ''
      bookData = await getBookOfGenres(slug)
      if (!bookData) {
        bookData = await getBookOfAuthors(slug)
        setBook(bookData.books)
        setNameSlug(bookData.author.fullName)
        return
      }
      setBook(bookData.books)
      setNameSlug(bookData.genre.name)
    })()
    return () => {
      setBook()
      setNameSlug()
    }
  }, [slug])
  useEffect(() => {
    const breadcrumb = {
      genre_slug: slug,
      genre_name: nameSlug,
      name_book: ''
    }
    dispatch(updateBreadcrumb(breadcrumb))
  }, [nameSlug])

  return (
    <div className="flex flex-col items-center">
      <div className="flex p-[18px] w-[97%] bg-white">
        <RenderBookComponent books={book} />
      </div>
      <div className="mt-[50px]">
      </div>
        <Footer />
    </div>
  )
}

export default GenresAuthorsBookUser
