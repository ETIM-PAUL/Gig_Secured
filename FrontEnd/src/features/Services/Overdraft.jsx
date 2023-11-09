import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { PiArrowLeftBold } from 'react-icons/pi'
import { useRouter } from 'next/navigation'
import { overdraft_cards } from '@/utils'
import childAbi from '@/app/auth/abi/child.json'
import { TermsModal } from '@/components/TermsModal'
import Image from 'next/image'
import Link from 'next/link'
import Auth from '@/app/auth/Auth'
import { ethers } from 'ethers'

const Overdraft = () => {
  const router = useRouter()
  const [showTerms, setShowTerms] = useState(false)
  const { childAddress, provider } = Auth();
  const [accountDetails, setAccountDetails] = useState([])

  useEffect(() => {
    if ((Object.keys(provider)).length > 0) {
      const contract = new ethers.Contract(childAddress, childAbi, provider?.getSigner());
      const readAccountDetails = async () => {
        const tx = await contract.viewAccount();
        setAccountDetails(tx);
      }
      readAccountDetails();
    } else {
      router.push('/');
    }
  }, [provider])

  return (
    <Layout>
      <div className='py-20 pb-5'>
        <div className='flex gap-6 text-black'>
          <PiArrowLeftBold
            size={24}
            className="font-bold cursor-pointer mt-2"
            onClick={() => router.back()}
          />
          <span className='tracking-[0.08px] text-3xl'>Overdraft</span>
        </div>

        {Number(accountDetails[0]) > 0 &&
          <>
            <div className={`flex flex-wrap gap-10 mt-10 md:mt-16`}>
              {overdraft_cards.map((card, index) => (
                <div key={index} className={`p-4 rounded-[8px] min-w-[400px] h-[200px] flex flex-col items-between justify-between text-[${card?.color}] border border-[${card?.color}]`}>
                  <span className='text-base block mb-1.5 font-bold'>{card?.name}</span>
                  <span className="text-lg md:text-2xl grotesk font-bold leading-[25.5px] tracking-[0.085px] mt-4 mb-2">${card?.amount}</span>
                </div>
              ))}
            </div><div className='my-12 space-y-2'>
              <p className="text-base">Click <span className='underline text-black hover:cursor-pointer' onClick={() => setShowTerms(true)}>here</span> to know how our overdraft works</p>
            </div><div>
              <span className='font-bold text-lg text-black'>Quick Overdraft</span>
              <div className={`flex flex-wrap gap-10 mt-4`}>
                <Link href="/services/overdraft/overdraft_action?type=apply" className={`p-4 rounded-[8px] min-w-[400px] h-[200px] flex flex-col items-between justify-between text-[#2A0FB1] border border-[#2A0FB1] bg-[#D2E9FF]`}>
                  <div className='w-14 h-14 p-1'>
                    <Image
                      src="/dollar_note.svg"
                      alt={""}
                      className="w-full"
                      width={10}
                      height={10} />
                  </div>
                  <span className="text-lg grotesk_font font-bold leading-[25.5px] tracking-[0.085px] mt-4 mb-2">Apply For Overdraft</span>
                </Link>
                <Link href="/services/overdraft/overdraft_action?type=repay" className={`p-4 rounded-[8px] min-w-[400px] h-[200px] flex flex-col items-between justify-between text-[#2A0FB1] border border-[#2A0FB1] bg-[#D2E9FF]`}>
                  <div className='w-14 h-14 p-1'>
                    <Image
                      src="/money_flow.svg"
                      alt={""}
                      className="w-full"
                      width={80}
                      height={80} />
                  </div>
                  <span className="text-lg grotesk_font font-bold leading-[25.5px] tracking-[0.085px] mt-4 mb-2">Repay Overdraft</span>
                </Link>
              </div>
            </div><span className='font-bold text-lg text-black mt-12 block'>Overdraft Record</span><div className="my-4 block text-center">
              <span className="w-full md:w-[100px]">
                You have <span className="font-bold">No Overdraft</span> record yet. It will show here once you borrow
              </span>
            </div>
          </>
        }
      </div>

      {Number(accountDetails[0]) === 0 &&
        <div className='w-[80%] mx-auto px-1 pb-20 block'>
          <Image
            src="/not_eligible.svg"
            alt={""}
            className="w-full h-full"
            width={80}
            height={80} />

          <button
            onClick={() => router.push("/savings")}
            className="w-[360px] h-[58px] mx-auto block rounded-lg bg-[#0F4880] text-[#FEFEFE] text-[17px] leading-[25.5px] tracking-[0.5%] my-[80px] "
          >
            Proceed to Savings
          </button>
        </div>
      }

      {showTerms &&
        <TermsModal setShowModal={setShowTerms} />
      }
    </Layout>
  )
}

export default Overdraft