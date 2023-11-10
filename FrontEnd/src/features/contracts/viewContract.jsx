import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { PiArrowLeftBold } from 'react-icons/pi'

export default function ViewContract() {
  const router = useRouter()
  const [showUpdateModal, setUpdateModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);


  const updateModal = () => {
    setUpdateModal(true)
  }

  return (
    <div className='w-[96%] text-black'>
      <div className='flex gap-4 items-center pt-16'>
        <PiArrowLeftBold
          size={28}
          className="font-bold cursor-pointer text-4xl mt-2"
          onClick={() => router.back()}
        />
        <div className='funda_bg flex items-center justify-between w-full p-4'>
          <div>
            <h2 className="font-normal text-[32px] leading-10 head2">Contract Writing</h2>
            <span className='text-base pt-2 block'>Category: freelance writing</span>
          </div>
          <div>

            <div className='flex items-center gap-2 mb-2'>
              <span className="py-1 rounded-md bg-white px-2 block w-fit">building</span>
              <button
                onClick={() => updateModal()}
                className='w-fit p-2 rounded-lg bg-[#2A0FB1] hover:bg-[#684df0] text-[#FEFEFE] text-[17px] block leading-[25.5px] tracking-[0.5%]'
              >
                Update Status
              </button>
            </div>

            <div className='flex items-center gap-2'>
              <span>Freelancer Address:</span>
              <span>0x534627</span>
            </div>
          </div>

        </div>
      </div>


      <div className={`mb-0 flex justify-center gap-4 flex-col-reverse md:flex-row items-start pt-10 w-full h-full mx-0 py-0 px-11`}>
        <div className="flex-col gap-4 px-7 py-7 mx-4 sm:mx-0  w-full bg-white my-0 h-fit border-dashed border-2 border-black">
          <div
            className=""
          >
            <div className="flex-col">
              <div>

                <div className="mb-4 flex items-center gap-2">
                  <label
                    className="block text-lg font-bold text-gray-700"
                    htmlFor="card_number"
                  >
                    Client Name:
                  </label>
                  <div className="font-bold text-lg">
                    <span>Status</span>
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <label
                    className="block text-lg font-bold text-gray-700"
                    htmlFor="card_holder_name"
                  >
                    Client Email:
                  </label>
                  <div className="font-bold text-xl">
                    <span>Email</span>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <label
                    className="block text-lg font-bold text-gray-700"
                    htmlFor="card_number"
                  >
                    Freelancer Name:
                  </label>
                  <div className="font-bold text-xl">
                    <span>Name</span>
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <label
                    className="block text-lg font-bold text-gray-700"
                    htmlFor="card_holder_name"
                  >
                    Freelancer Email:
                  </label>
                  <div className="font-bold text-lg">
                    <span>Email</span>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
        <div className="w-full items-center">
          <div>
            <h3 className="font-bold mt-5 text-2xl">
              Price: $1200
            </h3>
            <p className="max-w-[300px] text-lg my-4">
              Description
            </p>
          </div>
        </div>
      </div>

      {/* updateStatusModal */}
      {showUpdateModal && (
        <div>
          <input
            type='checkbox'
            checked
            onChange={() => null}
            id='my_modal_6'
            className='modal-toggle'
          />
          <div className='modal bg-white'>
            <div className='modal-box bg-white'>
              <h3 className='font-bold text-lg'>Change Contract Status!</h3>

              <div className='grid space-y-2 w-full'>
                <div className='flex gap-3 items-center'>
                  <div className='grid space-y-2 w-full'>

                    <select
                      className='select select-bordered mt-6 border-[#696969] w-full max-w-full bg-white'
                    >
                      <option disabled selected>
                        UnderReview
                      </option>
                      <option>Lodge A Dispute</option>
                      <option>Close</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className='w-full flex gap-3 items-center justify-end mt-3'>
                <div className='w-full' onClick={() => setUpdateModal(false)}>
                  <label
                    htmlFor='my_modal_6'
                    className='btn btn-error w-full text-white'
                  >
                    Close!
                  </label>
                </div>
                <button
                  disabled={submitLoading}
                  className='w-full h-full py-3 rounded-lg bg-[#2A0FB1] hover:bg-[#684df0] text-[#FEFEFE] text-[17px] block leading-[25.5px] tracking-[0.5%]'
                >
                  {submitLoading ? (
                    <span className='loading loading-spinner loading-lg'></span>
                  ) : (
                    'Update'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
