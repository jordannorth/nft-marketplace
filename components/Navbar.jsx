import React, { useState } from 'react';
// Used for lazy loading images
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    //Will set the opposite of what navs current value is
    setNav(!nav);
  };

  return (
    <div className='fixed w-full h-30 shadow-xl z-[100]'>
      <div className='flex justify-between items-center w-full h-full px-2 2xl:px-16'>
        <Image
          src='/../public/assets/duck-duck.png'
          alt='/'
          width='125'
          height='100'
        />
        <div>
          {/* Hidden, anything above medium we display as flex */}
          <ul className='hidden md:flex'>
            <Link href='/'>
              <li className='ml-10 text-sm uppercase hover:border-b'>Home</li>
            </Link>
            <Link href='/create-item'>
              <li className='ml-10 text-sm uppercase hover:border-b'>Sell</li>
            </Link>
            <Link href='/my-nfts'>
              <li className='ml-10 text-sm uppercase hover:border-b'>
                My NFT's
              </li>
            </Link>
            <Link href='/creator-dashboard'>
              <li className='ml-10 text-sm uppercase hover:border-b'>
                Creator
              </li>
            </Link>
          </ul>
          <div onClick={handleNav} className='flex md:hidden cursor-ponter'>
            <AiOutlineMenu size={25} />
          </div>
        </div>
      </div>

      <div
        className={
          nav ? 'md:hidden fixed left-0 top-0 w-full h-screen bg-black/70' : ''
        }
      >
        {/* Had the else set to hidden here although causes the nav to jump on as opposed to easing in as specified in the css */}
        <div
          className={
            nav
              ? 'fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-45% h-screen bg-[#ecf0f3] p-10 ease-in duration-500'
              : 'fixed left-[-100%] top-0 p-10 ease-in duration-500'
          }
        >
          <div>
            <div className='flex w-full items-center justify-between'>
              <Image
                src='/../public/assets/duck-duck.png'
                alt='/'
                width='125'
                height='100'
              />
              {/* Nice shadow effect added to button, see styling below  */}
              <div
                onClick={handleNav}
                className='rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer'
              >
                <AiOutlineClose size={25} />
              </div>
            </div>
            <div className='border-b border-gray-300 my-4'></div>
            <div className='py-4 flex-col'>
              <ul className='uppercase'>
                <Link href='/'>
                  <li className='py-4 text-sm'>Home</li>
                </Link>
                <Link href='/create-item'>
                  <li className='py-4 text-sm'>Sell</li>
                </Link>
                <Link href='/my-nfts'>
                  <li className='py-4 text-sm'>My NFT's</li>
                </Link>
                <Link href='/creator-dashboard'>
                  <li className='py-4 text-sm'>Creator</li>
                </Link>
              </ul>
              <div className='pt-40'>
                <p className='uppercase tracking-widest text-[#5651e5]'>
                  Let's Connect
                </p>
                <div className='flex items-center justify-start my-4'>
                  <div className='rounded-full shadow-lg shadow-gray-400 p-3 cursor-ponter hover:scale-105 ease-in duration-300'>
                    <FaLinkedin />
                  </div>
                  <div className='rounded-full shadow-lg m-2 shadow-gray-400 p-3 cursor-ponter hover:scale-105 ease-in duration-300'>
                    <FaGithub />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
