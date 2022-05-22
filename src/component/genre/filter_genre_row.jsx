import { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'

function InsertAndFindRow(data) {
  const { changeFilter, openInsertRow } = data
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
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
        <td className="border py-2 px-2 text-left">
          <input
            type="text"
            name="_id"
            value={id}
            onChange={e => {
              setId(e.target.value)
              changeFilter(e)
            }}
            placeholder="ID"
            className="disabled:bg-transparent text-base text-gray-700 font-normal bg-white px-2 py-[0.4rem] w-full text-left border-0 rounded-md outline-none disabled:ring-0 ring-1"
          />
        </td>
        <td className="border py-2 px-2">
          <input
            type="text"
            name="name"
            value={name}
            onChange={e => {
              setName(e.target.value)
              changeFilter(e)
            }}
            placeholder="Tên thể loại"
            className="disabled:bg-transparent text-base text-gray-700 font-normal bg-white px-2 py-[0.4rem] w-full text-left border-0 rounded-md outline-none disabled:ring-0 ring-1 "
            required
          />
        </td>
        <td className="border py-2 px-2">
          <input
            type="text"
            name="description"
            value={description}
            onChange={e => {
              setDescription(e.target.value)
              changeFilter(e)
            }}
            placeholder="Mô tả"
            className="disabled:bg-transparent text-base text-gray-700 font-normal bg-white px-2 py-[0.4rem] w-full text-left border-0 rounded-md outline-none disabled:ring-0 ring-1"
          />
        </td>
      </tr>
    </>
  )
}

export default InsertAndFindRow
