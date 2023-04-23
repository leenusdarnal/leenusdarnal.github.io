import React, { useState } from 'react'
import DarkmodeIcon from './DarkModeIcon'
import LightModeIcon from './LightModeIcon'
import Link from 'next/link'

type NavbarProps = {
  darkmode: boolean
  toggleDarkMode: () => void
}

const Navbar = ({ darkmode, toggleDarkMode }: NavbarProps) => {
  return (
    <nav className='flex flex-row flex-wrap justify-between pl-6   text-xl pt-3 '>
      <div className='border border-slate-900 p-1  rounded-full mb-3 dark:border-slate-50'>
        LD
      </div>
      <div className='flex flex-row gap-10 mr-7'>
        <div>
          <Link href='/'>Home</Link>
        </div>
        <div>About</div>
        <div>
          <Link href='/contacts'>Contacts</Link>
        </div>
        <div onClick={toggleDarkMode} className='cursor-pointer w-10 mt-1'>
          {darkmode ? <DarkmodeIcon /> : <LightModeIcon />}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
