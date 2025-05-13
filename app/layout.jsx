// import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
// import { hydrateRoot } from 'react-dom/client';
import '@/public/styles/global.css'

// hydrateRoot(
//   document.getElementById('root'),
//   <App />
// );

import backdrop from '@/public/images/sunflowers.png'

export const metadata = {
  title: 'Livloco',
  keywords: 'local, living, sustainable, micro-economies, LivLoco, Livlo.co',
  description:
    'local businesses finding local businesses, creating local economies right where you live',
}

const MainLayout = ({ children }) => {
  return (
    <html
      className='h-full'
      lang='eng'
    >
      <body
        suppressHydrationWarning
        className='flex flex-col  '
      >
        <Navbar />
        <main className="flex-grow" >
          <div
            className='relative min-h-screen'
            style={{
              backgroundImage: `url(${backdrop.src})`
            }}>
            {/* <Image
              src='/images/your-image.jpg'
              alt='Background image of a black and white picture of sunflowers'
              fill
              style={{
                backgroundImage: `url(${backdrop.src})`
              }}
              sizes='100vw'
              className='flex-grow min-h-screen bg-cover bg-center object-cover z-0'
              priority
            > */}
            <div>{children}</div>
            
            <div className='relative z-10'></div>
        </div>
        

          {/* <div className="flex-grow min-h-screen bg-cover bg-center "
        // priority={true}
        style={{
          backgroundImage: `url(${backdrop.src})`,
         
       
        }}>{children}</div> */}
        </main>
        <Footer className='bg-gray-800 text-white text-center p-4' />
      </body>
    </html>
  )
}

export default MainLayout
