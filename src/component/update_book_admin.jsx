import React, { useEffect, useState } from 'react'
import { Modal, Button, Input, DatePicker, Select } from 'antd'
import moment from 'moment'
import {
  getAllAuthorForAddBook,
  getAllGenresForAddBook,
  updateBook
} from '../redux/api_request'
import { PATH_NAME } from '../config/pathName'
const { TextArea } = Input
const { Option } = Select
export default function UpdateBookAdmin({ book }) {
  // console.log(book)
  const [imageBook, setImageBook] = useState(null)
  const [nameBook, setNameBook] = useState('')
  const [publishedBy, setPublishedBy] = useState('')
  const [page, setPage] = useState('')
  const [amount, setAmount] = useState('')
  const [publishedDate, setPublishedDate] = useState('')
  const [author, setAuthor] = useState('')
  const [price, setPrice] = useState('')
  const [genre, setGenre] = useState('')
  const [description, setDescription] = useState('')
  const [imageBase64, setImageBase64] = useState(null)
  const [allGenres, setAllGenres] = useState([])
  const [allAuthor, setAllAuthor] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    setNameBook(book.name)
    setAuthor(book.authors[0]?.fullName)
    setGenre(book.genres[0]?.name)
    setDescription(book.description)
    setPage(book.pages)
    setPublishedBy(book.publishedBy)
    setPublishedDate(book.publishedDate.split('T')[0])
    setAmount(book.amount)
    setPrice(book.price)
    const getAllGenresFnc = async () => {
      const allGenre = await getAllGenresForAddBook()
      const allGenreName = []
      for (let i = 0; i < allGenre.length; i++) {
        allGenreName.push(allGenre[i].name)
      }
      setAllGenres(allGenreName)
    }
    const getAllAuthorFnc = async () => {
      const allAuthor = await getAllAuthorForAddBook()
      const allAuthorName = []
      for (let i = 0; i < allAuthor.length; i++) {
        allAuthorName.push(allAuthor[i].fullName)
      }
      setAllAuthor(allAuthorName)
    }
    getAllGenresFnc()
    getAllAuthorFnc()
    return ()=>{
      setNameBook('')
      setAuthor('')
      setGenre('')
      setDescription('')
      setPage('')
      setPublishedBy('')
      setPublishedDate('')
      setAmount('')
      setPrice('')
    }
  }, [])
  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleOk = () => {
    setIsModalVisible(false)
    ;(function(){
      const bookData = {
        id: book._id,
        name: nameBook ,
        genres: genre ,
        authors: author ,
        description: description ,
        format: 1,
        language: '6229dc343a2e43c8cd9dbd65',
        pages: page ,
        publishedBy: publishedBy ,
        publishedDate: publishedDate
         ,
        amount: amount,
        price: price,
        base64Image: imageBase64
      }
      ;(async function(){
        await updateBook(bookData)
        window.location.reload()
      })()
    })()
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const changeImageBook = e => {
    setImageBook(e.target.files[0])

    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onloadend = () => {
      setImageBase64(reader.result)
    }
    reader.onerror = () => {
      console.error('AHHHHHHHH!!')
    }
  }
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Update Book
      </Button>
      <Modal
        title="Update book"
        width={900}
        style={{ marginBottom: 40 }}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex ">
          <div className="flex justify-center items-center w-[350px] ml-[20px] h-[450px]">
            <label className="flex flex-col w-full h-[350px] cursor-pointer">
              <div className="flex flex-col items-center justify-center">
                {imageBook && (
                  <img
                    className="w-full h-full object-cover"
                    src={URL.createObjectURL(imageBook)}
                    alt=""
                  />
                )}
                {!imageBook && (
                  <img
                    className="w-full h-full object-cover"
                    src={book.coverUrl}
                    alt=""
                  />
                )}
              </div>
              <input
                type="file"
                className="opacity-0"
                onChange={changeImageBook}
              />
            </label>
          </div>
          <div className="w-[400px] ml-[20px]">
            <div className="flex mb-[20px]">
              <label className="w-[120px]">Name book</label>
              <Input
                placeholder="Name"
                value={nameBook}
                onChange={e => setNameBook(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[120px]">PushlishBy</label>
              <Input
                placeholder="PushlishBy"
                value={publishedBy}
                onChange={e => setPublishedBy(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[120px]">Pages</label>
              <Input
                placeholder="Pages"
                value={page}
                onChange={e => setPage(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[120px]">Amount</label>
              <Input
                placeholder="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[100px]">PushlishDate</label>
              <DatePicker
                style={{ width: 320 }}
                defaultValue={moment(
                  `${publishedDate}`,
                  'YYYY-MM-DD'
                )}
                onChange={(date, id) => setPublishedDate(id)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[120px]">Author</label>

              {allAuthor.length > 0 && (
                <Select
                  // defaultValue={allAuthor[0]}
                  defaultValue={author}
                  style={{ width: 320 }}
                  onChange={e => setAuthor(e)}
                >
                  {allAuthor.map((author, key) => {
                    return (
                      <Option key={key} value={author}>
                        {author}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[120px]">Price</label>
              <Input
                placeholder="Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[100px]">Genres</label>
              {allGenres.length > 0 && (
                <Select
                  // defaultValue={allGenres[0]}
                  defaultValue={genre}
                  style={{ width: 320 }}
                  onChange={e => setGenre(e)}
                >
                  {allGenres.map((genre, key) => {
                    return (
                      <Option key={key} value={genre}>
                        {genre}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </div>
            <div className="flex mb-[20px]">
              <label className="w-[100px]">Decription</label>
              <TextArea
                showCount
                maxLength={100}
                style={{ height: 120, width: 320 }}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
