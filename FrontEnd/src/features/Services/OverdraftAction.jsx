import React, { useState } from 'react'
import Layout from '@/components/Layout'
import { PiArrowLeftBold } from 'react-icons/pi'
import { useRouter, useSearchParams } from 'next/navigation'
import { getEightPercent } from '@/utils'
import { toast } from 'react-toastify'
import { ethers } from 'ethers'
import Auth from '@/app/auth/Auth'
import childAbi from "@/app/auth/abi/child.json";

const OverdraftAction = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const [amountVal, setAmountVal] = useState()
  const { childAddress, provider } = Auth()
  const [sending, setSending] = useState(false)

  const overdraftAct = async (e) => {
    if (amountVal === undefined) {
      toast.error('Invalid amount');
      return;
    }
    setSending(true);
    try {
      e.preventDefault();

      const ChildContract = new ethers.Contract(
        childAddress,
        childAbi,
        provider.getSigner()
      );

      if (type === "repay") {
        const tx = await ChildContract.payback();
        await tx.wait();
        setSending(false)
        toast.success("Transaction successful")
      }
      else {
        const tx = await ChildContract.lend(Number(amountVal) * 1000000);
        await tx.wait();
        setSending(false)
        toast.success("Transaction successful")

      }
    } catch (error) {
      setSending(false)
      toast.error(error?.reason ? error.reason : 'Transaction Failed')
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className='py-20 pb-5'>
        <div className='flex gap-6 text-black'>
          <PiArrowLeftBold
            size={24}
            className="font-bold cursor-pointer mt-2"
            onClick={() => router.back()}
          />
          <span className='tracking-[0.08px] text-3xl'>{type === "repay" ? "Overdraft Repayment" : "Apply for Overdraft"}</span>
        </div>

        <div className="grid space-y-3 md:space-y-0 md:flex md:items-center gap-5 w-full mb-5 mt-14">
          <div className='grid space-y-2 w-full'>
            <label>{type === "repay" ? "Amount to Repay" : "Amount to Request"}</label>
            <div className="flex items-center mt-4 border rounded-lg">
              <p className="head2 text-[24px] pl-2 leading-[32px] tracking-[1.3%] font-normal ">
                $
              </p>
              <input
                type="text"
                placeholder="0.00"
                value={amountVal}
                onChange={(e) => setAmountVal(e.target.value)}
                className="text-[20px] head2 input bg-white text-black w-full focus:outline-none outline-none"
              />
            </div>
          </div>

          {type === "repay" ?
            <div className='grid space-y-2 w-full'>
              <label>Pay from</label>
              <select className="select select-bordered w-full max-w-full bg-white">
                <option disabled selected>Select Option?</option>
                <option>Basic Account</option>
                <option>External Wallet</option>
              </select>
            </div> :
            <div className='flex items-center justify-between bg-[#D2E9FF] p-3 w-full rounded-lg'>
              <div className='flex flex-col justify-between gap-2'>
                <span>Interest</span>
                <span className='font-bold text-black text-lg'>${amountVal !== undefined && getEightPercent(amountVal)} (8%)</span>
              </div>
              <div className='flex flex-col justify-between gap-2'>
                <span>Total Due</span>
                <span className='font-bold text-black text-lg'>${amountVal !== undefined && (amountVal + getEightPercent(amountVal))}</span>
              </div>
            </div>
          }


        </div>
        <div className="flex justify-center">
          <button
            onClick={overdraftAct}
            className="w-[360px] h-[58px] rounded-lg bg-[#0F4880] text-[#FEFEFE] text-[17px] leading-[25.5px] tracking-[0.5%] mt-[80px] "
          >
            {sending ? "Processing" : "Continue"}
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default OverdraftAction