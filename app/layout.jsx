import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
    <html>
      <body>
        <Navbar />
       <main>
        <section
        suppressHydrationWarning
        className="mx-max w-full h-screen bg-cover bg-no-repeat bg-center"
        // priority={true}
        style={{
          backgroundImage: `url(${backdrop.src})`,
         
       
        }}
      >
       
     
          <div className=''>
            <main>{children}</main>
          </div>
          
          </section>
        </main>
      <Footer />
      </body>
    </html>
  )
}

export default MainLayout
