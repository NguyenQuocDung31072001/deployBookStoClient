import { Pagination } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { DeleteFilled } from '@ant-design/icons'
import DeletedAuthorRow from './deleted_author_row'
import AuthorTableHead from './author_table_head'
import FilterAuthorRow from './filter_author_row'

function DeleteAuthorTable() {
  const deletedAuthors = useSelector(state => state.author.deletedAuthors)
  const [authorsRenderData, setAuthorRenderData] = useState([])
  const [filter, setFilter] = useState({ _id: '', fullName: '', birthDate: '', address: '' })
  const [sort, setSort] = useState({ field: 'fullName', value: 1 })
  const [page, setPage] = useState({
    total: deletedAuthors.length,
    current: 1,
    pageSize: 5
  })

  const changePage = newPage => {
    const _page = { ...page, current: newPage }
    setPage(_page)
  }

  useEffect(() => {
    let _currentPage = page.current
    if (deletedAuthors.length % page.pageSize == 0 && page.total > deletedAuthors.length)
      _currentPage--
    const _page = {
      ...page,
      current: _currentPage,
      total: deletedAuthors.length
    }
    setPage(_page)
    setPage(_page)
  }, [deletedAuthors])

  const sortDataRender = dataRender => {
    const _authorsRenderData = [...dataRender]
    _authorsRenderData.sort((genre1, genre2) => {
      if (genre1[sort.field] <= genre2[sort.field]) return -1 * sort.value
      else return 1 * sort.value
    })
    setAuthorRenderData(_authorsRenderData)
  }

  const filterDataRender = () => {
    if (deletedAuthors) {
      const filterField = Object.getOwnPropertyNames(filter)
      const _authorsRenderData = [].concat(deletedAuthors).filter(author => {
        if (!filter._id && !filter.fullName && !filter.birthDate && !filter.address) return true
        else {
          let match = true
          filterField.forEach(field => {
            if (
              filter[field] &&
              author[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1
            )
              match = false
          })
          return match
        }
      })
      sortDataRender(_authorsRenderData)
    }
  }

  useEffect(() => {
    sortDataRender(authorsRenderData)
  }, [sort])

  useEffect(() => {
    filterDataRender()
  }, [filter, deletedAuthors])

  const changeSort = field => {
    if (field === sort.field) setSort({ ...sort, value: -1 * sort.value })
    else {
      setSort({ field: field, value: 1 })
    }
  }

  const changeFilter = e => {
    const newFilter = { ...filter, [e.target.name]: e.target.value }
    setFilter(newFilter)
  }

  return (
    <table className="w-full">
      <AuthorTableHead
        sort={sort}
        changeSort={changeSort}
        tableName={
          <>
            Thùng rác
            <DeleteFilled style={{ marginLeft: '0.5rem', paddingTop: '0.25rem' }} />
          </>
        }
      />
      <tbody>
        <FilterAuthorRow changeFilter={changeFilter} />
        {authorsRenderData
          .slice((page.current - 1) * page.pageSize, page.current * page.pageSize)
          .map((author, index) => (
            <DeletedAuthorRow key={author._id} author={author} />
          ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={4} className="py-2">
            <Pagination
              defaultCurrent={1}
              current={page.current}
              total={page.total}
              defaultPageSize={page.pageSize}
              onChange={changePage}
            />
          </td>
        </tr>
      </tfoot>
    </table>
  )
}

export default DeleteAuthorTable
