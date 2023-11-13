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
  }, []);

  return (
    <main>
      <section className='mt-20 '>
        {loadingPage ? (
          <div className='text-center h-full'>
            <div role='status'>
              <svg
                aria-hidden='true'
                className='inline w-32 h-32 text-gray-200 animate-spin dark:text-gray-300 fill-[#0E4980]'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
              <span class='sr-only'>Loading...</span>
            </div>
          </div>
        ) : (
          <div>
            {auditorDetails && !loadingPage ? (
              <div className='flex justify-center items-center'>
                <div className='flex flex-col justify-center max-w-xs p-6 shadow-md rounded-xl sm:px-12 funda_bg text-[#0E4980]'>
                  <CgProfile className='w-32 h-32 mx-auto rounded-full' />
                  <div className='space-y-4 text-center divide-y divide-gray-700'>
                    <div className='my-2 space-y-1'>
                      {auditorDetails && auditorDetails.isConfirmed ? (
                        <div className='text-[#0E4980] bg-lime-500  font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 '>
                          Confirmed
                        </div>
                      ) : (
                        <div className='text-black bg-white font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2'>
                          Confirmation Pending
                        </div>
                      )}
                      <h2 className='text-lg font-semibold capitalize sm:text-xl'>
                        {`${auditorDetails.category} gigs: ${Number(
                          auditorDetails.currentGigs
                        )}`}
                      </h2>
                      <p className='px-5 text-xs sm:text-base text-[#0E4980]'>
                        {auditorDetails.email}
                      </p>
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
          </div>
        )}
      </section>
    </main>
  );
}
