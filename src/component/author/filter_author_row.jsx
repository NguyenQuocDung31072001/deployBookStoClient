import { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'

function FilterAuthorRow(data) {
  const { changeFilter, openInsertRow } = data
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [address, setAddress] = useState('')

  return (
    <>
      <tr className="hover:bg-slate-100">
        <td className="border">
          {openInsertRow && (
            <button className=" pb-2 pt-1 bg-blue-400 rounded-sm w-2/3" onClick={openInsertRow}>
              <PlusOutlined style={{ fontSize: '1.25rem', color: 'white' }} />
            </button>
          )}
        </td>

        <td></td>

        <td className="border py-2 px-2 text-left">
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={e => {
              setFullName(e.target.value)
              changeFilter(e)
            }}
            placeholder="Họ Tên"
            className="disabled:bg-transparent text-base text-gray-700 font-normal bg-white px-2 py-[0.4rem] w-full text-left border-0 rounded-md outline-none disabled:ring-0 ring-1"
          />
        </td>

        <td className="border py-2 px-2">
          <input
            type="text"
            name="birthDate"
            value={birthDate}
            onChange={e => {
              setBirthDate(e.target.value)
              changeFilter(e)
            }}
            placeholder="Ngày sinh"
            className="disabled:bg-transparent text-base text-gray-700 font-normal bg-white px-2 py-[0.4rem] w-full text-left border-0 rounded-md outline-none disabled:ring-0 ring-1 "
            required
          />
        </td>

        <td className="border py-2 px-2">
          <input
            type="text"
            name="address"
            value={address}
            onChange={e => {
              setAddress(e.target.value)
              changeFilter(e)
            }}
            placeholder="Địa chỉ"
            className="disabled:bg-transparent text-base text-gray-700 font-normal bg-white px-2 py-[0.4rem] w-full text-left border-0 rounded-md outline-none disabled:ring-0 ring-1"
          />
        </td>
      </tr>
    </>
  )
}

export default FilterAuthorRow
