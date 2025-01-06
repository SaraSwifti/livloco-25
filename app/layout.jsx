import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// import { hydrateRoot } from 'react-dom/client';
import '@/public/assets/styles/global.css';

import backdrop from '@/public/assets/images/sunflowers.png'

export const metadata = {
  title: 'Livloco',
  keywords: 'local, living, sustainable, micro-economies, LivLoco, Livlo.co',
  description:
    'local businesses finding local businesses, creating local economies right where you live',
}

const MainLayout = ({ children }) => {
  return (
    <html lang='eng'>
      <body>
        <Navbar />
       
        {/* <section
       
        className="mx-max w-full h-screen bg-cover bg-no-repeat bg-center"
        // priority={true}
        style={{
          backgroundImage: `url(${backdrop.src})`,
         
       
        }}
      > */}
       
     
         
        <main
        className="mx-max w-full h-screen bg-cover bg-no-repeat bg-center"
        // priority={true}
        style={{
          backgroundImage: `url(${backdrop.src})`,
         
       
        }}>{children}</main>
         
          
          {/* </section> */}
       
      <Footer />
      </body>
    </html>
  )
}

export default MainLayout
