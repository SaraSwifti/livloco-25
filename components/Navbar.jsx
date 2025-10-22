'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import logo from '@/assets/images/newlivlocologo.png'
import profileDefault from '@/assets/images/profile.png'
import { FaGoogle } from 'react-icons/fa'
import { HiOutlineChatBubbleLeft, HiChatBubbleLeft } from 'react-icons/hi2'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import UnreadMessageCount from './UnreadMessageCount'

const Navbar = () => {
  const { data: session } = useSession()
  //this is to check user route and permissions on mem profile.
  const [me, setMe] = useState(null)

  const profileImage = session?.user?.image
  const profileMenuRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const mobileButtonRef = useRef(null)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [providers, setProviders] = useState(null)
  /// for closing mobile menue dropdown when item is selected or window is clicked into.

  const pathname = usePathname()

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }

    setAuthProviders()

    // fetch current user document
    const loadMe = async () => {
      try {
        const r = await fetch('/api/me', { cache: 'no-store' })
        const j = await r.json()
        setMe(j.user || null)
      } catch {}
    }
    if (session) loadMe()

    // NOTE: close mobile menu if the viewport size is changed
    function handleResize() {
      setIsMobileMenuOpen(false)
    }

    window.addEventListener('resize', handleResize)

    //event listener should the mouse click outside of the profile dropdown and not chooe a item=> to close
    function handleClickOutsideProfile(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutsideProfile)

    // NEW: Close MOBILE menu when clicking outside
    function handleClickOutsideMobile(event) {
      if (!isMobileMenuOpen) return
      const menu = mobileMenuRef.current
      const button = mobileButtonRef.current
      if (
        menu &&
        !menu.contains(event.target) &&
        button &&
        !button.contains(event.target)
      ) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutsideMobile) // LINE 68 (NEW)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('mousedown', handleClickOutsideProfile)
      document.removeEventListener('mousedown', handleClickOutsideMobile)
    }
  }, [isMobileMenuOpen])
  // NEW: Close mobile menu on route change (pathname updates)
  useEffect(() => {
    setIsMobileMenuOpen(false) // LINE 81 (NEW)
    setIsProfileMenuOpen(false) // LINE 82 (NEW - nice UX)
  }, [pathname])

  return (
    <nav className='relative z-50 bg-white border-b border-gray-300 py-3'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-20 items-center justify-between'>
          <div className='absolute inset-y-0 left-0 flex items-center md:hidden'>
            {/* <!-- Mobile menu button--> */}
            <button
              type='button'
              id='mobile-dropdown-button'
              className='relative inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black'
              aria-controls='mobile-menu'
              aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              ref={mobileButtonRef}
            >
              <span className='absolute -inset-0.5'></span>
              <span className='sr-only'>Open main menu</span>
              <svg
                className='block h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </button>
          </div>

          <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
            {/* <!-- Logo --> */}
            <Link
              className='flex flex-shrink-0 items-center'
              href='/'
            >
              <Image
                className='h-10 w-auto'
                src={logo}
                alt='LivLoco logo'
              />

              <span className='hidden md:block text-black text-2xl font-bold ml-2'>
                The Livlo.co Co-op
              </span>
            </Link>
            {/* <!-- Desktop Menu Hidden below md screens --> */}
            <div className='hidden md:ml-6 md:block'>
              <div className='flex space-x-2'>
                <Link
                  href='/'
                  className={`${
                    pathname === '/'
                      ? 'bg-gray-200 border-b-4 border-black'
                      : ''
                  } text-black hover:bg-gray-100 hover:text-black rounded-md px-3 py-2`}
                >
                  LocoHome
                </Link>
                {/* <Link
                  href='/living'
                  className={`${
                    pathname === '/living' ? 'bg-black border-b-4 border-white' : ''
                  } text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2`}
                >
                  LocoLiving
                </Link> */}
                {/* I only want them to see the businesses if they are logged in */}
                {session && (
                  <Link
                    href='/businesses'
                    className={`${
                      pathname === '/businesses'
                        ? 'bg-gray-200 border-b-4 border-black'
                        : ''
                    } text-black hover:bg-gray-100 hover:text-black rounded-md px-3 py-2`}
                  >
                    LocoBusinesses
                  </Link>
                )}
                {session && (
                  <Link
                    href='/hostfarmmarkets'
                    className={`${
                      pathname === '/hostfarmmarkets'
                        ? 'bg-gray-200 border-b-4 border-black'
                        : ''
                    } text-black hover:bg-gray-100 hover:text-black rounded-md px-3 py-2`}
                  >
                    LocoFarmers' Markets
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* <!-- Right Side Menu (Logged Out) --> */}
          {!session && (
            <div className='hidden md:block md:ml-6'>
              <div className='flex items-center'>
                {providers &&
                  Object.values(providers).map((provider, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        signIn(provider.id, { callbackUrl: '/onboarding' })
                      }
                      className='flex items-center text-white bg-black hover:bg-gray-800 hover:text-white rounded-md px-3 py-2'
                    >
                      <FaGoogle className='text-white mr-2' />
                      <span>Login or Register</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* <!-- Right Side Menu (Logged In) --> */}
          {session && (
            <div className='absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0'>
              <Link
                href='/messages'
                className='relative group'
              >
                <button
                  type='button'
                  className='relative rounded-full bg-gray-100 p-1 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white'
                >
                  <span className='absolute -inset-1.5'></span>
                  <span className='sr-only'>View Messages</span>
                  <span className='relative inline-block h-7 w-7'>
                    {/* Solid (fill) layer appears on hover to turn inside black */}
                    <HiChatBubbleLeft className='absolute inset-0 h-7 w-7 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-150' />
                    {/* Outline layer stays on top and changes to darker on hover */}
                    <HiOutlineChatBubbleLeft className='relative h-7 w-7 text-gray-600 group-hover:text-black transition-colors duration-150' />
                  </span>
                </button>
                <UnreadMessageCount />
              </Link>
              {/* <!-- Profile dropdown button --> */}
              <div
                className='relative ml-3 z-50'
                ref={profileMenuRef}
              >
                <div>
                  <button
                    type='button'
                    className='relative flex rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white'
                    id='user-menu-button'
                    aria-expanded='false'
                    aria-haspopup='true'
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  >
                    <span className='absolute -inset-1.5'></span>
                    <span className='sr-only'>Open user menu</span>
                    <Image
                      className='h-8 w-8 text-black rounded-full'
                      src={profileImage || profileDefault}
                      alt='user profile image'
                      width={40}
                      height={40}
                    />
                  </button>
                </div>

                {/* <!-- Profile dropdown --> */}
                {isProfileMenuOpen && (
                  <div
                    id='user-menu'
                    className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                    role='menu'
                    aria-orientation='vertical'
                    aria-labelledby='user-menu-button'
                    tabIndex='-1'
                  >
                    <Link
                      href={me?._id ? `/profile/${me._id}` : '/profile'}
                      className='block px-4 py-2 text-sm text-gray-700'
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile & Membership
                    </Link>

                    <Link
                      href='/businesses/saved'
                      className='block px-4 py-2 text-sm text-black'
                      role='menuitem'
                      tabIndex='-1'
                      id='user-menu-item-2'
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Saved LivLoco Businesses and Markets
                    </Link>
                    <button
                      className='block px-4 py-2 text-sm text-gray-700'
                      role='menuitem'
                      tabIndex='-1'
                      id='user-menu-item-2'
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        signOut({ callbackUrl: '/' })
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      {isMobileMenuOpen && (
        <div
          id='mobile-menu'
          ref={mobileMenuRef}
        >
          <div className='space-y-1 px-2 pb-3 pt-2'>
            <Link
              href='/'
              className={`${
                pathname === '/' ? 'bg-gray-200' : ''
              } flex items-center text-black bg-gray-100 hover:bg-gray-200 hover:text-black rounded-md px-3 py-2 my-5`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              LocoHome
            </Link>
            {/* will add the locoliving slogan after it has launched */}
            {/* <Link
              href='/living'
              className={`${
                pathname === '/living' ? 'bg-black' : ''
              } flex items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2 my-5`}
            onClick={() => setIsMobileMenuOpen(false)} 
            >
              LocoLiving
            </Link> */}
            {session && (
              <Link
                href='/businesses'
                className={`${
                  pathname === '/businesses' ? 'bg-gray-200' : ''
                } flex items-center text-black bg-gray-100 hover:bg-gray-200 hover:text-black rounded-md px-3 py-2 my-5`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                LocoBusinesses
              </Link>
            )}
            {session && (
              <Link
                href='/hostfarmmarkets'
                className={`${
                  pathname === '/hostfarmmarkets' ? 'bg-gray-200' : ''
                } flex items-center text-black bg-gray-100 hover:bg-gray-200 hover:text-black rounded-md px-3 py-2 my-5`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                LocoFarmers' Markets
              </Link>
            )}
            {session && (
              <Link
                href={me?._id ? `/profile/${me._id}` : '/profile'}
                className={`${
                  pathname.startsWith('/profile') ? 'bg-gray-200' : ''
                } flex items-center text-black bg-gray-100 hover:bg-gray-200 hover:text-black rounded-md px-3 py-2 my-5`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Your Profile & Membership
              </Link>
            )}
            {!session && (
              <div>
                {providers &&
                  Object.values(providers).map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        signIn(provider.id, { callbackUrl: '/onboarding' })
                      }}
                      className='flex items-center text-white bg-black hover:bg-gray-800 hover:text-white rounded-md px-3 py-2 my-5'
                    >
                      <FaGoogle className='fa-brands fa-google mr-2'></FaGoogle>
                      <span>Login or Register</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
