'use client';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/images/livlopng24.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        
           
        <footer className="bg-gray-800 text-white text-center p-4">
          <div
            className=" bg-gray-300 rounded-lg shadow m-4 w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between"
          >
            <div className="mb-4 md:mb-0">
              <Image src={logo} alt="Logo" className="h-8 w-auto" />
            </div>
            <div
              className="flex flex-wrap justify-center md:justify-start mb-4 md:mb-0"
            >
              <ul className="flex space-x-4">
                {/* <li><Link href="/properties.html">Properties</Link></li> */}
                <li><Link href="mailto:sara.swifti@gmail.com">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm text-gray-500 mt-2 md:mt-0">
                            &copy;{currentYear} LivLoco. All rights reserved.
              </p>
            </div>
          </div>
        </footer >
        );
}
export default Footer;