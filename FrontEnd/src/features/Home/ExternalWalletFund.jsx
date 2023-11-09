import Layout from '@/components/Layout'
import { Modal } from '@/components/Modal'
import React, { useState } from 'react'
import { PiArrowLeftBold } from 'react-icons/pi'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { ethers } from 'ethers'
import Auth from '@/app/auth/Auth'
import childAbi from "@/app/auth/abi/child.json";
import ERC20ABI from '@/app/auth/abi/Erc20ABI.json'
import { tokenAddress } from '@/app/auth/contractAddress'

const ExternalWalletFund = () => {
  const router = useRouter()
  const [showModal, setShowModal] = useState()
  const { childAddress, provider, address } = Auth();
  const [amountVal, setAmountVal] = useState()
  const [sending, setSending] = useState(false)

  const setModal = () => {
    if (Number(amountVal) < 0 || amountVal === undefined || amountVal === "") {
      toast.error('Invalid amount');
      return;
    }
    setShowModal(true)
  }

  //fund external wallet
  const fundWallet = async () => {
    try {
      setSending(true)
      const ChildContract = new ethers.Contract(
        childAddress,
        childAbi,
        provider.getSigner()
      );
      const token = new ethers.Contract(
        tokenAddress,
        ERC20ABI,
        provider.getSigner()
      );

      const approve = await token.approve(childAddress, Number(amountVal * 1000000))

      const app = await approve.wait();
      console.log(app)
      const tx = await ChildContract.depositFund(Number(amountVal))

      const txResponse = await tx.wait();
      toast.success("transaction successful")
      setShowModal(false)
      // console.log(txResponse.error);

    } catch (error) {
      setSending(false)
      toast.error(error.revert ? error.revert : "transaction failed")
      console.log(error)
    }
  }

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
              <span className='text-[#0F4880] text-lg mb-2 block'>External Wallet</span>
              <span className='grotesk_font text-[17px]'>From external wallet address</span>
              <span className='grotesk_font text-[17px]'>Fee-1% Automatically deducted</span>
            </div>

            <div className="flex items-center bg-white w-fit pl-[10px] py-1 gap-4 mt-2">
              <p className="font-normal head2 text-[20px] leading-[32px]">$</p>
              <input type="text" value={amountVal} onChange={(e) => setAmountVal(e.target.value)} placeholder="0.00" className="head2 w-[100px] text-[20px] placeholder:text-black font-bold outline-none" />
            </div>

            <button onClick={() => setModal()} className='px-4 h-fit py-2 rounded-xl flex items-center gap-1 text-[white] bg-[#0F4880]'>
              {sending ? "Sending" : "Send"}
            </button>

          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal &&
        <Modal sending={sending} amount={amountVal} setShowModal={setShowModal} Fund={fundWallet} />
      }
    </Layout>
  )
}

export default ExternalWalletFund