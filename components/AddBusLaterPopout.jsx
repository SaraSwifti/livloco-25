'use client'

import Image from 'next/image';
import SkipBizImage from '@/assets/images/skipbizimage.png';

const AddBusLaterPopout = ({ onClose }) => {

    
  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold'
          aria-label='Close'
        >
          &times;
        </button>

        <h2 className='text-xl font-semibold mb-3'>
          Come Back Anytime to Add Your Business
        </h2>
        <p className='text-black mb-4'>
          As a LocoMember, you can explore freely. When/If you're ready to add a business for visibility, click on your profile in the upper right. It comes with your membership. 
          
        </p>

        <Image
          src={SkipBizImage}
          alt='Reminder'
          width='0'
          height='0'
          sizes='100vw'
                  className='rounded-md'
                  
        />
      </div>
    </div>
  )
}

export default AddBusLaterPopout;
