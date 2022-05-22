import * as React from 'react'
import { Pagination } from 'antd'

export default function PaginationFunc({limit,total,handlePageChange}) {
  return (
    <div>
      <Pagination defaultCurrent={1} pageSize={limit} total={total} onChange={handlePageChange}/>
    </div>
  )
}
