'use client'
import Layout from '@/components/Layout'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { PiArrowLeftBold } from 'react-icons/pi'
import { LiaGreaterThanSolid } from 'react-icons/lia'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Auth from '@/app/auth/Auth'
import { ethers } from 'ethers'
import childAbi from "@/app/auth/abi/child.json";
import { formatUSDT } from '@/utils'

export default function PersonalSavings() {
  const router = useRouter()
  const [pSavings, setPSavings] = useState()
  const { childAddress, provider } = Auth()

  useEffect(() => {
    if ((Object.keys(provider)).length > 0) {
      const ChildContract = new ethers.Contract(childAddress, childAbi, provider?.getSigner());
      const personalSavings = async () => {
        const tx = await ChildContract.myPersonalSavings();
        setPSavings(tx)
        console.log(tx)
      }
      personalSavings();
    } else {
      router.push('/');
    }
  }, [])

  return (
    <Layout>
      <div className='pt-20 pb-5'>
        <div className='flex gap-6'>
          <PiArrowLeftBold
            size={24}
            className="font-bold cursor-pointer mt-2"
            onClick={() => router.back()}
          />
          <span className='tracking-[0.08px] text-3xl'>Personal Savings</span>
        </div>

        <div className='flex gap-4 mt-8 sm:mt-20 mb-10'>
          <div className=" personal_savings_card p-6 w-full md:w-[50%]">
            <div className='w-14 h-14 p-1'>
              <Image
                src="/savings/personal_savings.svg"
                alt={""}
                className="object-cover w-full"
                width={20}
                height={20}
              />
            </div>
            <p className='text-[#2A0FB1] text-lg font-bold mb-2'>Personal Savings</p>
            <span className='text-[#2A0FB1] text-xl font-bold'>${pSavings !== "" && formatUSDT(pSavings)}</span>
          </div>
          <div className="personal_savings_card p-6 flex flex-col justify-between w-full md:w-[50%]">
            <span className='text-base tracking-[0.085px] leading-5'>Flexible savings for emergencies, Free transfers, withdrawals.</span>
            <span className='grotesk_font text-base tracking-[0.085px] leading-5'>You can add money from your basic account to this wallet instantly.</span>
          </div>
        </div>

        {/* personal cards */}
        <div className='block md:flex justify-between gap-4'>
          <div className="bg-[#2A0FB1] flex w-full justify-between items-center text-[#fefefe] grotesk_font p-4 rounded-[8px]">
            <div className='grid space-y-3'>
              <span className='text-[17px]'>Add Fund</span>
              <span className='text-[10px] mono_font'>From Basic Account</span>
            </div>
            <Link href={`/savings/personal/funds?type=add`} className='border bg-white border-[#fff] rounded-full items-center flex justify-center w-10 h-10'>
              <LiaGreaterThanSolid
                size={24}
                className="font-bold text-black cursor-pointer"
              /></Link>
          </div>

          <div className="bg-[#fefefe] border border-[#2A0FB1] text-[#2A0FB1] flex w-full justify-between items-center grotesk_font p-4 rounded-[8px]">
            <div className='grid space-y-3'>
              <span className='text-[17px]'>Withdraw</span>
              <span className='text-[10px] mono_font'>To Basic Account</span>
            </div>
            <Link href={`/savings/personal/funds?type=withdraw`} className='border bg-[#2A0FB1] border-[#2A0FB1] rounded-full items-center flex justify-center w-10 h-10'>
              <LiaGreaterThanSolid
                size={24}
                className="font-bold text-[#fefefe] cursor-pointer"
              /></Link>
          </div>
        </div>

        {/* History savings */}
        <div className='pt-10'>
          <span className='font-bold text-lg'>Recent Activities</span>

          {[1, 2].map((i, j) => (
            <div key={j} className='my-6 p-4 transaction-card w-full'>
              <div className='w-full min-w-[305px]'>
                <div className='flex items-center justify-between w-full text-base text-[#696969] grotesk_font gap-2'>
                  <span>16th October</span>
                </div>

                <div className='flex items-center'>
                  <div className='flex items-center w-full gap-4'>
                    <div className='w-10 h-10 p-1'>
                      <Image
                        src="/savings/personal_savings.svg"
                        alt={""}
                        className="object-cover w-full"
                        width={20}
                        height={20}
                      />
                    </div>

                    <div className='grid'>
                      <span className='text-[14px]'>{i === 1 ? "Amount Added" : "Withdrawal Made"}</span>
                    </div>
                  </div>
                  <div className='block text-end w-full gap-4'>
                    <span className={`${i === 1 ? "text-[#00C11F]" : "text-[#C10000]"} block text-end font-normal text-lg`}>{i === 1 ? "$47.00" : "$20.23"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
