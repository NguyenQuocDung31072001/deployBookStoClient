import { DeleteOutlined, UndoOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { hardDeleteGenre, restoreDeletedGenre } from '../../redux/api_request'
function DeletedGenreRow(data) {
  const { genre, className } = data
  const dispatch = useDispatch()
  const deleteGenre = async () => {
    const confirm = window.confirm(
      'Thể loại sẽ bị xóa hoàn toàn khỏi bộ nhớ hệ thống, bạn có muốn tiếp tục?'
    )
    if (confirm) {
      const result = await hardDeleteGenre(dispatch, genre)
      console.log(result)
    }
  }

  const restoreGenre = async () => {
    console.log('restore')
    const result = await restoreDeletedGenre(dispatch, genre)
    console.log(result)
  }

  return (
    <>
      <tr className={`hover:bg-slate-100 ${className}`}>
        <td className="border">
          <div className="flex flex-row justify-evenly items-center space-x-1 text-lg">
            <button onClick={restoreGenre}>
              <UndoOutlined style={{ color: '#4D96FF' }} />
            </button>
            <button onClick={deleteGenre}>
              <DeleteOutlined style={{ color: '#FF6B6B' }} />
            </button>
          </div>
        </td>
        <td className="border text-base text-gray-700 font-normal py-3 px-2 text-left">
          {genre ? genre._id : ''}
        </td>
        <td className="border text-base text-gray-700 font-normal py-2 px-2 text-left">
          <input
            type="text"
            name="name"
            value={genre.name}
            disabled
            placeholder="Tên thể loại"
            className="disabled:bg-transparent px-2 py-[0.4rem] w-full text-left border-0 outline-none disabled:ring-0"
            readOnly
          />
        </td>
        <td className="border text-base text-gray-700 font-normal py-2 px-2 text-left">
          <input
            type="text"
            name="description"
            value={genre.description}
            disabled
            placeholder="Tên thể loại"
            className="disabled:bg-transparent px-2 py-[0.4rem] w-full text-left border-0 outline-none disabled:ring-0"
            readOnly
          />
        </td>
      </tr>
    </>
  )
}

export default DeletedGenreRow
