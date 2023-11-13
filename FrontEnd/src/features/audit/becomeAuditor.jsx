/** @format */
'use client';
import Auth from '@/app/auth/Auth';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { auditorAddress } from '@/app/auth/contractAddress';
import auditAbi from '@/app/auth/abi/audit.json';
import { CgProfile } from 'react-icons/cg';

export default function BecomeAuditor() {
  const { providerRead, providerWrite } = Auth();
  const { address, isConnected } = useAccount();
  const [auditorDetails, setAuditorDetails] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const getAuditorDetails = async () => {
      setLoadingPage(true);
      try {
        const contract = new ethers.Contract(
          auditorAddress,
          auditAbi,
          providerRead
        );
        const details = await contract.getAuditorByAddress(address);
        setAuditorDetails(details);
        setLoadingPage(false);
      } catch (error) {
        console.error('Error fetching auditor details:', error);
        setLoadingPage(false);
      }
    };

    if (isConnected) {
      getAuditorDetails();
    }
  }, [address, isConnected]);

  return (
    <main>
      <section className='mt-20'>
        {loadingPage && <span>Loading</span>}
        {auditorDetails && auditorDetails.isConfirmed ? (
          <div className='flex justify-center items-center'>
            <div className='flex flex-col justify-center max-w-xs p-6 shadow-md rounded-xl sm:px-12 bg-[#0978e0cb] text-white'>
              <CgProfile className='w-32 h-32 mx-auto rounded-full' />
              <div className='space-y-4 text-center divide-y divide-gray-700'>
                <div className='my-2 space-y-1'>
                  <h2 className='text-xl font-semibold capitalize sm:text-2xl'>
                    {`${auditorDetails.category} gigs: ${Number(
                      auditorDetails.currentGigs
                    )}`}
                  </h2>
                  <p className='px-5 text-xs sm:text-base text-white'>
                    {auditorDetails.email}
                  </p>
                  <div className='text-white bg-lime-500 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>
                    Confirmed
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Link
              href='/audits/create'
              className='w-full flex funda_bg rounded-2xl cursor-pointer'
            >
              <div className='w-[90%] mx-auto py-3 flex justify-between items-center '>
                <h2 className='text-black text-[20px] font-bold head2 leading-[26px] tracking-[1.3%] mt-[20px]'>
                  Become an Auditor
                </h2>
                <div className=''>
                  <img
                    src='./Transfer.png'
                    alt=''
                    className='w-[48px] h-[48px]'
                  />
                </div>
              </div>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
