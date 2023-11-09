"use client"
import React, { useState } from 'react'
import { HiOutlineHome } from 'react-icons/hi'
import { BsSend } from 'react-icons/bs'
import { MdOutlineEnergySavingsLeaf } from 'react-icons/md'
import { PiHandCoins } from 'react-icons/pi'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Auth from '@/app/auth/Auth'
import { useAppContext } from '@/app/auth/Context'

export default function SideBar() {
  const pathname = usePathname();
  // const [sidebar, setSideBar] = useState(true)
  const { address } = Auth();
  const { sidebar, setSideBar } = useAppContext()

  const menu = [
    {
      name: "Home",
      icon: HiOutlineHome,
      href: "/"
    },
    {
      name: "Contracts",
      icon: BsSend,
      href: "/contracts"
    },
    {
      name: "Freelances",
      icon: MdOutlineEnergySavingsLeaf,
      href: "/freelances"
    },
    {
      name: "Audits",
      icon: PiHandCoins,
      href: "/audits"
    },
  ]
  return (
    <main>
      <section className={`min-h-screen max-h-screen bg-[#D2E9FF] ${!sidebar ? "w-[100px]" : "w-[380px]"}`}>
        <section className='w-[90%] mx-auto'>
          <div className='flex'>
            <Link href="/home" className="w-[221px] pt-[60px] flex items-center gap-1 mx-auto">
              <div className='flex gap-2 items-center justify-center w-full'>
                <img src="/Group 1.svg" alt="logo" className='w-[40.5px] h-[39px]' />
                {sidebar &&
                  <h1 className="text-[28px] leading-6 text-[#0F4880] orbitron_font font-semibold ">GigSecured</h1>
                }
              </div>
            </Link>
            <div onClick={() => setSideBar(!sidebar)} className='text-3xl'>
              <span className='text-black hover:cursor-pointer'>x</span>
            </div>
          </div>
          <div className='mt-[100px] flex flex-col gap-4'>
            {
              menu.map((items, index) => {
                const isActive = pathname?.startsWith(items?.href)

                return (
                  <Link href={items?.href} key={index} className={`${isActive && 'bg-[#FBFDFF] rounded-lg'} flex gap-2 items-center text-[#0F4880] w-[100%] h-[48px] ${sidebar ? "pl-[90px]" : "pl-0"}`}>
                    <items.icon size={30} className={`${!sidebar && "text-center block w-full"}`} />
                    {sidebar &&
                      <h3 className="font-bold text-[20px] leading-7 tracking-[1.3%] head2">{items.name}</h3>
                    }
                  </Link>
                )
              }

              )
            }
          </div>

          {sidebar &&
            <div className=" flex items-center bg-[#FBFDFF] rounded-2xl h-[80px] gap-2 justify-center relative w-[100%] top-[240px]">
              <p className="text-[17px] leading-6 font-normal tracking-[0.5%] text-[#0F4880] head1">194XV7C......ROFYOF</p>
            </div>

          }
        </section>

      </section>

    </main>


  )
}
