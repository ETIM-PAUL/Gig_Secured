'use client'
import Auth from '@/app/auth/Auth'
import Layout from '@/components/Layout'
import { ethers } from 'ethers'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import childAbi from "@/app/auth/abi/child.json";
import { useRouter } from 'next/navigation'
import { formatUSDT } from '@/utils'

export default function SavingsFeatures() {
  const [pSavings, setPSavings] = useState("")
  const router = useRouter()
  const { childAddress, provider } = Auth()

  useEffect(() => {
    if (Object.values(provider).length > 0) {
      const ChildContract = new ethers.Contract(
        childAddress,
        childAbi,
        provider?.getSigner()
      );
      const personalSavings = async () => {
        const tx = await ChildContract.myPersonalSavings();
        setPSavings(tx)
      }
      personalSavings()
    } else { router.push("/") }
  }, []);

  return (
    <Layout>
      <div className='pt-20 pb-5'>
        <div className='flex gap-2'>
          <Link href="/savings/personal" className="inline-block personal_savings_card p-6 hover:cursor-pointer">
            <div className='w-14 h-14 p-1'>
              <Image
                src="/savings/personal_savings.svg"
                alt={""}
                className="object-cover w-full"
                width={20}
                height={20}
              />
            </div>
            <p className='text-[#2A0FB1] text-lg font-bold'>Personal Savings</p>
            <span className='grotesk_font text-[base] tracking-[0.085px] leading-5 my-2 block'>Flexible savings for emergencies, Free transfers, withdrawals</span>
            <span className='text-[#2A0FB1] text-xl font-bold'>${pSavings !== "" && formatUSDT(pSavings)}</span>
          </Link>
          <Link href="/savings/club" className="inline-block savings_club p-6 hover:cursor-pointer">
            <div className='w-14 h-14 p-1'>
              <Image
                src="/savings/saving_hands.svg"
                alt={""}
                className="object-cover w-full"
                width={20}
                height={20}
              />
            </div>
            <p className='text-[#C27810] text-lg font-bold'>Savings Club</p>
            <span className='grotesk_font text-[base] tracking-[0.085px] leading-5 my-2 block'>Reach your unique savings goals with others by locking funds to avoid temptation</span>
            <span className='text-[#C27810] text-xl font-bold'>$588.00</span>
          </Link>
        </div>
      </div>
    </Layout>
  )
}
