import React from "react";
// Used for lazy loading images
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="fixed w-full h-20 shadow-xl z-[100]">
      <div className="flex justify-between items-center w-full h-full px-2 2xl:px-16">
      <Image
        src="/../public/assets/duck-logo.png"
        alt="/"
        width="125"
        height="100"
      />
      <div>
          <ul>
             <Link href='/create-item'>
                 <li className="ml-10 text-sm uppercase hover:border-b">Home</li>
             </Link>
             <Link href='/'>
                 <li className="ml-10 text-sm uppercase hover:border-b">Sell</li>
             </Link>
             <Link href='/'>
                 <li className="ml-10 text-sm uppercase hover:border-b">My NFT's</li>
             </Link>
             <Link href='/'>
                 <li className="ml-10 text-sm uppercase hover:border-b">Creator</li>
             </Link>
          </ul>

      </div>
      </div>
    </div>
  );
};

export default Navbar;
