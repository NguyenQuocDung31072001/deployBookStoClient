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

export default function BookBoughtChart() {
  const [data, setData] = useState()
  useEffect(() => {
    ;(async function () {
      let topBook = await getTopBook(10, 'historicalSold')
      let _book = []
      topBook.forEach(book => {
        _book.push({
          name: book.name,
          bought: book.historicalSold
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
        <YAxis />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="bought" fill="#2ecc71" />
      </BarChart>
    </ResponsiveContainer>
  )
}
