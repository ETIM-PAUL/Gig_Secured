/** @format */
"use client"
import Auth from "@/app/auth/Auth";
import React, { useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import Link from "next/link";
import childAbi from '@/app/auth/abi/child.json'
import factoryAbi from '@/app/auth/abi/factory.json'
import { factoryAddress } from "@/app/auth/contractAddress";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

export default function AllContracts() {
  const { address, isConnected } = useAccount();
  const { providerRead } = Auth();
  const [contracts, setContracts] = useState([1, 2, 3])
  const [fetchedContracts, setFetchedContracts] = useState([])
  const [hasContract, setHasContract] = useState(false)
  const [loadingPage, setLoadingPage] = useState(true)
  const [tx, setTx] = useState("")

  const getAddressContractsCount = async (registerAddress) => {
    if (registerAddress === "") {
      return;
    }
    const contractRead = new ethers.Contract(registerAddress, childAbi, providerRead);
    let tx = await contractRead.getAllGigs();
    console.log(tx)
    // setFetchedContracts(Number(tx))
  }

  useEffect(() => {
    const contract = new ethers.Contract(factoryAddress, factoryAbi, providerRead);
    const getConnectedWalletStatus = async () => {
      setLoadingPage(true)
      let tx = await contract.getCreatorSystem(address);
      if (tx === "0x0000000000000000000000000000000000000000") {
        setHasContract(false)
      } else {
        setHasContract(true)
        getAddressContractsCount(tx)
        setTx(tx)
      }
      setLoadingPage(false)
    }
    if (isConnected) {
      getConnectedWalletStatus();
    }
  }, [])

  return (
    <main>
      {(loadingPage && !hasContract) &&
        <span>Loading</span>
      }
      {(!loadingPage && !hasContract && tx === "") &&
        <div
          className='w-[360px] h-[58px] mx-auto rounded-lg mb-10 bg-[#D2E9FF] hover:bg-[#0978e0cb] text-black hover:text-white text-[17px] block leading-[25.5px] tracking-[0.5%]'
        >
          No contracts register, Please proceed to Dashboard to create a register
        </div>
      }

      {(!loadingPage && hasContract && tx !== "") &&
        <section className="mt-20 ">
          <Link href="/contracts/create" className="w-full flex funda_bg rounded-2xl cursor-pointer">
            <div className="w-[90%] mx-auto py-3 flex justify-between items-center">
              <div className="">
                <img src="./Group.svg" alt="" className="w-[56px] h-[56px]" />
                <h2 className="text-black text-[20px] font-bold head2 leading-[26px] tracking-[1.3%] mt-[20px]">Create a new Contract</h2>
              </div>
              <div className="">
                <img src="./Transfer.png" alt="" className="w-[48px] h-[48px]" />
              </div>
            </div>
          </Link>

          <div className="my-10 flex gap-6 flex-wrap">
            {fetchedContracts.length === 0 &&
              <div className="text-2xl font-bold w-full text-center block">
                <span>You don't have any contracts</span>
              </div>
            }
          </div>

          <div className="my-10 flex gap-6 flex-wrap">
            {fetchedContracts.length > 0 && contracts.map((item, index) => (
              <div key={index} className="card w-96 bg-white border shadow-md border-black flex-grow text-black">
                <div className="card-body">
                  <h2 className="card-title">Writing Fiction Story!</h2>
                  <p>Write Five(5) chapters, with each having at least 2000 words about any fiction story </p>
                  <div className="card-actions justify-end">
                    <Link href={`/contracts/view?id=${index + 1}`}>
                      <button className="btn bg-[#D2E9FF] hover:bg-[#76bbff] text-black border-[#D2E9FF">More Details</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>


        </section>
      }
    </main>
  );
}
