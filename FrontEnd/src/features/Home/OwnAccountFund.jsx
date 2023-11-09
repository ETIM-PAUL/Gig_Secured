import Layout from '@/components/Layout'
import { OwnAccountModal } from '@/components/OwnAccountModal'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PiArrowLeftBold } from 'react-icons/pi'
import { toast } from 'react-toastify'

const OwnAccountFund = () => {
  const router = useRouter()
  const [showModal, setShowModal] = useState()

  return (
    <Layout>
      <div className='pt-20 pb-5'>
        <div className='flex gap-6'>
          <PiArrowLeftBold
            size={24}
            className="font-bold cursor-pointer mt-2"
            onClick={() => router.back()}
          />
          <div className='grid space-y-2'>
            <span className='tracking-[0.08px] text-3xl'>SpendNest Basic Account</span>
            <span className='text-base pt-2'>yrh899kfjryhhgfj948jdj</span>
          </div>
        </div>

        <div className='mt-8 sm:mt-20 mb-10 p-4 transaction-card w-full'>
          <div className='w-full space-y-8 lg:space-y-0 lg:flex items-center md:justify-between min-w-[305px]'>
            <div className='inline-grid text-base text-[#696969] grotesk_font gap-2'>
              <span className='text-[#0F4880] text-lg mb-2 block'>Own Account Wallet</span>
              <span className='grotesk_font text-[17px]'>From basic account to shared account</span>
              <span className='grotesk_font text-[17px]'>Fee-1% Automatically deducted</span>
            </div>

            <button onClick={() => setShowModal(true)} className='px-4 h-fit py-2 rounded-xl flex items-center gap-1 text-[white] bg-[#0F4880]'>
              Send
            </button>

          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal &&
        <OwnAccountModal setShowModal={setShowModal} />
      }
    </Layout>
  )
}

export default OwnAccountFund