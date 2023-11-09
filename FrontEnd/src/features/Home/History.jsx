import React from 'react'
import Layout from '@/components/Layout'
import Image from 'next/image'
import { PiArrowLeftBold } from 'react-icons/pi'
import { useRouter } from 'next/navigation'

const History = () => {
  const router = useRouter()

  return (
    <Layout>
      <div className='pt-20 pb-5'>
        <div className='flex gap-6 mb-10'>
          <PiArrowLeftBold
            size={24}
            className="font-bold cursor-pointer mt-2"
            onClick={() => router.back()}
          />
          <div className='grid space-y-2'>
            <span className='tracking-[0.08px] text-3xl'>Transaction History</span>
          </div>
        </div>

        {[1, 2, 3].map((i, j) => (
          <div key={j} className='mb-6 p-4 transaction-card w-full'>
            <div className='w-full min-w-[305px]'>
              <div className='flex items-center justify-between w-full text-base text-[#696969] grotesk_font gap-2'>
                <span>16th October</span>
                <span className=''>Credit</span>
              </div>

              <div className='flex'>
                <div className='flex items-center w-full gap-4 mt-8'>
                  <div className='border border-2 border-[#696969] rounded-full items-center flex justify-center w-10 h-10 p-1'>
                    <Image
                      src="/circle_next.svg"
                      alt={""}
                      className="object-cover w-full"
                      width={20}
                      height={20}
                    />
                  </div>

                  <div className='grid'>
                    <span className='font-bold text-lg'>Transfers</span>
                    <span className='text-[14px]'>Shopping</span>
                  </div>
                </div>
                <div className='block text-end w-full gap-4 mt-8'>
                  <span className='block text-end font-bold text-lg'>$47.00</span>
                  <span className='text-[14px]'>From wu33u....s6tr5</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default History