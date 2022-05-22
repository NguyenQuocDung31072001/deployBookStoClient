import { Pagination } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import AuthorRow from './author_row'
import AuthorTableHead from './author_table_head'
import FilterAuthorRow from './filter_author_row'

function AuthorTable() {
  const authors = useSelector(state => state.author.authors)
  const [authorsRenderData, setAuthorRenderData] = useState([])
  const [filter, setFilter] = useState({ _id: '', fullName: '', birthDate: '', address: '' })
  const [sort, setSort] = useState({ field: 'fullName', value: 1 })
  const [openInsertRow, setOpenInsertRow] = useState(false)
  const [page, setPage] = useState({
    total: authors.length,
    current: 1,
    pageSize: 5
  })

  const changePage = newPage => {
    const _page = { ...page, current: newPage }
    setPage(_page)
  }

  useEffect(() => {
    let _currentPage = page.current
    if (authors.length % page.pageSize == 0 && page.total > authors.length) _currentPage--
    const _page = {
      ...page,
      current: _currentPage,
      total: authors.length
    }
    setPage(_page)
    setPage(_page)
  }, [authors])

  const sortDataRender = dataRender => {
    const _authorsRenderData = [...dataRender]
    _authorsRenderData.sort((genre1, genre2) => {
      if (genre1[sort.field] <= genre2[sort.field]) return -1 * sort.value
      else return 1 * sort.value
    })
    setAuthorRenderData(_authorsRenderData)
  }

  const filterDataRender = () => {
    if (authors) {
      const filterField = Object.getOwnPropertyNames(filter)
      const _authorsRenderData = [].concat(authors).filter(author => {
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
  }, [filter, authors])

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
    <table className="w-full text-lg font-bold ">
      <AuthorTableHead changeSort={changeSort} sort={sort} tableName="Tất cả tác giả" />
      <tbody>
        <FilterAuthorRow changeFilter={changeFilter} openInsertRow={() => setOpenInsertRow(true)} />
        {openInsertRow && <AuthorRow removeInsertRow={() => setOpenInsertRow(false)} />}
        {authorsRenderData.map((author, index) => (
          <AuthorRow key={author._id} author={author} />
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

export default AuthorTable
