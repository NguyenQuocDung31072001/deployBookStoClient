import { useState } from 'react'
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Avatar, Image } from 'antd'
import { useDispatch } from 'react-redux'
import { createNewAuthor, softDeleteAuthor, updateAuthor } from '../../redux/api_request'
function AuthorRow(data) {
  const { author, removeInsertRow, className } = data
  const [defaultData, setDefaultData] = useState(author)
  const [fullName, setFullName] = useState(author ? author.fullName : '')
  const [address, setAddress] = useState(author ? author.address : '')
  const [birthDate, setBirthDate] = useState(author ? author.birthDate : '')
  const [avatarUrl, setAvatarUrl] = useState(author ? author.avatarUrl : '')
  const [avatarBase64, setAvatarBase64] = useState(null)
  const [isEditing, setIsEditing] = useState(author ? false : true)
  const [required, setRequired] = useState(false)
  const dispatch = useDispatch()

  const DeleteGenre = async () => {
    const confirm = window.confirm('Bạn có chắc chắn xóa tác giả này này')
    if (confirm) {
      const result = await softDeleteAuthor(dispatch, author)
      console.log(result)
    }
  }

  const CancelEdit = () => {
    if (defaultData && author) {
      setFullName(defaultData.fullName)
      setAddress(defaultData.address)
      setBirthDate(defaultData.birthDate)
      setAvatarUrl(defaultData.avatarUrl)
    } else if (removeInsertRow) {
      removeInsertRow()
    }
  }

  const Edit = () => {
    setIsEditing(true)
  }

  const SaveEdit = async () => {
    setRequired(true)
    if (!author) {
      if (fullName && birthDate && address && avatarBase64) {
        const newAuthor = {
          fullName: fullName,
          birthDate: birthDate,
          address: address,
          avatarBase64: avatarBase64
        }
        console.log(newAuthor)
        const result = await createNewAuthor(dispatch, newAuthor)
        if (result) removeInsertRow()
        console.log(result)
      } else {
        console.log('Error')
      }
    } else {
      if (fullName && birthDate && address) {
        const newAuthor = { ...author, fullName: fullName, birthDate: birthDate, address: address }
        if (avatarBase64) newAuthor.avatarBase64 = avatarBase64
        const result = await updateAuthor(dispatch, newAuthor)
        if (result) {
          setIsEditing(false)
          setDefaultData(result)
        }
      } else {
        console.log('Error')
      }
    }
  }

  const changeImage = e => {
    const imageFile = e.target.files[0]
    if (!imageFile) {
      setAvatarBase64(null)
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(imageFile)
    reader.onloadend = () => {
      setAvatarBase64(reader.result)
    }
    reader.onerror = () => {
      console.error('AHHHHHHHH!!')
    }
  }

  return (
    <>
      <tr className="hover:bg-slate-100">
        <td className="border">
          <div className="flex flex-row justify-evenly items-center space-x-1 text-lg">
            {isEditing ? (
              <button onClick={SaveEdit}>
                <CheckOutlined style={{ color: '#4D96FF' }} />
              </button>
            ) : (
              <button onClick={Edit}>
                <EditOutlined style={{ color: '#4D96FF' }} />
              </button>
            )}

            {isEditing ? (
              <button onClick={CancelEdit}>
                <CloseOutlined style={{ color: '#FF6B6B' }} />
              </button>
            ) : (
              <button onClick={DeleteGenre}>
                <DeleteOutlined style={{ color: '#FF6B6B' }} />
              </button>
            )}
          </div>
        </td>

        <td className="border text-base text-gray-700 font-normal relative">
          <label
            htmlFor={author ? `avatar_${author._id}` : 'avatar_newAuthor'}
            className="cursor-pointer"
          >
            <img
              src={avatarBase64 || avatarUrl}
              alt={fullName}
              className="rounded-full w-12 h-12 object-cover"
            />
          </label>
          <input
            type="file"
            name="avatar"
            id={author ? `avatar_${author._id}` : 'avatar_newAuthor'}
            hidden
            onChange={changeImage}
            disabled={!isEditing}
          />
        </td>

        <td className="border text-base text-gray-700 font-normal py-2 px-2">
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Họ và Tên"
            disabled={!isEditing}
            className={`disabled:bg-transparent bg-white px-2 py-[0.4rem] w-full text-left border-0 rounded-md outline-none disabled:ring-0 ring-1 ${
              required && !fullName && 'ring-red-500'
            }`}
          />
        </td>
        <td className="border text-base py-2 px-2">
          <input
            type="date"
            name="birthDate"
            value={birthDate.split('T')[0]}
            onChange={e => setBirthDate(e.target.value)}
            placeholder="Ngày sinh"
            disabled={!isEditing}
            className={`disabled:bg-transparent bg-white px-2 py-[0.4rem] w-full text-left border-0 rounded-md outline-none disabled:ring-0 ring-1 ${
              required && !birthDate && 'ring-red-500'
            }`}
          />
        </td>

        <td className="border text-base py-2 px-2">
          <input
            type="text"
            name="address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Địa chỉ"
            disabled={!isEditing}
            className={`disabled:bg-transparent bg-white px-2 py-[0.4rem] w-full text-left border-0 rounded-md outline-none disabled:ring-0 ring-1 ${
              required && !address && 'ring-red-500'
            }`}
          />
        </td>
      </tr>
    </>
  )
}

export default AuthorRow
