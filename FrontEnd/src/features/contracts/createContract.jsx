import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from 'react-toastify';

export default function CreateContract() {
  const [submitLoading, setSubmitLoading] = useState(false)
  const [showPaymentModal, setPaymentModal] = useState(false)
  const [termModal, setTermModal] = useState(false)
  const [hasOpenTermModal, setHasOpenTermModal] = useState(false)
  const schema = yup
    .object({
      email: yup.string().email().required(),
      name: yup.string().required(),
      title: yup.string().required(),
      category: yup.string().required(),
      description: yup.string().required(),
      freelancer: yup.string().required(),
      deadline: yup.string().required(),
      price: yup.string().required(),
      terms: yup
        .bool()
        .oneOf([true], 'You need to accept the terms and conditions'),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const openTermsModal = () => {
    setHasOpenTermModal(true);
    document.getElementById('my_modal_1').showModal()
  }

  const onSubmit = async (data) => {
    console.log(data)
    if (termModal) {

    }
    setSubmitLoading(true)
    try {
      setTimeout(() => {
        setSubmitLoading(false)
      }, 1000);
    } catch (error) {
      setSubmitLoading(false)
      toast.error(error);
      console.log("Error", error);
    }
  };

  return (
    <div className='w-full text-black'>
      <form className='pt-20 pb-5' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex gap-5'>
          <div className={`bg-[#D9D9D9] personal_savings_card p-6 flex flex-col gap-4 justify-between w-full cursor-pointer `}>
            <span className='text-[20px] tracking-[0.085px] leading-5'>Create a Gig Secured Contract</span>
            <span className='grotesk_font text-base tracking-[0.085px] leading-5'>Use this form to create a secured contract between you and a freelancer</span>
          </div>
        </div>

        {/* form */}
        <div className='my-12'>
          <div className="grid md:flex gap-5 w-full mb-5">
            <div className='grid space-y-2 w-full'>
              <label>Your Name</label>
              <input {...register("name")} type="text" placeholder="Please Enter Your Name" className="input input-bordered  border-[#696969] w-full max-w-full bg-white" />
              <p className="text-field-error italic text-red-500">
                {errors.name?.message}
              </p>
            </div>
            <div className='grid space-y-2 w-full'>
              <label>Your Email</label>
              <input {...register("email")} type="text" placeholder="Please Enter Your Valid Email" className="input input-bordered  border-[#696969] w-full max-w-full bg-white" />
              <p className="text-field-error italic text-red-500">
                {errors.email?.message}
              </p>
            </div>
          </div>
          <div className="grid md:flex gap-5 w-full mb-5">
            <div className='grid space-y-2 w-full'>
              <label>Title</label>
              <input {...register("title")} type="text" placeholder="Contract Title" className="input input-bordered  border-[#696969] w-full max-w-full bg-white" />
              <p className="text-field-error italic text-red-500">
                {errors.title?.message}
              </p>
            </div>
            <div className='grid space-y-2 w-full'>
              <label>Category</label>
              <select {...register("category")} className="select select-bordered border-[#696969] w-full max-w-full bg-white">
                <option disabled selected>
                  {/* Select Option? */}
                  Smart Contract Development
                </option>
                <option>Freelance Writing</option>
                <option>Art Sale</option>
                <option>Marketing</option>
                <option>Video Content</option>
              </select>
              <p className="text-field-error italic text-red-500">
                {errors.category?.message}
              </p>
            </div>
          </div>
          <div className="grid md:flex gap-5 w-full mb-5">
            <div className='grid space-y-2 w-full'>
              <label>Deadline</label>
              <input {...register("deadline")} type="date" className="input input-bordered  border-[#696969] w-full max-w-full bg-white" />
              <p className="text-field-error italic text-red-500">
                {errors.deadline?.message}
              </p>
            </div>
            <div className='grid space-y-2 w-full'>
              <label>Price</label>
              <input {...register("price")} type="text" placeholder="Please add a Base Fee. Please review terms and conditions" className="input input-bordered  border-[#696969] w-full max-w-full bg-white" />
              <p className="text-field-error italic text-red-500">
                {errors.price?.message}
              </p>
            </div>
          </div>
          <div className="grid md:flex gap-5 w-full mb-5">
            <div className='grid space-y-2 w-full'>
              <label>Freelancer Wallet Address</label>
              <input {...register("freelancer")} type="text" placeholder="Please add a Valid Freelancer Wallet Address" className="input input-bordered  border-[#696969] w-full max-w-full bg-white" />
              <p className="text-field-error italic text-red-500">
                {errors.freelancer?.message}
              </p>
            </div>
            <div className='grid space-y-2 w-full'>
              <label>A short description for your contract</label>
              <input {...register("description")} type="text" placeholder="Short Description" className="input input-bordered bg-white border-[#696969] w-full max-w-full " />
              <p className="text-field-error italic text-red-500">
                {errors.description?.message}
              </p>
            </div>
          </div>
          <div className="grid md:flex gap-5 w-full mb-5">
            <div className='grid space-y-2 w-full'>
              <div className='flex gap-3 items-center'>
                <input {...register("terms")} type="checkbox" className="input input-bordered w-8 h-8 border-[#696969] max-w-full bg-white" />
                <label className='w-full'>Accept Terms and Conditions</label>
              </div>
              <p className="text-field-error italic text-red-500">
                {errors.terms?.message}
              </p>
            </div>
            <div className='grid space-y-2 w-full'>
              <button type="button" onClick={() => openTermsModal()} className="w-full h-[58px] rounded-lg bg-black text-[#FEFEFE] text-[17px] block mx-auto leading-[25.5px] tracking-[0.5%]">
                View Terms and Conditions
              </button>
            </div>
          </div>
        </div>

        <button disabled={submitLoading} className="w-[360px] h-[58px] rounded-lg bg-[#2A0FB1] hover:bg-[#684df0] text-[#FEFEFE] text-[17px] block mx-auto leading-[25.5px] tracking-[0.5%] mt-[80px] ">
          {submitLoading ?
            <span className="loading loading-spinner loading-lg"></span>
            :
            "Create Secured Contract"
          }
        </button>
      </form>

      {/* Term and Conditions */}
      <dialog id="my_modal_1 bg-white" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}
