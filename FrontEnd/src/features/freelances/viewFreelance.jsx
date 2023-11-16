import Auth from '@/app/auth/Auth';
import { ethers } from 'ethers';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PiArrowLeftBold } from 'react-icons/pi';
import childAbi from '@/app/auth/abi/child.json'
import factoryAbi from '@/app/auth/abi/factory.json'
import { factoryAddress } from "@/app/auth/contractAddress";
import { formatBlockchainTimestamp, formatStatus, shortenAccount } from '@/utils';
import { toast } from 'react-toastify';

export default function ViewFreelance() {
  const router = useRouter();
  const { providerRead, providerWrite } = Auth();
  const [showUpdateModal, setUpdateModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [signLoading, setSignLoading] = useState(false);
  const searchParams = useSearchParams()
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("")
  const [contractDetails, setContractDetails] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true)

  const id = searchParams.get('id')
  const contract = searchParams.get('contract')

  const updateModal = () => {
    setUpdateModal(true);
  };

  const signContract = async () => {
    setSignLoading(true)
    const signer = await providerWrite.getSigner();
    const contractWrite = new ethers.Contract(contract, childAbi, signer);
    try {

      // Define the corresponding struct type in Solidity
      const myStructType = ["address", "string", "uint", "uint", "uint"];
      const myStructData = [contractDetails[4], contractDetails[0], id, contractDetails[12], contractDetails[7]];

      // Pack the struct data
      const packedData = ethers.solidityPacked(myStructType, myStructData);
      const message = ethers.getBytes(packedData)
      let sig = await signer.signMessage(message);
      console.log(sig)

      // const recoveredSigner = ethers.verifyMessage(ethers.getBytes(packedData), sig);
      // const splitSig = ethers.Signature.from(sig)
      // console.log(ethers.Signature.from(splitSig).serialized)
      // console.log(sig)

      let tx = await contractWrite.freeLancerSign("0x9d4eF81F5225107049ba08F69F598D97B31ea644", sig, id);
      tx.wait().then(async (receipt) => {
        if (receipt && receipt.status == 1) {
          // transaction success.
          toast.success("Contract signature successful");
          setSignLoading(false)
          const newArray = contractDetails;
          newArray[5] = sig;
          setContractDetails(newArray)
        }
      });

    } catch (e) {
      if (e.data && contractWrite) {
        const decodedError = contractWrite.interface.parseError(e.data);
        toast.error(`Transaction failed: ${decodedError?.name}`)
        console.log(decodedError)
        console.log(contractDetails)
      } else {
        console.log(`Error in contract:`, e);
      }
      setSignLoading(false)
    }
  }

  useEffect(() => {
    const getContractDetail = async () => {
      setLoadingPage(true)
      try {
        const signer = await providerWrite.getSigner();
        const contractWrite = new ethers.Contract(contract, childAbi, signer);
        let tx = await contractWrite.getGig(Number(id));

        const tr = Object.values(tx)
        console.log(tr)
        setContractDetails(tr)
        setLoadingPage(false)

      } catch (e) {
        if (e.data && contractWrite) {
          const decodedError = contractWrite.interface.parseError(e.data);
          toast.error(`Transaction failed: ${decodedError?.name}`)
        } else {
          console.log(`Error in contract:`, e);
        }
        setLoadingPage(false)
      }
    }
    if (!!contract && !!id) {
      getContractDetail();
    }
  }, [])


  const updateStatus = async () => {
    const signer = await providerWrite.getSigner();

    const contractWrite = new ethers.Contract(contract, childAbi, signer);

    if (status === "null" || status === null) {
      setErrorMessage("Please select a status")
      return;
    }
    setSubmitLoading(true);
    try {
      // const estimatedGas = await contractWrite.updateGig.estimateGas(id, status);
      let tx = await contractWrite.updateGig(id, status);
      tx.wait().then(async (receipt) => {
        if (receipt && receipt.status == 1) {
          // transaction success.
          toast.success("Secured Contract status updated successfully")
          setSubmitLoading(false)
          setUpdateModal(false)
          const newArray = contractDetails;
          newArray[9] = status;
          setContractDetails(newArray)
        }
      });
    } catch (e) {
      if (e.data && contractWrite) {
        const decodedError = contractWrite.interface.parseError(e.data);
        toast.error(`Transaction failed: ${decodedError?.name}`)
      } else {
        console.log(`Error in contract:`, e);
      }
      setSubmitLoading(false)
      setUpdateModal(false)
    }
  }

  return (
    <div className='w-[96%] text-black'>
      {(loadingPage && contractDetails.length < 0) &&
        <div role='status' className="flex justify-center mt-10 w-full">
          <svg
            aria-hidden='true'
            className='inline w-24 h-24 text-gray-200 animate-spin dark:text-gray-300 fill-[#0E4980]'
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
          <span className='sr-only'>Loading...</span>
        </div>
      }

      {(!loadingPage && contract && !!contractDetails) &&
        <><div className='flex gap-4 items-center pt-16'>
          <PiArrowLeftBold
            size={28}
            className='font-bold cursor-pointer text-4xl mt-2'
            onClick={() => router.back()} />
          <div className='funda_bg flex items-center justify-between w-full p-4'>
            <div>
              <h2 className='font-normal text-[32px] leading-10 head2'>
                {contractDetails[0]}
              </h2>
              <span className='text-base pt-2 block'>
                Category: {contractDetails[1]}
              </span>
            </div>
            <div>
              <div className='flex items-center gap-2 mb-2'>
                <span className='py-1 rounded-md bg-white px-2 block w-fit'>
                  {formatStatus(contractDetails[9])}
                </span>
                <button
                  onClick={() => updateModal()}
                  className='w-fit p-2 rounded-lg bg-[#2A0FB1] hover:bg-[#684df0] text-[#FEFEFE] text-[17px] block leading-[25.5px] tracking-[0.5%]'
                >
                  Update Status
                </button>
              </div>

              <div className='flex items-center gap-2'>
                <span>Creator Address:</span>
                <span>{shortenAccount(contractDetails[4])}</span>
              </div>
            </div>
          </div>
        </div><div
          className={`mb-0 flex justify-center flex-col-reverse md:flex-row items-start pt-10 w-full h-full mx-0 p-0`}
        >
            <div className='w-full mx-10'>
              <div>
                <h2 className='text-2xl my-4'>Price: ${contractDetails[12] && ethers.formatUnits(contractDetails[12], 6)}0</h2>
              </div>
              <div>
                <h2 className='text-2xl my-4'>Deadline: {formatBlockchainTimestamp(Number(contractDetails[7]))}</h2>
              </div>
              <div>
                <h2 className='text-2xl my-4'>Description</h2>
                <p className='text-sm'>
                  {contractDetails[6]}
                </p>
              </div>

              {contractDetails[5] === "0x" &&
                <button onClick={() => signContract()} className='border mt-4 w-full h-10 btn bg-[#D2E9FF] hover:bg-[#76bbff] text-black border-[#D2E9FF'>
                  Sign Contract
                </button>
              }
            </div>
          </div></>
      }
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
                    <select onChange={(e) => setStatus(e.target.value)} className='select select-bordered mt-6 border-[#696969] w-full max-w-full bg-white'>
                      <option selected>
                        Building
                      </option>
                      <option>Completed</option>
                      <option>Dispute</option>
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
