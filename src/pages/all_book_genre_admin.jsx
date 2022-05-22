import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { PATH_NAME } from '../config/pathName'
import { getBookOfGenres } from '../redux/api_request'
function AllGenreBookAdmin() {
  const { genre } = useParams()
  const [book, setBook] = useState([])
  const [nameGenres, setNameGenres] = useState()

  useEffect(() => {
    const getBookOfGenresFnc = async () => {
      const bookData = await getBookOfGenres(genre)
      setBook(bookData.books)
      setNameGenres(bookData.genre.name)
    }
    getBookOfGenresFnc()
  }, [])

  return (
    <div className="w-full flex flex-col items-center">
        <div className='w-full h-[100px] bg-sky-500'>
            <p>{nameGenres}</p>
        </div>
      <div className="flex mt-[20px] p-[18px] w-[88%] bg-white">

      {book.map((book, key) => (
        <div
          key={key}
          className="group w-[240px] h-[290px] m-[10px] p-[5px] shadow-xl overflow-hidden cursor-pointer shadow-neutral-400"
        >
          <Link to={`${PATH_NAME.GENRES_BOOK_ADMIN}/${book.genres[0]?.slug}/${book.slug}`}>
            <div className="flex items-center p-[10px] h-[240px]">
              <img src={book.coverUrl} className="object-cover" alt="" />
            </div>
            <div className="flex flex-col h-[110px] transition translate-y-[60px] duration-[0.25s] group-hover:translate-y-[-60px] group-hover:text-white group-hover:bg-stone-600">
              <span>{book.name}</span>
              <span>Thể loại: {book.genres[0]?.name}</span>
              <span>Tác giả: {book.authors[0]?.fullName}</span>
              <span>Mô tả: {book.description}</span>
            </div>
          </Link>
        </div>
      ))}
      </div>
    </div>
  )
}

export default AllGenreBookAdmin
