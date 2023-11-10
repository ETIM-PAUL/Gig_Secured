import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { PiArrowLeftBold } from 'react-icons/pi'
import { FiEdit } from 'react-icons/fi'

export default function ViewContract() {
  const router = useRouter();
  const [showUpdateModal, setUpdateModal] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDescriptionModal, setDescriptionModal] = useState(false);
  const [showFreelancerModal, setFreelancerModal] = useState(false);
  const [showDeadlineModal, setFreelancerDeadlineModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [updateContractTitleLoading, setUpdateContractTitleLoading] = useState(false);
  const [updateContractCategoryLoading, setUpdateContractCategoryLoading] = useState(false);
  const [updateDescriptionLoading, setDescriptionLoading] = useState(false);
  const [updateDeadlineLoading, setUpdateDeadlineLoading] = useState(false);


  const updateModal = () => {
    setUpdateModal(true);
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
            <div className='flex gap-2'>
              <h2 className="font-normal text-[32px] leading-10 head2">Contract Writing</h2>
              <button onClick={() => setShowTitleModal(true)}>
                <FiEdit />
              </button>
            </div>
            <div className='flex items-center mt-2 gap-2'>
              <span className='text-base block'>Category: freelance writing</span>
              <button onClick={() => setShowCategoryModal(true)}>
                <FiEdit />
              </button>
            </div>
          </div>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <span className='py-1 rounded-md bg-white px-2 block w-fit'>
                building
              </span>
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

      <div
        className={`mb-0 flex justify-center gap-4 flex-col-reverse md:flex-row items-start pt-10 w-full h-full mx-0 py-0 px-11`}
      >
        <div className='flex-col gap-4 px-7 py-7 mx-4 sm:mx-0  w-full bg-white my-0 h-fit border-dashed border-2 border-black'>
          <div className=''>
            <div className='flex-col'>
              <div>
                <div className='mb-4 flex items-center gap-2'>
                  <label
                    className="block text-lg font-bold text-gray-700"
                    htmlFor="card_holder_name"
                  >
                    Deadline:
                  </label>
                  <div className="font-bold text-xl">
                    <span>22nd March, 2024</span>
                  </div>
                  <button onClick={() => setFreelancerDeadlineModal(true)}>
                    <FiEdit />
                  </button>
                </div>
                <div className='mb-4 flex items-center gap-2'>
                  <label
                    className='block text-lg font-bold text-gray-700'
                    htmlFor='card_holder_name'
                  >
                    Client Email:
                  </label>
                  <div className="font-bold text-xl">
                    <span>natachi@gmail.com</span>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <label
                    className='block text-lg font-bold text-gray-700'
                    htmlFor='card_holder_name'
                  >
                    Freelancer Email:
                  </label>
                  <div className="font-bold text-lg">
                    <span>mitong@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full items-center'>
          <div>
            <h3 className="font-bold mt-5 text-2xl">
              Price: $1200
            </h3>
            <div className='flex gap-2 mt-5'>
              <h3 className='font-bold text-2xl'>Description</h3>
              <button onClick={() => setDescriptionModal(true)}>
                <FiEdit />
              </button>
            </div>
            <p className="max-w-[300px] text-lg mb-4">
              Lorem ipsum cartablaca
            </p>
            <h3 className='font-bold mt-5 text-2xl'>Price: $1200</h3>
            <p className='max-w-[300px] text-lg my-4'>Description</p>
          </div>
        </div>
      </div>


      {/* updateDeadline */}
      {showDeadlineModal && (
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
              <h3 className='font-bold text-lg'>Change New Contract Deadline In the Future!</h3>
              {/* <p className='font-bold text-xs text-red-500 py-2'>You can't change when freelancer has began work!</p> */}
              <div className='grid space-y-2 w-full mt-1'>
                <div className='flex gap-3 items-center'>
                  <div className='grid space-y-2 w-full'>

                    <input
                      // {...register('name')}
                      type='date'
                      className='input input-bordered  border-[#696969] w-full max-w-full bg-white'
                    />
                  </div>
                </div>
              </div>
              <div className='w-full flex gap-3 items-center justify-end mt-3'>
                <div className='w-full' onClick={() => setFreelancerDeadlineModal(false)}>
                  <label
                    htmlFor='my_modal_6'
                    className='btn btn-error w-full text-white'
                  >
                    Close!
                  </label>
                </div>
                <button
                  disabled={updateDeadlineLoading}
                  className='w-full h-full py-3 rounded-lg bg-[#2A0FB1] hover:bg-[#684df0] text-[#FEFEFE] text-[17px] block leading-[25.5px] tracking-[0.5%]'
                >
                  {updateDeadlineLoading ? (
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

      {/* updateTitle */}
      {showTitleModal && (
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
              <h3 className='font-bold text-lg'>Change Contract Title!</h3>
              {/* <p className='font-bold text-xs text-red-500 py-2'>You can't change when freelancer has began work!</p> */}
              <div className='grid space-y-2 w-full mt-1'>
                <div className='flex gap-3 items-center'>
                  <div className='grid space-y-2 w-full'>

                    <input
                      // {...register('name')}
                      type='text'
                      placeholder='Please Enter Your Email'
                      className='input input-bordered  border-[#696969] w-full max-w-full bg-white'
                    />
                  </div>
                </div>
              </div>
              <div className='w-full flex gap-3 items-center justify-end mt-3'>
                <div className='w-full' onClick={() => setShowTitleModal(false)}>
                  <label
                    htmlFor='my_modal_6'
                    className='btn btn-error w-full text-white'
                  >
                    Close!
                  </label>
                </div>
                <button
                  disabled={updateContractTitleLoading}
                  className='w-full h-full py-3 rounded-lg bg-[#2A0FB1] hover:bg-[#684df0] text-[#FEFEFE] text-[17px] block leading-[25.5px] tracking-[0.5%]'
                >
                  {updateContractTitleLoading ? (
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

      {/* updateCategory */}
      {showCategoryModal && (
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
              <h3 className='font-bold text-lg'>Change Contract Category!</h3>
              {/* <p className='font-bold text-xs text-red-500 py-2'>You can't change when freelancer has began work!</p> */}
              <div className='grid space-y-2 w-full mt-1'>
                <div className='flex gap-3 items-center'>
                  <div className='grid space-y-2 w-full'>

                    <input
                      // {...register('name')}
                      type='text'
                      placeholder='Please Enter Your Email'
                      className='input input-bordered  border-[#696969] w-full max-w-full bg-white'
                    />
                  </div>
                </div>
              </div>
              <div className='w-full flex gap-3 items-center justify-end mt-3'>
                <div className='w-full' onClick={() => setShowCategoryModal(false)}>
                  <label
                    htmlFor='my_modal_6'
                    className='btn btn-error w-full text-white'
                  >
                    Close!
                  </label>
                </div>
                <button
                  disabled={updateContractCategoryLoading}
                  className='w-full h-full py-3 rounded-lg bg-[#2A0FB1] hover:bg-[#684df0] text-[#FEFEFE] text-[17px] block leading-[25.5px] tracking-[0.5%]'
                >
                  {updateContractCategoryLoading ? (
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

      {/* updateDescription */}
      {showDescriptionModal && (
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
              <h3 className='font-bold text-lg'>Change Contract Description!</h3>
              {/* <p className='font-bold text-xs text-red-500 py-2'>You can't change when freelancer has began work!</p> */}
              <div className='grid space-y-2 w-full mt-1'>
                <div className='flex gap-3 items-center'>
                  <div className='grid space-y-2 w-full'>

                    <textarea
                      type='text'
                      placeholder='Short Description'
                      className='input input-bordered bg-white border-[#696969] w-full max-w-full h-full'
                      rows={4}
                      cols={4}
                    />
                  </div>
                </div>
              </div>
              <div className='w-full flex gap-3 items-center justify-end mt-3'>

                <div className='w-full' onClick={() => setDescriptionModal(false)}>
                  <label
                    htmlFor='my_modal_6'
                    className='btn btn-error w-full text-white'
                  >
                    Close!
                  </label>
                </div>
                <button
                  disabled={updateDescriptionLoading}
                  className='w-full h-full py-3 rounded-lg bg-[#2A0FB1] hover:bg-[#684df0] text-[#FEFEFE] text-[17px] block leading-[25.5px] tracking-[0.5%]'
                >
                  {updateDescriptionLoading ? (
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

      {/* updateFreelancer */}
      {showFreelancerModal && (
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
              <h3 className='font-bold text-lg'>Change Gig Contract Freelancer!</h3>
              {/* <p className='font-bold text-xs text-red-500 py-2'>You can't change when freelancer has began work!</p> */}
              <div className='grid space-y-2 w-full mt-1'>
                <div className='flex gap-3 items-center'>
                  <div className='grid space-y-2 w-full'>

                    <input
                      // {...register('name')}
                      type='text'
                      placeholder='Please Enter New Freelancer Email'
                      className='input input-bordered  border-[#696969] w-full max-w-full bg-white'
                    />
                    <input
                      // {...register('name')}
                      type='text'
                      placeholder='Please Enter New Freelancer Address'
                      className='input input-bordered  border-[#696969] w-full max-w-full bg-white'
                    />
                  </div>
                </div>
              </div>
              <div className='w-full flex gap-3 items-center justify-end mt-3'>
                <div className='w-full' onClick={() => setFreelancerModal(false)}>
                  <label
                    htmlFor='my_modal_6'
                    className='btn btn-error w-full text-white'
                  >
                    Close!
                  </label>
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
        </div>
      )}

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
                    <select className='select select-bordered mt-6 border-[#696969] w-full max-w-full bg-white'>
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
  );
}
