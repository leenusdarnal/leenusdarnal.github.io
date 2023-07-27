import Link from 'next/link'
import { GitHubIcon } from '../components/GitHubIcon'
import { EmailIcon } from '../components/EmailIcon'
import { ContactsIcon } from '../components/ContactIcon'

const Contacts = () => {
  return (
    <div className='flex flex-col gap-10 pl-96 pt-28'>
      <div className='flex'>
        <Link
          href='https://github.com/leenusdarnal'
          target='_blank'
          rel='noopener noreferrer'
        >
          <div className='h-14 w-14 '>
            <GitHubIcon />
          </div>
          <div>https://github.com/leenusdarnal</div>
        </Link>
      </div>
      <div>
        <Link href='mailto:leenus.darnal@gmail.com'>
          <div className='h-14 w-14'>
            <EmailIcon />
          </div>
          <div>leenus.darnal@gmail.com</div>
        </Link>
      </div>
      <div>
        <div className='h-14 w-14'>
          <ContactsIcon />
        </div>
        <div>+918945947295</div>
      </div>
    </div>
  )
}

export default Contacts
