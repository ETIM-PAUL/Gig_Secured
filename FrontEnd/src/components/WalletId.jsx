"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import Auth from "@/app/auth/Auth";
import copy from "copy-to-clipboard";
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/auth/Context';

const WalletId = ({ type }) => {
  // const { childAddress, disconnect, isConnected } = useAppContext();
  const [copied, setCopied] = useState(false)
  const router = useRouter()


  // disconnect

  const copyToClipboard = () => {
    let copyText = "0x287265";
    let isCopy = copy(copyText);

    if (isCopy) {
      setCopied(true);
      toast.success("Wallet Address Copied For Fund Transfer");
    }
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  // useEffect(() => {
  //   if (isConnected == false) {
  //     router.push("/")
  //   }
  // }, [isConnected])

  return (
    <div>
      <div className='mt-8 sm:mt-20 mb-6'>
        <span className='font-bold text-lg'>Account Information</span>
      </div>

      <div className='fund_wallet_id_bg p-4 flex items-center justify-between'>
        <div>
          <span className='text-[#696969] block mb-2'>Wallet ID</span>
          <span className='text-[17px] block'>0x762GTE28263586</span>
        </div>

        {type === "fund" ?
          <button onClick={copyToClipboard} className='px-4 h-fit py-1 rounded-2xl flex items-center gap-1 text-[#0F4880] bg-white'>
            {copied ? "Copied" : "Copy"}
            <Image
              src="/solar_copy-linear.svg"
              alt={""}
              className="object-cover w-full"
              width={0}
              height={0}
            />
          </button>
          :
          <button onClick={() => disconnect()} className='px-4 h-fit py-2 rounded-xl flex items-center gap-1 text-[white] bg-[#0F4880]'>
            Disconnect Wallet
          </button>
        }
      </div>
    </div>
  )
}

export default WalletId