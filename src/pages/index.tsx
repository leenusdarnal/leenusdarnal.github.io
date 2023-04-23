import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

export default function Home() {
  const [darkmode, setDarkmode] = useState(true)

  const toggleDarkMode = (): void => {
    localStorage.theme = !darkmode
    setDarkmode((prevDarkmode) => (localStorage.theme = !prevDarkmode))
  }

  useEffect(() => {
    setDarkmode(localStorage.theme === 'true')
  }, [])
  return <h1>Coming Soon.</h1>
}
