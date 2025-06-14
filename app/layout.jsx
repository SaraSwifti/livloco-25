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
  keywords: 'local, living, sustainable, micro-economies, LivLoco, Livlo.co, local, economies, businesses, business',
  description:
    'local businesses finding local businesses, creating local economies right where you live',
}

const MainLayout = ({ children }) => {
  return (
    <AuthProvider>
    <html
      className='h-full'
      lang='eng'
    >
      <body
        suppressHydrationWarning
        className='flex flex-col min-h-screen'
      >
        <Navbar />
          <main className="flex-grow"
            style={{
              backgroundImage: `url(${backdrop.src})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'repeat',
              backgroundPosition: 'center',
            }}>
        
            <div className="relative z-10 px-4 py-8">{children}</div>
            
        </main>
        <Footer className='' />
        </body>
        
      </html>
      </AuthProvider>
  )
}

export default MainLayout
