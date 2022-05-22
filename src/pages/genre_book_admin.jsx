import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DeletedGenreTable from '../component/genre/deleted_genre_table'
import GenreTable from '../component/genre/genre_table'
import {
  getAllAuthor,
  getAllGenres,
  getDeletedGenres
} from '../redux/api_request'

function GenreManage() {
  const genreState = useSelector(state => state.genre)
  const dispatch = useDispatch()
  const [openGenreTable, setOpenGenreTable] = useState(true)
  const [openDeletedTable, setOpenDeletedTable] = useState(false)

  useEffect(() => {
    const fetchGenresData = async () => {
      const asyncGetGenre = getAllGenres(dispatch)
      const asyncGetAuthor = getAllAuthor(dispatch)
      const asyncGetDeletedGenre = getDeletedGenres(dispatch)
      await Promise.all([asyncGetAuthor, asyncGetGenre, asyncGetDeletedGenre])
    }

    fetchGenresData()
  }, [])
  return (
    <>
      {genreState.loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full  bg-gray-400 bg-opacity-30 flex justify-center items-center z-10">
          <Spin
            spinning={genreState.loading}
            size="large"
            tip="Loading..."
          ></Spin>
        </div>
      )}

      <div className="px-10 py-4 flex flex-col items-center space-y-4 relative">
        <div className="w-full flex-col items-start space-y-1">
          <div
            className="flex flex-row w-fit items-center space-x-2 text-xl font-semibold cursor-pointer"
            onClick={() => {
              setOpenGenreTable(!openGenreTable)
            }}
          >
            <span>Tất cả thể loại</span>
            {openGenreTable ? <MinusOutlined /> : <PlusOutlined />}
          </div>
          {openGenreTable && <GenreTable />}
        </div>

        <div className="w-full flex-col items-start space-y-1">
          <div
            className="flex flex-row w-fit items-center space-x-2 text-xl font-semibold cursor-pointer"
            onClick={() => {
              setOpenDeletedTable(!openDeletedTable)
            }}
          >
            <span>Thùng rác</span>
            {openDeletedTable ? <MinusOutlined /> : <PlusOutlined />}
          </div>
          {openDeletedTable && <DeletedGenreTable />}
        </div>
      </div>
    </>
  )
}

export default GenreManage
