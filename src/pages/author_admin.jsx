import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AuthorTable from '../component/author/author_table'
import DeleteAuthorTable from '../component/author/deleted_author_table'
import { getAllAuthor, getDeletedAuthor } from '../redux/api_request'

function AuthorManage() {
  const authorState = useSelector(state => state.author)
  const dispatch = useDispatch()
  const [openAuthorTable, setOpenAuthorTable] = useState(true)
  const [openDeletedTable, setOpenDeletedTable] = useState(false)

  useEffect(() => {
    const fetchGenresData = async () => {
      const asyncGetAuthor = getAllAuthor(dispatch)
      const asyncGetDeletedAuthor = getDeletedAuthor(dispatch)
      await Promise.all([asyncGetAuthor, asyncGetDeletedAuthor])
    }

    fetchGenresData()
  }, [])
  return (
    <>
      {authorState.loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full  bg-gray-400 bg-opacity-30 flex justify-center items-center z-10">
          <Spin spinning={authorState.loading} size="large" tip="Loading..."></Spin>
        </div>
      )}

      <div className="px-10 py-4 flex flex-col items-center space-y-4 relative">
        <div className="w-full flex-col items-start space-y-1">
          <div
            className="flex flex-row w-fit items-center space-x-2 text-xl font-semibold cursor-pointer"
            onClick={() => {
              setOpenAuthorTable(!openAuthorTable)
            }}
          >
            <span>Tất cả thể loại</span>
            {openAuthorTable ? <MinusOutlined /> : <PlusOutlined />}
          </div>
          {openAuthorTable && <AuthorTable />}
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
          {openDeletedTable && <DeleteAuthorTable />}
        </div>
      </div>
    </>
  )
}

export default AuthorManage
