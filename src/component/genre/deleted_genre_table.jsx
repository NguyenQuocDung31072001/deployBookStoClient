import { Pagination } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import DeletedGenreRow from './deleted_genre_row'
import GenreTableHead from './genre_table_head'
import InsertAndFindRow from './filter_genre_row'
import { DeleteFilled } from '@ant-design/icons'

function DeletedGenreTable() {
  const deletedGenres = useSelector(state => state.genre.deletedGenres)
  const [genresRenderData, setGenresRenderData] = useState([])
  const [sort, setSort] = useState({ field: '_id', value: 1 })
  const [filter, setFilter] = useState({
    _id: '',
    name: '',
    description: ''
  })
  const [page, setPage] = useState({
    total: deletedGenres.length,
    current: 1,
    pageSize: 5
  })

  const changePage = newPage => {
    const _page = { ...page, current: newPage }
    setPage(_page)
  }

  useEffect(() => {
    let _currentPage = page.current
    if (deletedGenres.length % page.pageSize == 0 && page.total > deletedGenres.length)
      _currentPage--
    const _page = {
      ...page,
      current: _currentPage,
      total: deletedGenres.length
    }
    setPage(_page)
  }, [deletedGenres])

  const sortDataRender = dataRender => {
    const _genresRenderData = [...dataRender]
    _genresRenderData.sort((genre1, genre2) => {
      if (genre1[sort.field] <= genre2[sort.field]) return -1 * sort.value
      else return 1 * sort.value
    })
    setGenresRenderData(_genresRenderData)
  }

  const filterDataRender = () => {
    if (deletedGenres) {
      const filterField = Object.getOwnPropertyNames(filter)
      const _genresRenderData = [].concat(deletedGenres).filter(genre => {
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
  }, [filter, deletedGenres])

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
            Thùng rác
            <DeleteFilled style={{ marginLeft: '0.5rem', paddingTop: '0.25rem' }} />
          </>
        }
      />
      <tbody>
        <InsertAndFindRow changeFilter={changeFilter} />
        {genresRenderData
          .slice((page.current - 1) * page.pageSize, page.current * page.pageSize)
          .map((genre, index) => (
            <DeletedGenreRow key={genre._id} genre={genre} />
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

export default DeletedGenreTable
