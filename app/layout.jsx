import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import { hydrateRoot } from 'react-dom/client';
import '@/public/styles/global.css';

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
    <html className='h-full' lang='eng'>
      <body suppressHydrationWarning className="flex flex-col min-h-screen" >
        <Navbar />
       
     
         
        <main className="flex-grow bg-cover bg-no-repeat bg-center"
        // priority={true}
        style={{
          backgroundImage: `url(${backdrop.src})`,
         
       
        }}>{children}</main>
         
          
       
       
      <Footer className='bg-gray-800 text-white text-center p-4'/>
      </body>
    </html>
  )
}

export default MainLayout
