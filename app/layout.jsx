import backdrop from '@/assets/images/sunflowers.png';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';

import '@/assets/styles/global.css';

// hydrateRoot(
//   document.getElementById('root'),
//   <App />
// );

export const metadata = {
  title: 'Livloco',
  keywords:
    'local, living, sustainable, micro-economies, LivLoco, Livlo.co, local, economies, businesses, business',
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
        className='backdrop-wrap backdrop-vignetteflex flex-col min-h-screen'
               
        style={{
          backgroundImage: `url(${backdrop.src})`,
          /* use CSS variable for size in global.css */
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat', // tile the image
          backgroundPosition: 'top center',
        }}
      ><AuthProvider>
       
          <Navbar />

          {/* backdrop wrapper provides muted overlay and keeps content above the overlay */}
         
           
            
            <main className='flex-1 backdrop-content'>
              <div className='px-4 py-8'>{children}</div>
            </main>

          <Footer /> </AuthProvider>

        </body>
     
    </html>
 
  )
}

export default MainLayout
