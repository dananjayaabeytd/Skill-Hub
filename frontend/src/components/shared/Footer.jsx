import { Footer } from 'flowbite-react';
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
  BsLinkedin,
} from 'react-icons/bs';

export function FooterComponent() {
  return (
    <Footer container>
      <div className='w-full'>
        <div className='grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1'>
          <div>
            <Footer.Brand
              href='/'
              src='/logo.png' // Replace with your actual logo path
              alt='Skill Hub Logo'
              name='Skill Hub'
            />
          </div>
          <div className='grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='About Us' />
              <Footer.LinkGroup col>
                <Footer.Link href='/about'>Our Story</Footer.Link>
                <Footer.Link href='/team'>Our Team</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Resources' />
              <Footer.LinkGroup col>
                <Footer.Link href='/blog'>Blog</Footer.Link>
                <Footer.Link href='/faq'>FAQ</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link href='/privacy'>Privacy Policy</Footer.Link>
                <Footer.Link href='/terms'>Terms of Service</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright href='/' by='Skill Hub' year={2025} />
          <div className='mt-4 flex space-x-6 sm:mt-0 sm:justify-center'>
            <Footer.Icon href='https://facebook.com/skillhub' icon={BsFacebook} />
            <Footer.Icon href='https://instagram.com/skillhub' icon={BsInstagram} />
            <Footer.Icon href='https://twitter.com/skillhub' icon={BsTwitter} />
            <Footer.Icon href='https://github.com/skillhub' icon={BsGithub} />
            <Footer.Icon href='https://linkedin.com/company/skillhub' icon={BsLinkedin} />
          </div>
        </div>
      </div>
    </Footer>
  );
}