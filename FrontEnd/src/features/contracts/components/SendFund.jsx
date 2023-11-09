
"use client"

import TokenTransfer from './TokenTransfer'
import FundHeader from './FundHeader'

export default function SendFund() {

  return (
    <main>
      <FundHeader title="Transfers" />
      {/* Token Transfer */}
      <div className="mt-[76px]">
        <TokenTransfer btnText="Send Fund" />
      </div>
    </main>
  )
}
