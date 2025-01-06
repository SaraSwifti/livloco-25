'use client'
import Link from 'next/link';

export default function SlogHeader() {
    return (
    <>
        <div className='container flex items-center justify-center mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
          <Link className=" text-white bg-green-600 hover:bg-green-800 rounded-md px-3 py-2" href='/living' passHref>
           LocoLiving Slog Blogs
          </Link>
        </div>
      </>
    )
  }