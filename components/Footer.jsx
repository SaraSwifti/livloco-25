import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/assets/images/livlopng24.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <>
            {/* <!-- Footer --> */}
        <footer className="bg-gray-200 py-4 mt-5">
          <div
            className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4"
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
        </footer></>);
}
export default Footer;