import React from 'react'
import Layout from '@/components/Layout'
import Image from 'next/image'
import Link from 'next/link'

export default function ServicesFeatures() {
  return (
    <Layout>
      <div className='pt-20 pb-5'>
        <Link href="/services/overdraft" className='flex justify-between items-center bg-blue-400 text-white p-4 rounded-md'>
          <div className='flex flex-col gap-2 justify-between'>
            <span className='text-[20px]'>Overdraft</span>
            <span className='text-[17px] w-[50%]'>Spend when your account balance is low and repay whenever you get paid</span>
          </div>
          <div className='w-32 h-32 p-1'>
            <Image
              src="/overdraft.svg"
              alt={""}
              className="object-cover w-full"
              width={20}
              height={20}
            />
          </div>
        </Link>
        <span></span>
      </div>
    </Layout>
  )
}
