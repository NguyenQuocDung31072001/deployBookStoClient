import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'

function AuthorTableHead(data) {
  const { changeSort, sort, tableName } = data
  return (
    <thead>
      <tr>
        <th className="text-base font-medium text-center border py-4 ">Chỉnh sửa</th>
        <th className="text-base font-medium text-center border py-4 ">Ảnh</th>
        <HeadCell
          name="fullName"
          title="Họ Tên"
          onClick={() => {
            changeSort('fullName')
          }}
          sort={sort}
        />
        <HeadCell
          name="birthDate"
          title="Ngày sinh"
          onClick={() => {
            changeSort('birthDate')
          }}
          sort={sort}
        />
        <HeadCell
          name="address"
          title="Địa chỉ"
          onClick={() => {
            changeSort('address')
          }}
          sort={sort}
        />
      </tr>
    </thead>
  )
}

function HeadCell(data) {
  const { title, name, onClick, sort } = data
  return (
    <th className="text-base font-medium text-left border py-4 px-2 ">
      <div className="flex flex-row items-center cursor-pointer" onClick={onClick}>
        {title}
        {sort.field == name ? (
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
  )
}

export default AuthorTableHead
