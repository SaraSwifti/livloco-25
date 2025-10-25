'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import logo from '@/assets/images/newlivlocologo.png'
import profileDefault from '@/assets/images/profile.png'
import { HiOutlineChatBubbleLeft, HiChatBubbleLeft } from 'react-icons/hi2'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import { FaGoogle } from 'react-icons/fa'
import UnreadMessageCount from './UnreadMessageCount'

const Navbar = () => {
  const { data: session } = useSession()
  //this is to check user route and permissions on mem profile.
  const [me, setMe] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

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

    // check admin status
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/admin/status', { cache: 'no-store' })
        const result = await response.json()
        setIsAdmin(result.success && result.isAdmin)
      } catch {}
    }

    if (session) {
      loadMe()
      checkAdminStatus()
    }

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
    <header
      role='banner'
      className='sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
    >
      <nav
        aria-label='Main navigation'
        className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
      >
        <div className='flex items-center justify-between h-16'>
          {/* Mobile menu button */}
          <div className='flex items-center lg:hidden'>
            <button
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200'
              aria-controls='mobile-menu'
              aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
              aria-label={
                isMobileMenuOpen ? 'Close main menu' : 'Open main menu'
              }
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              ref={mobileButtonRef}
            >
              <span className='sr-only'>Open main menu</span>
              {/* Animated hamburger icon */}
              <svg
                className={`${
                  isMobileMenuOpen ? 'hidden' : 'block'
                } h-6 w-6 transition-all duration-200`}
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
              {/* Close icon */}
              <svg
                className={`${
                  isMobileMenuOpen ? 'block' : 'hidden'
                } h-6 w-6 transition-all duration-200`}
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          {/* Brand/Logo */}
          <div className='flex items-center flex-shrink-0'>
            <Link
              href='/'
              className='flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200'
              aria-label='LivLoco Home'
            >
              <Image
                src={logo}
                alt='LivLoco logo'
                width={40}
                height={40}
                priority
              />
              <span className='hidden md:block text-xl font-bold text-gray-900'>
                The Livlo.co Co-op
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden lg:flex lg:items-center lg:space-x-8'>
            <div
              className='flex space-x-8'
              role='menubar'
            >
              {/* Show LocoHome link when logged in, highlight if on home page */}
              {session && (
                <Link
                  href='/'
                  role='menuitem'
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    pathname === '/'
                      ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-current={pathname === '/' ? 'page' : undefined}
                >
                  LocoHome
                </Link>
              )}
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
                  role='menuitem'
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    pathname === '/businesses'
                      ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-current={pathname === '/businesses' ? 'page' : undefined}
                >
                  LocoBusinesses
                </Link>
              )}
              {session && (
                <Link
                  href='/hostfarmmarkets'
                  role='menuitem'
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    pathname === '/hostfarmmarkets'
                      ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-current={
                    pathname === '/hostfarmmarkets' ? 'page' : undefined
                  }
                >
                  LocoFarmers' Markets
                </Link>
              )}
              {session && isAdmin && (
                <Link
                  href='/admin'
                  role='menuitem'
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    pathname === '/admin'
                      ? 'bg-red-100 text-red-700 border-b-2 border-red-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-current={pathname === '/admin' ? 'page' : undefined}
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className='flex items-center space-x-4'>
            {/* Co-op Member Login - Only show if not signed in */}
            {!session && providers && (
              <button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm'
              >
                <FaGoogle className='mr-2 h-4 w-4' />
                Co-op Member Login
              </button>
            )}

            {session && (
              <>
                {/* Messages Button */}
                <Link
                  href='/messages'
                  className='relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  aria-label='View Messages'
                >
                  <span className='sr-only'>View Messages</span>
                  <HiOutlineChatBubbleLeft className='h-6 w-6' />
                  <UnreadMessageCount />
                </Link>
                {/* Profile Dropdown */}
                <div
                  className='relative'
                  ref={profileMenuRef}
                >
                  <button
                    type='button'
                    className='flex items-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    aria-expanded={isProfileMenuOpen ? 'true' : 'false'}
                    aria-haspopup='true'
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  >
                    <span className='sr-only'>Open user menu</span>
                    <Image
                      className='h-8 w-8 rounded-full'
                      src={profileImage || profileDefault}
                      alt='User profile'
                      width={32}
                      height={32}
                    />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div
                      className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                      role='menu'
                      aria-orientation='vertical'
                    >
                      <Link
                        href={me?._id ? `/profile/${me._id}` : '/profile'}
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                        onClick={() => setIsProfileMenuOpen(false)}
                        role='menuitem'
                      >
                        Your Profile & Membership
                      </Link>

                      <Link
                        href='/businesses/saved'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                        role='menuitem'
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Saved LivLoco Businesses and Markets
                      </Link>

                      <button
                        className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                        role='menuitem'
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
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='lg:hidden'>
            <div className='fixed inset-0 z-50 lg:hidden'>
              <div
                className='fixed inset-0 bg-black bg-opacity-25'
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className='relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl'>
                <div className='flex-1 h-0 pt-5 pb-4 overflow-y-auto'>
                  <div className='flex-shrink-0 flex items-center px-4'>
                    <Image
                      src={logo}
                      alt='LivLoco logo'
                      width={40}
                      height={40}
                      style={{ width: 'auto', height: '40px' }}
                    />
                    <span className='ml-3 text-xl font-bold text-gray-900'>
                      The Livlo.co Co-op
                    </span>
                  </div>
                  <nav
                    className='mt-5 px-2 space-y-1'
                    role='menubar'
                  >
                    {/* Show LocoHome link when logged in, highlight if on home page */}
                    {session && (
                      <Link
                        href='/'
                        className={`${
                          pathname === '/'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-200`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        role='menuitem'
                        aria-current={pathname === '/' ? 'page' : undefined}
                      >
                        LocoHome
                      </Link>
                    )}
                    {session && (
                      <Link
                        href='/businesses'
                        className={`${
                          pathname === '/businesses'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-200`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        role='menuitem'
                        aria-current={
                          pathname === '/businesses' ? 'page' : undefined
                        }
                      >
                        LocoBusinesses
                      </Link>
                    )}
                    {session && (
                      <Link
                        href='/hostfarmmarkets'
                        className={`${
                          pathname === '/hostfarmmarkets'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-200`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        role='menuitem'
                        aria-current={
                          pathname === '/hostfarmmarkets' ? 'page' : undefined
                        }
                      >
                        LocoFarmers' Markets
                      </Link>
                    )}
                    {session && isAdmin && (
                      <Link
                        href='/admin'
                        className={`${
                          pathname === '/admin'
                            ? 'bg-red-100 text-red-700'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-200`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        role='menuitem'
                        aria-current={
                          pathname === '/admin' ? 'page' : undefined
                        }
                      >
                        Admin Panel
                      </Link>
                    )}
                    {session && (
                      <Link
                        href={me?._id ? `/profile/${me._id}` : '/profile'}
                        className={`${
                          pathname.startsWith('/profile')
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-200`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        role='menuitem'
                        aria-current={
                          pathname.startsWith('/profile') ? 'page' : undefined
                        }
                      >
                        Your Profile & Membership
                      </Link>
                    )}
                  </nav>
                </div>
                {/* Authentication buttons removed from mobile menu - now handled on home page */}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
