import React from 'react'
import FundHeader from '../contracts/components/FundHeader'
import TokenTransfer from '../contracts/components/TokenTransfer'
import Layout from '@/components/Layout'

const Withdraw = () => {
  return (
    <Layout>
      <FundHeader title="SpendNest Basic Account" type="home" />
      {/* Token Transfer */}
      <div className="mt-[76px]">
        <TokenTransfer btnText="Withdraw" type="home" />
      </div>
    </Layout>
  )
}

export default Withdraw