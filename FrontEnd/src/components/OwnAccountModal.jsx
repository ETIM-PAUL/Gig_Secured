import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Auth from "@/app/auth/Auth";
import { coins } from '@/utils';
import Image from 'next/image';
import childAbi from "@/app/auth/abi/child.json";
import { toast } from 'react-toastify';
import { ethers } from 'ethers'

export const OwnAccountModal = ({ txnId, amount, setShowModal }) => {
  let [isOpen, setIsOpen,] = useState(true)
  const { childAddress, provider } = Auth();
  const [amountVal, setAmountVal] = useState();
  const [sending, setSending] = useState(false)

  const sendBetweenAcct = async (e) => {
    if (amountVal === undefined) {
      toast.error('Invalid amount');
      return;
    }
    setSending(true);
    try {
      e.preventDefault();

      const ChildContract = new ethers.Contract(
        childAddress,
        childAbi,
        provider.getSigner()
      );

      const tx = await ChildContract.transferBetweenOwnAcct(Number(amountVal) * 1000000);

      const txResponse = await tx.wait();
      console.log(txResponse);
      setSending(false)
      setShowModal(false)
      toast.success("Transaction successful")
    } catch (error) {
      console.log(error)
      setSending(false)
      setShowModal(false)
      toast.error("Transaction failed")
    }
    // console.log(txResponse.error);
  };

  useEffect(() => {
    if ((Object.keys(provider)).length > 0) { } else {
      router.push('/');
    }
  }, [provider])

  return (
    <Transition
      appear
      show={true}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setShowModal(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white py-12 px-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  <div className='flex items-center justify-between'>
                    <span className='orbitron_font text-[28px] font-semibold text-[#0F4880]'>SpendNest</span>
                    <div className='items-center flex justify-center'>
                      {coins.map((coin, i) => (
                        <div key={i} className='w-9 h-9 p-1'>
                          <Image
                            src={coin}
                            alt={"coin"}
                            className="object-cover w-full"
                            width={20}
                            height={20}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Dialog.Title>
                <section className='mt-20'>
                  <div className='relative'>
                    <div className="flex items-center justify-between border-[2px] z-10 rounded-lg py-[14px] px-[15px] border-black relative">
                      <div className="">
                        <p className="font-bold text-[14px] leading-6 head2 tracking-[10%] ">From</p>
                        <div className="flex items-center gap-2 h-[59px] mt-4">
                          <p className="head2 text-[24px] leading-[32px] tracking-[1.3%] font-normal ">$</p>
                          <input type="text" placeholder='0.00' onChange={(e) => setAmountVal(e.target.value)} className='text-[40px] head2 leading-[60px] text-black  w-[200px] outline-none' />
                        </div>
                      </div>
                      <div className="">
                        <p className="font-normal text-[20px] leading-[26px] tracking-[1.3%]">Basic Account</p>
                      </div>
                    </div>
                    <div className="absolute flex justify-center z-50 left-0 right-0 top-28">
                      <img src="/Frame 108.svg" alt="" className='w-[48px] h-[48px]' />
                    </div>

                    <div className="flex items-center justify-between border-[2px] z-10 rounded-lg py-[14px] px-[15px] border-black mt-4 relative">
                      <div className="">
                        <p className="font-bold text-[14px] leading-6 head2 tracking-[10%] ">To</p>
                        <div className="flex items-center gap-2 h-[59px] mt-4">
                          <p className="head2 text-[24px] leading-[32px] tracking-[1.3%] font-normal ">$</p>
                          <input type="text" placeholder='0.00' className='text-[40px] head2 leading-[60px] text-black  w-[200px] outline-none' />
                        </div>
                      </div>
                      <div className="">
                        <p className="font-normal text-[20px] leading-[26px] tracking-[1.3%]">Shared Account</p>
                      </div>
                    </div>
                    <div className="flex justify-center my-10">
                      <button onClick={sendBetweenAcct} disabled={sending} className='px-4 grotesk_font h-fit w-full py-3 rounded-xl block text-center text-[white] bg-[#0F4880]'>
                        {sending ? "Sending" : "Send"}
                      </button>
                    </div>
                  </div>
                </section>


              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>

  )
}