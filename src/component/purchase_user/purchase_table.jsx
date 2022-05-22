import { BookFilled } from '@ant-design/icons'
import { Col, Image, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { getUserOrders } from '../../redux/api_request'
import PurchaseContainer from './puschase_container'

function PurchaseTable(props) {
  const { account, status } = props
  const [purchases, setPurchases] = useState([])

  useEffect(() => {
    async function fetchPurchases() {
      const data = await getUserOrders(account, status)
      setPurchases(data)
    }
    fetchPurchases()
  }, [])

  return (
    <div className="flex flex-col space-y-10">
      {purchases.map((item, index) => {
        return <PurchaseContainer key={`purchase_${index}`} purchase={item} />
      })}
    </div>
  )
}

export default PurchaseTable
