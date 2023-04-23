import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { AppProps } from 'next/app'
import { NextComponentType } from 'next'

type Props = {
  children: React.ReactNode
}
const Layout: React.FC<Props> = ({ children }) => {
  const [darkmode, setDarkmode] = useState(true)

  const toggleDarkMode = (): void => {
    localStorage.theme = !darkmode
    setDarkmode((prevDarkmode) => (localStorage.theme = !prevDarkmode))
  }

  useEffect(() => {
    setDarkmode(localStorage.theme === 'true')
  }, [])
  return (
    <div className={`${darkmode ? 'dark' : ''}`}>
      <div className=' min-h-min bg-slate-200 dark:bg-slate-800 dark:text-white '>
        <Navbar darkmode={darkmode} toggleDarkMode={toggleDarkMode} />
      </div>
      <main className='flex flex-row justify-center items-center text-8xl dark:bg-slate-600 min-h-screen  dark:text-white'>
        {children}
      </main>
    </div>
  )
}
export default Layout
