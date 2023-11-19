import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { PiArrowLeftBold } from 'react-icons/pi';

export default function ViewAudit() {
  const router = useRouter();

  const [progress, setProgress] = useState([0, 0, 0, 0]);
  const [inputValue, setInputValue] = useState(0);
  const [showUpdateModal, setUpdateModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [status, setStatus] = useState(1);

  const handleBoxClick = (index) => {
    const newProgress = Array(4).fill(0);
    newProgress[index] = 100;
    setProgress(newProgress);

    // Set the input value to the corresponding value (e.g., 20, 40, 60, 80)
    setInputValue(20 + index * 20);
  };

  const updateModal = () => {
    setUpdateModal(true);
  };

  const updateStatus = async () => {
    if (contractDetails[5] === '0x') {
      setUpdateModal(false);
      toast.error('You need to sign before you can update status');
      return;
    }

    const signer = await providerWrite.getSigner();

    const contractWrite = new ethers.Contract(contract, childAbi, signer);

    if (status === 'null' || status === null) {
      setErrorMessage('Please select a status');
      return;
    }
    setSubmitLoading(true);
    try {
      // sendEmail();
      const estimatedGas = await contractWrite.updateGig.estimateGas(
        id,
        status
      );
      let tx = await contractWrite.updateGig(id, status);
      tx.wait().then(async (receipt) => {
        if (receipt && receipt.status == 1) {
          // transaction success.
          toast.success('Secured Contract status updated successfully');
          setSubmitLoading(false);
          setUpdateModal(false);
          const newArray = contractDetails;
          newArray[9] = status;
          setContractDetails(newArray);
        }
      });
    } catch (e) {
      if (e.data && contractWrite) {
        const decodedError = contractWrite.interface.parseError(e.data);
        toast.error(`Transaction failed: ${decodedError?.name}`);
      } else {
        console.log(`Error in contract:`, e);
      }
      setSubmitLoading(false);
      setUpdateModal(false);
    }
    setErrorMessage('');
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
            <button
              onClick={() => updateModal()}
              className='w-fit p-2 rounded-lg bg-[#2A0FB1] hover:bg-[#684df0] text-[#FEFEFE] text-base block leading-[25.5px] tracking-[0.5%]'
            >
              Update Status
            </button>
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
          <button className='btn bg-[#D2E9FF] hover:bg-[#76bbff] text-black border-[#D2E9FFborder w-full mx-2 mt-4 h-10'>
            Complete Audit
          </button>
        </div>
      </div>

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
                      onChange={(e) => setStatus(e.target.value)}
                      className='select select-bordered mt-6 border-[#696969] w-full max-w-full bg-white'
                    >
                      <option value={1}>Building</option>
                      <option value={2}>Completed</option>
                      <option value={4}>Dispute</option>
                    </select>
                    <p className='text-field-error italic text-red-500'>
                      {errorMessage.length > 0 && errorMessage}
                    </p>
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
                  onClick={() => updateStatus()}
                  className='w-full h-full py-3 rounded-lg bg-[#2A0FB1] hover:bg-[#684df0] text-[#FEFEFE] text-[17px] block leading-[25.5px] tracking-[0.5%]'
                >
                  {submitLoading ? (
                    <span className='loading loading-spinner loading-base'></span>
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
