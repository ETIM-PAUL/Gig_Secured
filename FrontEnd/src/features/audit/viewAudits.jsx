import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { PiArrowLeftBold } from 'react-icons/pi';

export default function ViewAudit() {
  const router = useRouter();

  const [progress, setProgress] = useState([0, 0, 0, 0]);
  const [inputValue, setInputValue] = useState(0);

  const handleBoxClick = (index) => {
    const newProgress = Array(4).fill(0);
    newProgress[index] = 100;
    setProgress(newProgress);

    // Set the input value to the corresponding value (e.g., 20, 40, 60, 80)
    setInputValue(20 + index * 20);
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
        <div className='w-full'>
          <div>
            <h2 className='max-w-[300px] text-2xl my-4'>Description</h2>
            <p className='text-sm'>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Consectetur nemo, earum quae error et odio, dolorum esse vero
              mollitia natus aperiam aliquam voluptatum neque itaque! Laboriosam
              corrupti nostrum suscipit inventore. Neque aspernatur facere
              excepturi sequi rerum minima id at magnam officia tempora,
              doloremque quaerat natus odio similique quas! Fugiat natus fuga
              soluta? Laudantium totam distinctio, impedit mollitia nostrum
              adipisci aperiam?
            </p>
          </div>
          <div className='flex items-center mt-4'>
            {progress.map((percentage, index) => (
              <div
                key={index}
                className='w-1/4 p-2 cursor-pointer'
                onClick={() => handleBoxClick(index)}
              >
                <div className='relative h-10 bg-gray-200 flex justify-center items-center'>
                  <div
                    className='absolute h-full bg-blue-500 flex justify-center items-center'
                    style={{ width: `${percentage}%` }}
                  >
                    <div className='text-center text-white z-10'>
                      {20 + index * 20}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <input
              type='number'
              className='h-10 bg-gray-200 px-4'
              placeholder='1'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <button className='border w-full mx-2 mt-4 h-10'>
            Complete Audit
          </button>
        </div>
      </div>
    </div>
  );
}
