import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { getTopBook } from '../redux/api_request'

export default function RatingChart() {
  const [data, setData] = useState()
  useEffect(() => {
    ;(async function () {
      let topBook = await getTopBook(10, 'rating')
      let _book = []
      topBook.forEach(book => {
        _book.push({
          name: book.name,
          rate: book.rating
        })
      })
      setData(_book)
    })()
    return () => {
      setData()
    }
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
        barSize={40}
      >
        <XAxis dataKey="name" padding={{ left: 40, right: 40 }} />
        <YAxis type="number" ticks={[0,1,2,3,4,5]} domain={[0,5]}/>
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="rate" fill="#e74c3c" />
      </BarChart>
    </ResponsiveContainer>
  )
}
