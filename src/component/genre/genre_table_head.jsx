import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'

function GenreTableHead(data) {
  const { changeSort, sort, tableName } = data
  return (
    <thead>
      <tr>
        <th className="text-base font-medium text-center border py-4 ">Chỉnh sửa</th>
        <th
          className="text-base font-medium text-left border py-4 px-2 "
          onClick={() => {
            changeSort('_id')
          }}
        >
          <div className="flex flex-row items-center cursor-pointer">
            ID
            {sort.field == '_id' ? (
              sort.value > 0 ? (
                <ArrowUpOutlined className="ml-1" />
              ) : (
                <ArrowDownOutlined className="ml-1" />
              )
            ) : (
              ''
            )}
          </div>
        </th>
        <th
          className="text-base font-medium text-left border py-4 px-2 "
          onClick={() => {
            changeSort('name')
          }}
        >
          <div className="flex flex-row items-center cursor-pointer">
            Tên thể loại
            {sort.field == 'name' ? (
              sort.value > 0 ? (
                <ArrowUpOutlined className="ml-1" />
              ) : (
                <ArrowDownOutlined className="ml-1" />
              )
            ) : (
              ''
            )}
          </div>
        </th>
        <th className="text-base font-medium text-left border py-4 px-2">
          <div
            className="flex flex-row items-center cursor-pointer"
            onClick={() => {
              changeSort('description')
            }}
          >
            Mô tả
            {sort.field == 'description' ? (
              sort.value > 0 ? (
                <ArrowUpOutlined className="ml-1" />
              ) : (
                <ArrowDownOutlined className="ml-1" />
              )
            ) : (
              ''
            )}
          </div>
        </th>
      </tr>
    </thead>
  )
}

export default GenreTableHead
