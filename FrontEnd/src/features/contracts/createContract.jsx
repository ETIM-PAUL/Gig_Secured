import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { PiArrowLeftBold } from 'react-icons/pi';
import { useRouter } from 'next/navigation';

export default function CreateContract() {
  const router = useRouter();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [termModal, setTermModal] = useState(false);
  const [hasOpenTermModal, setHasOpenTermModal] = useState(false);
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
    setTermModal(true);
  };

  const onSubmit = async (data) => {
    console.log(data);
    if (hasOpenTermModal) {
    }
    setSubmitLoading(true);
    try {
      setTimeout(() => {
        setSubmitLoading(false);
      }, 1000);
    } catch (error) {
      setSubmitLoading(false);
      toast.error(error);
      console.log('Error', error);
    }
  };

  return (
    <div className='w-full text-black'>
      <form className='pt-20 pb-5' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex items-center gap-4'>
          <PiArrowLeftBold
            size={28}
            className='font-bold cursor-pointer text-4xl mt-2'
            onClick={() => router.back()}
          />
          <div
            className={`bg-[#D9D9D9] personal_savings_card p-6 flex flex-col gap-4 justify-between w-full cursor-pointer `}
          >
            <span className='text-[20px] tracking-[0.085px] leading-5'>
              Create a Gig Secured Contract
            </span>
            <span className='grotesk_font text-base tracking-[0.085px] leading-5'>
              Use this form to create a secured contract between you and a
              freelancer
            </span>
          </div>
        </div>

        {/* form */}
        <div className='my-12'>
          <div className='grid md:flex gap-5 w-full mb-5'>
            <div className='grid space-y-2 w-full'>
              <label>Your Name</label>
              <input
                {...register('name')}
                type='text'
                placeholder='Please Enter Your Name'
                className='input input-bordered  border-[#696969] w-full max-w-full bg-white'
              />
              <p className='text-field-error italic text-red-500'>
                {errors.name?.message}
              </p>
            </div>
            <div className='grid space-y-2 w-full'>
              <label>Your Email</label>
              <input
                {...register('email')}
                type='text'
                placeholder='Please Enter Your Valid Email'
                className='input input-bordered  border-[#696969] w-full max-w-full bg-white'
              />
              <p className='text-field-error italic text-red-500'>
                {errors.email?.message}
              </p>
            </div>
          </div>
          <div className='grid md:flex gap-5 w-full mb-5'>
            <div className='grid space-y-2 w-full'>
              <label>Title</label>
              <input
                {...register('title')}
                type='text'
                placeholder='Contract Title'
                className='input input-bordered  border-[#696969] w-full max-w-full bg-white'
              />
              <p className='text-field-error italic text-red-500'>
                {errors.title?.message}
              </p>
            </div>
            <div className='grid space-y-2 w-full'>
              <label>Category</label>
              <select
                {...register('category')}
                className='select select-bordered border-[#696969] w-full max-w-full bg-white'
              >
                <option disabled selected>
                  {/* Select Option? */}
                  Smart Contract Development
                </option>
                <option>Freelance Writing</option>
                <option>Art Sale</option>
                <option>Marketing</option>
                <option>Video Content</option>
              </select>
              <p className='text-field-error italic text-red-500'>
                {errors.category?.message}
              </p>
            </div>
          </div>
          <div className='grid md:flex gap-5 w-full mb-5'>
            <div className='grid space-y-2 w-full'>
              <label>Deadline</label>
              <input
                {...register('deadline')}
                type='date'
                className='input input-bordered  border-[#696969] w-full max-w-full bg-white'
              />
              <p className='text-field-error italic text-red-500'>
                {errors.deadline?.message}
              </p>
            </div>
            <div className='grid space-y-2 w-full'>
              <label>Price (please note after creation of contract, this is not editable)</label>
              <input
                {...register('price')}
                type='text'
                placeholder='Please add a Base Fee. Please review terms and conditions'
                className='input input-bordered  border-[#696969] w-full max-w-full bg-white'
              />
              <p className='text-field-error italic text-red-500'>
                {errors.price?.message}
              </p>
            </div>
          </div>
          <div className='grid md:flex gap-5 w-full mb-10'>
            <div className='w-full mt-2 space-y-2'>
              <label>A short description for your contract</label>
              <textarea
                {...register('description')}
                type='text'
                placeholder='Short Description'
                className='input input-bordered bg-white border-[#696969] w-full max-w-full h-full'
                rows={4}
                cols={4}
              />
              <p className='text-field-error italic text-red-500'>
                {errors.description?.message}
              </p>
            </div>
            <div className='block space-y-2 w-full'>
              <label>Freelancer Wallet Address</label>
              <input
                {...register('freelancer')}
                type='text'
                placeholder='Please add a Valid Freelancer Wallet Address'
                className='input input-bordered  border-[#696969] w-full max-w-full bg-white'
              />
              <p className='text-field-error italic text-red-500'>
                {errors.freelancer?.message}
              </p>
            </div>
          </div>
          <div className='grid space-y-2 pt-4 w-full'>
            <button
              type='button'
              onClick={() => openTermsModal()}
              className='w-full h-[58px] rounded-lg underline text-[#3997b9] text-[17px] block mx-auto leading-[25.5px] tracking-[0.5%]'
            >
              View Terms and Conditions
            </button>
            <p className='text-field-error italic text-red-500 text-center pt-'>
              {errors.terms?.message}
            </p>
          </div>
        </div>

        <button
          disabled={submitLoading}
          className='w-[360px] h-[58px] rounded-lg bg-[#2A0FB1] hover:bg-[#684df0] text-[#FEFEFE] text-[17px] block mx-auto leading-[25.5px] tracking-[0.5%]'
        >
          {submitLoading ? (
            <span className='loading loading-spinner loading-lg'></span>
          ) : (
            'Create Secured Contract'
          )}
        </button>
      </form>

      {/* Term and Conditions */}
      {termModal && (
        <div>
          <input
            type='checkbox'
            checked
            onChange={() => null}
            id='my_modal_6'
            className='modal-toggle'
          />
          <div className='modal bg-white'>
            <div className='modal-box w-11/12 max-w-5xl bg-white'>
              <div>
                <h3 className='font-bold text-lg'>Terms of Service for Freelancers on Gig Secured!</h3>
                <hr className='text-black my-2' />
                <p>
                  Introduction: Welcome to Gig Secured, a platform that provides freelancers and clients with an escrow and talent management service based on blockchain technology and smart contracts.
                </p>
                <p>
                  These terms of service govern your use of our platform and our relationship with you as a freelancer. By using our platform, you agree to be bound by these terms of service.
                </p>
                <p className='font-bold text-red-500 text-lg pt-2'>
                  If you do not agree with these terms of service, please do not use our platform.
                </p>

                <div>
                  <ul className='list-disc py-3 px-4 grid space-y-1'>
                    <li>
                      "We", "us", "our" refer to Gig Secured, the owner and operator of the platform.
                    </li>
                    <li>
                      "You", "your" refer to you, the freelancer who uses our platform to manage your relationship with clients.
                    </li>
                    <li>
                      "Platform" refers to our website and any other onchain or online or offline services that we provide.
                    </li>
                    <li>
                      "Client" refers to any person or entity who uses our platform to manage their relationships with freelancers they hire for their projects (gigs).
                    </li>
                    <li>
                      "Contract" or “Gig” refers to the agreement or arrangement that is formed between a freelancer and a client on our platform for a project (gig).
                    </li>
                    <li>
                      "Smart contract" refers to any self-executing contract that is created and executed on the blockchain and that governs the terms and conditions of a project (gig).
                    </li>
                    <li>
                      "Escrow" refers to any service that we provide on our platform that holds and releases the funds for a project according to the smart contract.
                    </li>
                    <li>
                      "Auditor" refers to any person or entity who uses our platform to provide an independent and impartial review of the quality and outcome of a project (gig).
                    </li>
                    <li>
                      "Audit" refers to any process or procedure that is initiated by a client or a freelancer on our platform to request or perform an audit for a project (gig).
                    </li>
                    <li>
                      "Token" refers to any digital currency or asset that is used on our platform for payments and transactions.
                    </li>
                    <li>
                      "Project Fee" refers to the fee you and the client agreed to as your payment for a gig.
                    </li>
                    <li>
                      "Platform Fee" refers to the fee you and the client will be charged for using our platform.
                    </li>
                  </ul>
                </div>

                <p>
                  Scope of Service We provide a platform that manages how clients and freelancers manage their project’s (gig) relationship using an escrow service based on blockchain technology and smart contracts.
                </p>
                <p>
                  We do not provide any work or services ourselves, nor do we guarantee the quality, accuracy, or reliability of any work or services provided by freelancers or clients on our platform.
                </p>
                <p>
                  We are not a party to any contract or agreement that is formed between freelancers and clients on our platform, nor are we responsible for any disputes or issues that may arise between them. We are not liable for any damages or losses that may result from the use of our platform or the work or services provided by freelancers or clients on our platform.
                </p>

                <h4 className='mt-2 text-lg font-bold'>Usage - To use our platform as a freelancer, you only need to:</h4>
                <ul className='list-disc py-3 px-4 grid space-y-1'>
                  <li>
                    Accept the terms of the contract by your signature.
                  </li>
                  <li>
                    Use a compactible Web 3 wallet client like Base or Metamask wallets and email for verification and signature.
                  </li>
                  <li>
                    Agree to our terms of service and privacy policy.
                  </li>
                </ul>

                <p>
                  You are responsible for maintaining the security and confidentiality of every gig you are working on. You are also responsible for any activities or actions that occur under your account. You agree to notify us immediately if you have any difficulty accessing a gig you are working on or if your wallet has been compromised.
                </p>

                <p>
                  Gigs - You are responsible for meeting your client and agreeing with your client all the terms, requirements and milestones before coming to sign a contract on our platform. Our platform allows you to review a contract you have been invited to sign. It is your responsibility to ensure that the contract you are signing is based on the terms of your agreement. Our platform recieves payment from the client as security of guaranteed payment for you, secures the payment on the blockchain and handles settlement when the contract is finalised.
                </p>

                <p className='text-red-500 py-1'>
                  You must sign the contract and before you can change the status from ‘Pending’ to ‘Building.’
                </p>

                <div>
                  <h4 className='font-bold text-lg mt-2'>Deadlines</h4>
                  <div>
                    <h5> Our platform handles deadlines set by the client for you in these manner:</h5>
                    <ul className='list-disc py-3 px-4 grid space-y-1'>
                      <li>
                        If you are invited to sign a contract and you fail to sign the contract within 72 hours, the client will be able to close the contract and get refunded the amount he put up in accordance with these terms of service.
                      </li>
                      <li>
                        If you accept a gig from the client, you sign and fail to complete it within the agreed deadline, the contract will fail and revert, refunds would be made to the client who created the contract, so endeavour to submit your work within the agreed time as time cannot be changed once a contract is created.
                      </li>
                    </ul>
                  </div>
                </div>


                <p>All these are done to foster accountability and adherence to contractual obligations.</p>

                <h4 className='font-bold text-lg mt-2'>
                  Contracts and Smart Contracts
                </h4>
                <p className="">When you and the client agree on a gig, the client would come to our platform and create a contract with all the details you have agreed and invite you to sign. The contract specifies the terms, requirements, and milestones of the project.</p>

                <p>Our platform, this terms of service and our privacy policy cover the rights and obligations of both parties.</p>

                <p>When a contract is formed, a smart contract is also created and deployed on the blockchain. The smart contract is a self-executing contract that governs the terms and conditions of the gig, such as the payment, the delivery, the review, possible audits, and rating. The smart contract is immutable and transparent, and can be verified by anyone on the blockchain.</p>

                <p>You agree to abide by the terms and conditions of the contract, and to perform the work or services according to the agreed milestones and deliverables.

                  <h4>Escrow, Payments and Audits</h4>
                  <p>
                    When a contract is formed, the client is required to deposit the project fee plus an additional 12% for the possible audit service as part of the platform fees. The project fee is the amount that is agreed by you and the client for the gig. The audit service is the service that we provide on our platform that allows you or the client to request for an audit for a completed gig.</p>
                </p>

                <p>We hold the project and platform fees in escrow on our platform through the smart contract until the project is completed, verified and closed. The escrow is a service that we provide on our platform that holds and releases the funds for the project according to the smart contract.</p>

                <p>When you deliver the work or services according to the agreed milestones and deliverables, you need to request payment from the client on our platform. You make this request by updating the gig status to ‘Completed.’ When the the client reviews the work or services that you deliver, they confirm their satisfaction by updating the status of the contract from ‘Under Review’ to ‘Closed’ or they can dispute the completed work by requesting an audit on our platform.</p>

                <p>In order to avoid your payments held up in the contract, when you update a gig status to ‘Completed,’ the client would have 72 hours to review the submitted work and either close it or logde a dispute. When 72 hours have passed and there is no update from the client, you will be able to come to our platform and lodge a dispute which initiates an audit process and upon completion of the audit you will paid as per the audit terms enumerated below.</p>

                <h4>Payments and Audit Terms</h4>
                <p>All payments will be done only in tokens accepted by the platform. There are two payment types under this terms of service:</p>

                1. Payment Without Audit
                This payment type takes effect if the client confirms their satisfaction without dispute. The gig is completed and verified, and the smart contract releases the payment to you and makes refunds to the client from the platform fees, the refunds is for the fees paid for the audit service which was not activated.

                The payment amount is the amount that you receive for a gig, which is 95% of the project fee minus a 5% fee that we charge for our platform. The refund is the amount that the client receives back which is 10% from the already paid additional 12% platform fee.

                2. Payment After Audit
                This payment type takes effect when the you or the client requests for an audit. The gig contract terms and your completed work are sent to an auditor who audits the work done and once verified, the smart contract releases the payment amount and any refunds according to the audit results.

                The audit results are the score or the rating, and/or the recommendation that the auditor provides for the work or services that you deliver. The audit results are interpreted to a percentage value, the determined percentage value becomes the payment you are entitled to. As a percentage, the smart contract will only pay you that percent of the payment amount and if there is any excess, this will be refunded to the client. For example, if a you or a client requests an audit, the gig is sent to an auditor who under this example, grades the work and judges that is 70% completed based on the requirements and specifications you and the client agreed before the gig started, you will only be paid 70% of the payment amount, the remaining 30% will be refunded to the client.

                You agree to accept the payment amount depending on which type takes effect, as your sole compensation for the gig. You also agree to pay any taxes or fees that may apply to the payment, the refund, or the platform fee.

                Talent Management and Rating
                In future, our platform will provide a talent management service that helps you improve your skills, performance, and reputation. The talent management service should includes features like:
                •	Profile and portfolio: You can create and edit your profile and portfolio on our platform, and showcase your skills, experience, and testimonials to potential clients or freelancers.
                •	Feedback and rating: You can provide and receive feedback and rating on our platform, and improve your reputation and performance based on the feedback and rating that you receive.
                •	Audit and review: You can request and perform an audit on our platform, and improve your quality and outcome based on the audit and review that you receive.
                You agree to use our talent management service in a professional and ethical manner, and to respect the feedback, rating, audit, and review that you provide or receive on our platform. You also agree not to manipulate, falsify, or misrepresent the feedback, rating, audit, or review that you provide or receive on our platform.

                Rights and Responsibilities
                You retain all rights, title, and interest in and to the work or services that you provide on our platform, subject to the terms and conditions of this terms of service, the contract and the smart contract. You grant us a non-exclusive, royalty-free, worldwide, perpetual, irrevocable, and sublicensable license to use, reproduce, modify, distribute, display, and perform the work or services that you provide on our platform for the purposes of providing, improving, and promoting our platform.

                You are solely responsible for the work or services that you provide on our platform, and for any claims, damages, or liabilities that may arise from them. You agree to comply with all applicable laws, regulations, and standards in relation to the work or services that you provide on our platform. You also agree to respect the rights and interests of the client, and any third parties that may be involved or affected by the work or services that you provide on our platform.

                You agree not to provide any work or services that are illegal, fraudulent, deceptive, abusive, harassing, threatening, defamatory, obscene, offensive, or otherwise objectionable on our platform. You also agree not to provide any work or services that infringe or violate the intellectual property rights, privacy rights, or any other rights of the client or any third parties on our platform.

                Limitation of Liability
                To the maximum extent permitted by law, we are not liable for any direct, indirect, incidental, special, consequential, or exemplary damages or losses that may result from the use of our platform or the work or services provided by freelancers or clients on our platform, including but not limited to loss of profits, revenue, data, goodwill, or reputation.

                Our total liability for any claim or dispute arising from the use of our platform or the work or services provided by freelancers or clients on our platform is limited to the amount of fees that we have received from you in relation to the gig that is the subject of the claim or dispute.

                Dispute Resolution
                If you have any dispute or issue with the client or any third parties in relation to the work or services that you provide on our platform, you agree to first try to resolve it amicably by communicating and cooperating with them.

                If you are unable to resolve the dispute or issue amicably, you agree to use the audit feature that we provide on our platform to request or perform an audit for the project. The audit feature allows you to resolve the dispute or issue by an independent and impartial review of the quality and outcome of the gig.

                If you are still unsatisfied with the audit results, you agree to submit the dispute or issue to binding arbitration governed by the Arbitration and Conciliation Act of the Federal Republic of Nigeria and particularly the relevant and applicable laws of Lagos State. The arbitration will be conducted in accordance with the rules and procedures of the arbitration institution, and the arbitration award will be final and enforceable by any court of competent jurisdiction in Nigeria.

                You agree not to initiate or participate in any class action, collective action, or representative action against us or any freelancers or clients on our platform, and to waive any right to do so.

                Governing Law
                These terms of service are governed by and construed in accordance with the laws of the Federal Republic of Nigeria (where we are located), without regard to its conflict of law principles. You agree to submit to the exclusive jurisdiction of the courts of the country where we are located for any legal action or proceeding arising from or related to these terms of service.

                Changes and Updates
                We may change or update these terms of service at any time and for any reason, by posting the revised version on our platform. The revised version will take effect immediately upon posting, unless otherwise stated. Your continued use of our platform after the revised version takes effect will constitute your acceptance of the changes or updates. We encourage you to review these terms of service periodically to stay informed of any changes or updates.

                Contact Us
                If you have any questions, comments, or feedback about these terms of service, please contact us at info@gigsecured.com or on twitter(X) at @gig_secured or visit our website here.


              </div>
              <p className='py-4'>This are the terms and conditions</p>
              <div className='grid space-y-2 w-full'>
                <div className='flex gap-3 items-center'>
                  <input
                    {...register('terms')}
                    type='checkbox'
                    className='input input-bordered w-8 h-8 border-[#696969] max-w-full bg-white'
                  />
                  <label className='w-full'>Accept Terms and Conditions</label>
                </div>
              </div>
              <div className='modal-action' onClick={() => setTermModal(false)}>
                <label
                  htmlFor='my_modal_6'
                  className='btn btn-error text-white'
                >
                  Close!
                </label>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
}
