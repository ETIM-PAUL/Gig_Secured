import React, { useState } from 'react'
import Layout from '@/components/Layout'
import childAbi from "@/app/auth/abi/child.json";
import { generateQuarterlyDates } from '@/utils'
import { ethers } from 'ethers'
import Auth from '@/app/auth/Auth'

const CreateSavings = () => {
  const {childAddress, provider} = Auth()

  const [privateType, setPrivateType] = useState(true)
  const [name, setName] =useState('')
  const [target, setTarget] =useState()
  const [stDate, setStDate] =useState()
  const [endDate, setEndDate] =useState()

  const submitForm=async(e)=>{
    console.log('clicked')
    e.preventDefault();

    const ChildContract = new ethers.Contract(
      childAddress,
      childAbi,
      provider.getSigner()
    );
   let myDate= new Date(stDate);
   let epochTime = myDate.getTime();
   let epochTimeSeconds=Math.floor(epochTime/1000);

   let myDate1= new Date(endDate);
   let epochTime1 = myDate1.getTime();
   let epochTimeSeconds1=Math.floor(epochTime1/1000);

  
   

if(privateType){

  const tx = await ChildContract.createPersonalSavingsClub(name,  epochTimeSeconds1, target);

  const txResponse = await tx.wait();
  console.log(txResponse);
}
    const tx = await ChildContract.createPublicSav(name, epochTimeSeconds, epochTimeSeconds1, target);

    const txResponse = await tx.wait();
    console.log(txResponse);




  }

  return (
    <Layout>
      <div className='pt-20 pb-5'>
        <div className='flex gap-5'>
          <div onClick={()=>setPrivateType(true)} className={` ${privateType ? 'bg-[#D9D9D9]' :'bg-[#D2E9FF]' } personal_savings_card p-6 flex flex-col gap-4 justify-between w-full md:w-[50%]  cursor-pointer `}>
            <span className='text-[20px] tracking-[0.085px] leading-5'>Create a Private Savings Club</span>
            <span className='grotesk_font text-base tracking-[0.085px] leading-5'>Use this option to create a private savings club for your close friends</span>
          </div>
          <div onClick={()=>setPrivateType(false)} className={` ${privateType == false ?  'bg-[#D9D9D9]': 'bg-[#D2E9FF]'} public_savings_bg p-6 flex flex-col gap-4 justify-between w-full md:w-[50%] cursor-pointer`}>
            <span className='text-[20px] tracking-[0.085px] leading-5'>Create a Public Savings Club</span>
            <span className='grotesk_font text-base tracking-[0.085px] leading-5'>Use this option to create a public savings club for everyone</span>
          </div>
        </div>

        {/* form */}
        <div className='my-12'>
          <div className="grid md:flex gap-5 w-full mb-5">
            <div className='grid space-y-2 w-full'>
              <label>What are you Saving for? (Club Name)</label>
              <input type="text" placeholder="House rent" value={name} onChange={(e)=>setName(e.target.value)} className="input input-bordered  border-[#696969] w-full max-w-full bg-white" />
            </div>
            <div className='grid space-y-2 w-full'>
              <label>Target Amount</label>
              <input type="text" value={target} onChange={(e)=>setTarget(e.target.value)}  placeholder="$ 0.00" className="input input-bordered  border-[#696969] w-full max-w-full bg-white" />
            </div>
          </div>
          <div className="grid md:flex gap-5 w-full mb-5">
            <div className='grid space-y-2 w-full'>
              <label>How will you prefer to save</label>
              <div className='flex gap-3'>
                <button className="btn bg-white font-normal">Weekly</button>
                <button className="btn bg-white font-normal">Monthly</button>
                <button className="btn bg-white font-normal">Manual</button>
              </div>
            </div>
            <div className='grid space-y-2 w-full'>
              <label>How much do you want to save anually</label>
              <input type="text" placeholder="$ 0.00" className="input input-bordered bg-white border-[#696969] w-full max-w-full " />
            </div>
          </div>
          <div className="grid md:flex gap-5 w-full mb-5">
            <div className='grid space-y-2 w-full'>
              <label>Start Date</label>
              <input type="date" value={stDate} onChange={(e)=>setStDate(e.target.value)} placeholder="House rent" className="input input-bordered  border-[#696969] w-full max-w-full bg-white" />
            </div>

            <div className='grid space-y-2 w-full'>
              <label>End Date</label>
              <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} placeholder="House rent" className="input input-bordered  border-[#696969] w-full max-w-full bg-white" />
            </div>
            {/* <div className='grid space-y-2 w-full'>
              <label>End Date (Quarterly)</label>
              <select className="select select-bordered w-full max-w-full bg-white">
                <option disabled selected>Select Option?</option>
                {generateQuarterlyDates().map((data, index) => (
                  <option key={index}>{data}</option>
                ))}
              </select>
            </div> */}
          </div>
          <div className="grid md:flex gap-5 w-full mb-5">
            <div className='grid space-y-2 w-full'>
              <label>Primary Source of Funds</label>
              <select className="select select-bordered w-full max-w-full bg-white">
                <option disabled selected>
                  {/* Select Option? */}
                  SpendNest Basic Account
                  </option>
                <option>SpendNest Basic Account</option>
                {/* <option>External Wallet</option> */}
              </select>
            </div>
            <div className='grid space-y-2 w-full'>
              <label>Who can add members</label>
              <select className="select select-bordered w-full max-w-full bg-white">
                <option disabled selected>Select Option?</option>
                <option>Admin</option>
                <option>Any member of the savings club</option>
              </select>
            </div>
          </div>
        </div>

        <button onClick={submitForm} className="w-[360px] h-[58px] rounded-lg bg-[#2A0FB1] text-[#FEFEFE] text-[17px] block mx-auto leading-[25.5px] tracking-[0.5%] mt-[80px] ">
          Create Savings Club
        </button>
      </div>
    </Layout>
  )
}

export default CreateSavings