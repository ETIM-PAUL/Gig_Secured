import Auth from "@/app/auth/Auth";
import { useState } from "react"
import childAbi from "@/app/auth/abi/child.json";
import { ethers } from "ethers";
import { toast } from "react-toastify";


export default function TokenTransfer({ btnText, type }) {
  const [amountVal, setAmountVal] = useState();
  const [sendeAddr, setSendeAddress] = useState("");

  const { childAddress, provider } = Auth()

  const fundWallet = async (e) => {
    console.log(amountVal)
    if ((Number(amountVal) < 1) || amountVal === undefined) {
      toast.error("Invalid Amount")
      return;
    }
    try {
      e.preventDefault();

      const ChildContract = new ethers.Contract(
        childAddress,
        childAbi,
        provider.getSigner()
      );


      const tx = await ChildContract.transferFund(sendeAddr, Number(amountVal))

      const txResponse = await tx.wait();
      console.log(txResponse);
      // console.log(txResponse.error);
      toast.error("Transaction successful")

    } catch (error) {
      toast.error("Transaction failed")
    }
  }

  return (
    <div>
      <div>
        <div className="block md:flex gap-3  md:gap-10">
          <div className="w-full md:w-[50%]">
            <label htmlFor="" className="font-normal text-[17px] leading-5 tracking-[0.5%] ">{type === "home" ? "Amount to Withdraw" : "Amount to transfer"}</label>
            <div className="flex items-center border-[1px] border-[#696969] rounded-lg pl-[10px] w-fit gap-4 h-[72px] mt-2">
              <p className="font-normal head2 text-[24px] leading-[32px] ">$</p>
              <input value={amountVal} onChange={(e) => setAmountVal(e.target.value)} type="text" placeholder="0.00" className="head2 text-[36px] leading-[53.2px] text-[#696969] h-[100%] outline-none  rounded-r-lg" />
            </div>
          </div>

          <div className="w-full md:w-[50%]">
            <label htmlFor="" className="font-normal text-[17px] leading-5 tracking-[0.5%] ">{type !== "home" ? "Beneficiary (USDT Wallet)" : "Withdraw Destination (USDT Wallet)"}</label>
            <div className="flex items-center border-[1px] border-[#696969] rounded-lg pl-[10px] w-full gap-4 h-[72px] mt-2">
              <input type="text" value={sendeAddr} onChange={(e) => setSendeAddress(e.target.value)} placeholder="ehu7738939903mdjffjfj" className="head2 text-[20px] leading-[53.2px] text-[#696969] h-[100%] outline-none  rounded-r-lg font-bold" />
            </div>
          </div>
        </div>
        {/* button */}
        <div className="flex justify-center">
          <button onClick={fundWallet} className="w-[360px] h-[58px] rounded-lg bg-[#0F4880] text-[#FEFEFE] text-[17px] leading-[25.5px] tracking-[0.5%] mt-[80px] ">
            {btnText}
          </button>
        </div>
      </div>
    </div>
  )
}
