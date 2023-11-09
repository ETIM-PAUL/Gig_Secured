/** @format */

import Layout from "@/components/Layout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PiArrowLeftBold, PiArrowRightBold } from "react-icons/pi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import childAbi from "@/app/auth/abi/child.json";
import factoryAbi from "@/app/auth/abi/factory.json";
import Auth from "@/app/auth/Auth";
import { ethers } from "ethers";
import { factoryAddress } from "@/app/auth/contractAddress";
import { removeDuplicateObjects } from "@/utils";

export default function SavingsClub() {
  const router = useRouter();
  const [savingLive, setSavingLive] = useState(true);
  const { childAddress, provider, } = Auth();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (Object.values(provider).length > 0) {
      // const ChildContract = new ethers.Contract(childAddress, childAbi, provider?.getSigner());
      const ChildContract = new ethers.Contract(
        factoryAddress,
        factoryAbi,
        provider?.getSigner()
      );
      const getData = async () => {
        let mainData = [];

        const tx = await ChildContract.showPublicData();
        for (let index = 0; index < tx.length; index++) {
          const element = tx[index];
          const newObject = {}
          newObject.name = tx[0][0];
          newObject.startDate = Number(tx[1]);
          newObject.endDate = Number(tx[2]);
          newObject.savingsGoal = Number(tx[3]);
          newObject.totalParticipant = Number(tx[4]);
          mainData.push(newObject)
        }
        localStorage.setItem("publicClubs", JSON.stringify(removeDuplicateObjects(mainData)))
        setData(removeDuplicateObjects(mainData));
      };
      getData();
    } else { router.push("/") }
  }, [provider]);

  return (
    <Layout>
      <div className="pt-20 pb-5">
        <div className="flex gap-6">
          <PiArrowLeftBold
            size={24}
            className="font-bold cursor-pointer mt-2"
            onClick={() => router.back()}
          />
          <span className="tracking-[0.08px] text-3xl">Savings Club</span>
        </div>

        <div className="mt-8 sm:mt-10 mb-10">
          <div
            href="/savings/club"
            className="flex items-center savings_club p-6 hover:cursor-pointer"
          >
            <div className="grid w-full">
              <div className="w-14 h-14 p-1">
                <Image
                  src="/savings/saving_hands.svg"
                  alt={""}
                  className="object-cover w-full"
                  width={20}
                  height={20}
                />
              </div>
              <p className="text-[#C27810] text-lg font-bold">Savings Club</p>
              <span className="grotesk_font text-[base] tracking-[0.085px] leading-5 my-2 block w-[55%]">
                Reach your unique savings goals with others by locking funds to
                avoid temptation
              </span>
            </div>
            <span className="text-[#C27810] text-xl font-bold">$100.80</span>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8 sm:my-10">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Trending Savings Club</span>
            <Link
              href="/history"
              className="flex items-center text-base text-[#C27810] grotesk_font gap-1"
            >
              <span>See more</span>
              <span className="">&#62;</span>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-10 mt-8 text-white">
            {data.length > 0 && data[0]?.length === 0 ? (
              <div className="flex flex-col">
                <span className="text-black">
                  No Public Club <span className="font-bold"> Created</span> Yet
                </span>
                <div className="flex justify-center items-center text-[#0F4880] gap-2 mt-4 cursor-pointer">
                  <span className="tracking-[0.08px] text-lg grotesk_font">
                    Create a Savings Club
                  </span>
                  <PiArrowRightBold
                    size={24}
                    className="font-bold hover:cursor-pointer"
                    onClick={() => router.push("/savings/club/create_savings")}
                  />
                </div>
              </div>
            ) : (
              <>
                {data.length > 0 && data?.map((club, index) => (
                  <div key={index} className="w-full rounded-[8px] border-t md:max-w-[300px]">
                    <Link
                      href={`/savings/join_club?type=public&name=${club?.name}`}
                      className="w-full h-[180px] flex justify-center"
                      style={{ backgroundColor: "rgba(143, 231, 108, 0.50)" }}
                    >
                      <Image
                        src="/savings/dollar_coins.svg"
                        alt={""}
                        className="w-full"
                        width={120}
                        height={120}
                      />
                    </Link>

                    <div className="text-black grid mt-1">
                      <span className="font-bold text-lg">{club?.name}</span>
                      <div className="w-full bg-[#D9D9D9] h-[3px]">
                        <div
                          className="h-full bg-[#0F4880]"
                          role="progressbar"
                          style={{ width: `${10}%` }}
                        ></div>
                      </div>
                      <div className="space-x-2">
                        <span className="text-[14px] font-bold">
                          {club.totalParticipant}
                        </span>
                        <span className="text-[12px]">members</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="flex justify-center w-[50%] mx-auto">
          <div className="text-black grid mt-1 w-full">
            <span
              onClick={() => setSavingLive(true)}
              className="font-bold text-lg pb-1 hover:cursor-pointer block text-center"
            >
              Live
            </span>
            <div className="w-full bg-[#D9D9D9] h-[3px]">
              <div
                className="h-full bg-[#0F4880]"
                role="progressbar"
                style={{ width: `${savingLive ? "100%" : "0%"}` }}
              ></div>
            </div>
          </div>
          <div className="text-black grid mt-1 w-full">
            <span
              onClick={() => setSavingLive(false)}
              className="font-bold text-lg pb-1 hover:cursor-pointer block text-center"
            >
              Completed
            </span>
            <div className="w-full bg-[#D9D9D9] h-[3px]">
              <div
                className="h-full bg-[#0F4880]"
                role="progressbar"
                style={{ width: `${!savingLive ? "100%" : "0%"}` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-8 block text-center">
          {!savingLive ? (
            <span className="w-full md:w-[100px]">
              You have <span className="font-bold">Not Completed</span> any
              savings club yet. It will show here once you are done
            </span>
          ) : (
            <span>
              You have <span className="font-bold">No Ongoing</span> savings
            </span>
          )}
        </div>

        <div className="flex justify-center items-center text-[#0F4880] gap-2 mt-4 cursor-pointer">
          <span className="tracking-[0.08px] text-lg grotesk_font">
            Create a Savings Club
          </span>
          <PiArrowRightBold
            size={24}
            className="font-bold hover:cursor-pointer"
            onClick={() => router.push("/savings/club/create_savings")}
          />
        </div>
      </div>
    </Layout>
  );
}
