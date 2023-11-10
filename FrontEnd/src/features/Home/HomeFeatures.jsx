"use client"
import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { explore_cards, glasses } from '@/utils'
import Link from 'next/link'
import Image from 'next/image'
import Auth from '@/app/auth/Auth'
import childAbi from '@/app/auth/abi/child.json'
import { ethers } from 'ethers'
import { useRouter } from 'next/navigation'

export default function HomeFeatures() {
  const { childAddress, provider, createWallet, isLoading, isConnected } = Auth();
  const [accountDetails, setAccountDetails] = useState([])
  const router = useRouter()

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
      <div className='pt-20 pb-5'>
        <div className='md:flex'>
          <div>
            <div className="flex flex-wrap gap-10 text-white">
              {explore_cards.map((card, index) => (
                <div key={index} style={{ backgroundImage: `url(${card.bgCustom})` }} className=" bg-no-repeat bg-cover p-4 rounded-[8px] w-96 h-[200px] flex flex-grow flex-col items-between justify-between ">
                  <Link href={card.direct} className="flex justify-end py-1">
                    <button className='bg-[#CDCFDE] py-1 px-4 rounded-lg text-[#0F4880]'>Explore &#8594;</button>
                  </Link>
                  <div className='text-white px-3'>
                    <span className='text-xl block mb-1.5 font-bold'>{card?.name}</span>
                    <span className="sm:text-2xl grotesk font-bold leading-[25.5px] tracking-[0.085px] pt-4 pb-2 text-2xl">{(index === 0 || index === 2) ? 2 : ""}</span>
                  </div>
                </div>
              ))}
            </div>


            {/* Video_Opportunities */}
            <div className="block md:flex gap-10 my-8 text-white">
              <div className='block md:w-[50%] w-full border rounded-2xl bg-gray-500 pb-2'>
                <video
                  controls={true}
                  playsInline muted
                  loop
                  id="myVideo"
                  className={`m-auto bg-cover w- object-cover`}
                >
                  <source src="./spendNest.mp4" type="video/mp4" />
                  <source src="./spendNest.mp4" type="video/ogg" />
                  your browser does not support the video tag.
                </video>
                <span className='text-black w-full px-4 py-2 mt-2 block'>
                  Watch our goal getter video
                </span>
              </div>
              <div className="md:w-[50%] w-full">
                <span className='text-lg font-bold text-[#000]'>Opportunities For you</span>
                <div className='text-black mt-6'>
                  <div className='border flex px-4 rounded-md h-[130px] w-full'>
                    <div className='py-4 w-[80%] flex flex-col justify-between'>
                      <span className='w-[70%]'>Become an Auditor and settle disputes</span>
                      <Link href={`/app?source=`} className="w-fit pt-3 block">
                        <button className='py-1 px-4 rounded-lg text-[white] text-[17px] bg-[#0F4880]'>Start Now</button>
                      </Link>
                    </div>

                    <div className='border-l rounded-full flex justify-center'>
                      <Image
                        src="/flying_money.svg"
                        alt={""}
                        className="object-cover w-fit px-auto pl-4"
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                </div>
                <div className='text-black mt-3'>
                  <div className='border flex px-4 rounded-md h-[130px] w-full'>
                    <div className='py-4 w-[80%] flex flex-col justify-between'>
                      <span>Overdraft your account</span>
                      <Link href={'services//overdraft'} className="w-fit pt-3 block">
                        <button className='py-1 px-4 rounded-lg text-[white] text-[17px] bg-[#0F4880]'>Start Now</button>
                      </Link>
                    </div>

                    <div className='border-l rounded-full flex justify-center'>
                      <Image
                        src="/flying_money.svg"
                        alt={""}
                        className="object-cover w-fit px-auto pl-4"
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </Layout>
  )
}
