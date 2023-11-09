"use client"
import FundHeader from './FundHeader'
import BetweenAccTransferForm from './BetweenAccTransferForm'
export default function BetweenHome() {
  return (
    <main>
      <FundHeader />
      <div className="mt-[76px]">
        <BetweenAccTransferForm />
      </div>
    </main>
  )
}
