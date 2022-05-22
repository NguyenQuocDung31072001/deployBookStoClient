import { Pagination } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import GenreRow from './genre_row'
import InsertAndFindRow from './filter_genre_row'
import GenreTableHead from './genre_table_head'
import { TableOutlined } from '@ant-design/icons'

function GenreTable() {
  const genres = useSelector(state => state.genre.genres)
  const [genresRenderData, setGenresRenderData] = useState([])
  const [sort, setSort] = useState({ field: '_id', value: 1 })
  const [insertRow, setInsertRow] = useState(false)
  const [filter, setFilter] = useState({
    _id: '',
    name: '',
    description: ''
  })
  const [page, setPage] = useState({
    total: genres.length,
    current: 1,
    pageSize: 5
  })

  const changePage = newPage => {
    const _page = { ...page, current: newPage }
    setPage(_page)
  }

  useEffect(() => {
    let _currentPage = page.current
    if (genres.length % page.pageSize == 0 && page.total > genres.length) _currentPage--
    const _page = {
      ...page,
      current: _currentPage,
      total: genres.length
    }
    setPage(_page)
    setPage(_page)
  }, [genres])

  const sortDataRender = dataRender => {
    const _genresRenderData = [...dataRender]
    _genresRenderData.sort((genre1, genre2) => {
      if (genre1[sort.field] <= genre2[sort.field]) return -1 * sort.value
      else return 1 * sort.value
    })
    setGenresRenderData(_genresRenderData)
  }

  const filterDataRender = () => {
    if (genres) {
      const filterField = Object.getOwnPropertyNames(filter)
      const _genresRenderData = [].concat(genres).filter(genre => {
        if (!filter._id && !filter.name && !filter.description) return true
        else {
          let match = true
          filterField.forEach(field => {
            if (
              filter[field] &&
              genre[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1
            )
              match = false
          })
          return match
        }
      })
      sortDataRender(_genresRenderData)
    }
  }

  useEffect(() => {
    sortDataRender(genresRenderData)
  }, [sort])

  useEffect(() => {
    filterDataRender()
  }, [filter, genres])

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
      <GenreTableHead
        sort={sort}
        changeSort={changeSort}
        tableName={
          <>
            Tất cả thể loại{' '}
            <TableOutlined style={{ marginLeft: '0.5rem', paddingTop: '0.25rem' }} />
          </>
        }
      />
      <tbody>
        <InsertAndFindRow changeFilter={changeFilter} openInsertRow={() => setInsertRow(true)} />
        {insertRow && <GenreRow removeInsertRow={() => setInsertRow(false)} />}
        {genresRenderData
          .slice((page.current - 1) * page.pageSize, page.current * page.pageSize)
          .map((genre, index) => (
            <GenreRow key={genre._id} genre={genre} />
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

export default GenreTable
