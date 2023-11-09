import React from 'react'
import Layout from '@/components/Layout'
import WalletId from "@/components/WalletId"
import { PiArrowLeftBold } from 'react-icons/pi'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'


const FundingSource = () => {
  const router = useRouter()

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
            <span className='tracking-[0.08px] text-3xl'>Funding Source</span>
            <span className='text-base'>Select one of the funding sources and proceed</span>
          </div>
        </div>

        <WalletId type="fund" />

        <div className='mt-8 sm:mt-20 mb-10'>
          <span className='font-bold text-lg'>Fund From</span>
          <div className='flex justify-between gap-8 w-full'>
            {[1, 2].map((i, j) => (
              <div key={j} className='fund_from_card mt-6 p-4 w-full'>
                <div className='w-full flex items-center justify-between min-w-[305px]'>
                  <div>
                    <div className='items-center flex justify-center w-14 h-14 p-1 mb-6'>
                      <Image
                        src={i === 1 ? "/hashtag.svg" : "/Frame 108.svg"}
                        alt={""}
                        className="object-cover w-full"
                        width={20}
                        height={20}
                      />
                    </div>
                    <span className='font-bold text-lg'>{i === 1 ? "External Wallet" : "Own Account"}</span>
                  </div>
                  {i === 1}
                  <Link href={i === 1 ? "/home/fund/external_wallet" : "/home/fund/own_account"} className='w-10 h-10 p-1'>
                    <Image
                      src="/circle_arrow_left.svg"
                      alt={""}
                      className="object-cover w-full"
                      width={20}
                      height={20}
                    />
                  </Link>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default FundingSource