import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { PiArrowLeftBold } from 'react-icons/pi';

export default function ViewAudit() {
  const router = useRouter();

  const [progress, setProgress] = useState([0, 0, 0, 0]);

  const handleBoxClick = (index) => {
    // Create a new array to represent the updated progress
    const newProgress = Array(4).fill(0);

    // Set the progress status of the clicked box to 100%
    newProgress[index] = 100;

    setProgress(newProgress);
  };
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
          <div className='flex'>
            {progress.map((percentage, index) => (
              <div
                key={index}
                className='w-1/4 p-2 cursor-pointer '
                onClick={() => handleBoxClick(index)}
              >
                <div className='relative h-10 bg-gray-200 flex justify-center items-center'>
                  <div className='text-center mt-2'>{20 + index * 20}</div>
                  <div
                    className='absolute h-full bg-blue-500 '
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
