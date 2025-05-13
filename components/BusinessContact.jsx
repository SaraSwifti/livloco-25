import Link from 'next/link';
import { FaGlobe, FaGlobeAsia } from "react-icons/fa";

const BusinessContact = ({ locomem }) => {
    return (  
        <>
            <div className='bg-white p-6 rounded-lg shadow-md text-center md:text-left'>
                <h1 className="text-xl font-bold">LocoMember's Contact Information</h1>
                <div className="flex justify-center items-center h-full">
                    <Link href={locomem.website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-800 hover:text-blue-900">
                <span >LocoMember's Website</span>
                    <FaGlobeAsia className="w-6 h-6 text-blue-800 hover:text-blue-900 cursor-pointer" />
                    </Link>
                </div>
                
                
            </div>
        </>
    );
}
 
export default BusinessContact;