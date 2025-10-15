import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/AuthProvider'

import '@/assets/styles/global.css'

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
        className='flex flex-col min-h-screen bg-white'
      >
        <AuthProvider>
          <Navbar />
          {/* backdrop wrapper provides muted overlay and keeps content above the overlay */}
          <main className='flex-1'>
            <div className='px-4 py-8'>{children}</div>
          </main>
          <Footer />{' '}
        </AuthProvider>
      </body>
    </html>
  )
}

export default MainLayout
