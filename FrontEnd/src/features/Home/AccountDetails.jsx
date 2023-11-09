import React from 'react'
import Layout from '@/components/Layout'
import WalletId from "@/components/WalletId"
import { PiArrowLeftBold } from 'react-icons/pi'
import { useRouter } from 'next/navigation'

const AccountDetails = () => {
  const router = useRouter()
  return (
    <Layout>
      <div className='pt-20 pb-5'>
        <div className='flex items-center gap-6 w-'>
          {/* <span className='text-5xl pr-3'>&#8592;</span> */}
          <PiArrowLeftBold
            size={24}
            className={`font-bold cursor-pointer`}
            onClick={() => router.back()}
          />
          <div className='grid space-y-2'>
            <span className='tracking-[0.08px] text-3xl'>Account</span>

          </div>
        </div>

        <WalletId type="account" />
      </div>
    </Layout>
  )
}

export default AccountDetails