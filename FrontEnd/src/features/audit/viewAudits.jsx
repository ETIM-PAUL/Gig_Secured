import { useRouter } from 'next/navigation';
import React from 'react';
import { PiArrowLeftBold } from 'react-icons/pi';

export default function ViewAudit() {
  const router = useRouter();
  return (
    <div className='w-[96%] text-black'>
      <div className='flex gap-4 items-center pt-16'>
        <PiArrowLeftBold
          size={28}
          className='font-bold cursor-pointer text-4xl mt-2'
          onClick={() => router.back()}
        />
        <div className='funda_bg flex items-center justify-between w-full p-4'>
          <div>
            <h2 className='font-normal text-[32px] leading-10 head2'>
              Contract Writing
            </h2>
            <span className='text-base pt-2 block'>
              Category: freelance writing
            </span>
          </div>
          <div>
            <span className='py-1 rounded-md bg-white px-2 mb-2 block w-fit'>
              building
            </span>
            <div className='flex items-center gap-2'>
              <span>Freelancer Address:</span>
              <span>0x534627</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mb-0 flex justify-center gap-4 flex-col-reverse md:flex-row items-start pt-10 w-full h-full mx-0 p-0`}
      >
        <div className='w-full items-center'>
          <p className='max-w-[300px] text-2xl my-4'>Description</p>
          <div>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Aspernatur, ratione architecto ullam numquam corporis consequuntur
            iure voluptatibus a praesentium voluptas ex, dicta delectus libero
            veritatis magni rem quae molestias nostrum. Earum quae aperiam hic
            deserunt, accusantium assumenda nemo maiores odit libero cupiditate
            in quam voluptates delectus nihil nisi quis voluptatibus culpa
            deleniti. Assumenda iusto accusantium ex odit porro itaque iure.
          </div>
        </div>
      </div>
    </div>
  );
}
