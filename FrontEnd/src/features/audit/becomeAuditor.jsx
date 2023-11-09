/** @format */
'use client';
import Auth from '@/app/auth/Auth';
import React, { useState } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function BecomeAuditor() {
  const { address } = Auth();
  const [contracts, setContracts] = useState([1, 2, 3]);

  return (
    <main>
      <section className='mt-20 '>
        <div className='flex justify-end items-center w-full'>
          <button
            type='button'
            class='text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
          >
            Confirmed
          </button>
          <button
            type='button'
            class='text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
          >
            Not Confirmed
          </button>
        </div>
        <Link
          href='/audits/create'
          className='w-full flex funda_bg rounded-2xl cursor-pointer'
        >
          <div className='w-[90%] mx-auto py-3 flex justify-between items-center '>
            <h2 className='text-[20px] font-bold head2 leading-[26px] tracking-[1.3%]'>
              Become an Auditor
            </h2>
            <div className=''>
              <img src='./Transfer.png' alt='' className='w-[48px] h-[48px]' />
            </div>
          </div>
        </Link>
        <div className='my-10 flex gap-6 flex-wrap'>
          {contracts.map((item, index) => (
            <div
              key={index}
              className='card w-96 bg-white border shadow-md border-black flex-grow text-black'
            >
              <div className='card-body'>
                <h2 className='card-title'>Writing Fiction Story!</h2>
                <p>
                  Write Five(5) chapters, with each having at least 2000 words
                  about any fiction story{' '}
                </p>
                <div className='card-actions justify-end'>
                  <Link href={`/audits/view?id=${index + 1}`}>
                    <button className='btn'>More Details</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
