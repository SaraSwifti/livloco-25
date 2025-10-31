// utils/authOptions.js
import connectDB from '@/config/database'
import User from '@/models/User'
import GoogleProvider from 'next-auth/providers/google'
import AppleProvider from 'next-auth/providers/apple'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // No need to override authorization params for normal sign-in.
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET
        ? process.env.APPLE_SECRET
        : {
            teamId: process.env.APPLE_TEAM_ID,
            keyId: process.env.APPLE_KEY_ID,
            privateKey: process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          await connectDB()
          const user = await User.findOne({
            email: credentials.email.toLowerCase(),
          })
            .select('+password')
            .maxTimeMS(10000)

          if (!user) {
            throw new Error('Invalid email or password')
          }

          // Check if user has a password (password field exists and is not empty)
          if (!user.password) {
            throw new Error(
              'Please sign in using Google or Apple, or reset your password'
            )
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error('Invalid email or password')
          }

          // Return user object that will be encoded in the JWT
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.full_name || user.username,
            image: user.image,
          }
        } catch (error) {
          console.error('Credentials authorization error:', error)
          throw new Error(error.message || 'Authentication failed')
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  trustHost: true,
  callbacks: {
    // Runs on initial sign-in (account exists). Safe place to touch DB once.
    async jwt({ token, account, profile, user: authUser }) {
      // Handle OAuth providers (Google, Apple)
      if (account && profile?.email) {
        try {
          await connectDB()
          let user = await User.findOne({
            email: profile.email.toLowerCase(),
          }).maxTimeMS(10000) // 10 second timeout
          if (!user) {
            const username = (profile.name || profile.email).slice(0, 20)
            user = await User.create({
              email: profile.email.toLowerCase(),
              username,
              image: profile.picture || profile.image,
            })
          }
          token.uid = user._id.toString()
          token.email = user.email
          token.complete = !!(user.full_name && user.phone)
        } catch (error) {
          console.error('Database error during authentication:', error)
          // Don't fail authentication, but log the error
          // The user can still sign in, but profile data won't be saved until DB is available
        }
      }
      // Handle Credentials provider
      else if (authUser?.id) {
        token.uid = authUser.id
        token.email = authUser.email
        // For credentials provider, we need to fetch user to check completion
        try {
          await connectDB()
          const user = await User.findById(authUser.id)
          if (user) {
            token.complete = !!(user.full_name && user.phone)
          }
        } catch (error) {
          console.error('Error fetching user for credentials:', error)
        }
      }
      return token
    },

    // No DB here—just copy from token -> session.
    async session({ session, token }) {
      if (token?.uid) session.user.id = token.uid
      if (token?.email) session.user.email = token.email
      return session
    },

    // Honor relative callbackUrls like '/onboarding'
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (url.startsWith(baseUrl)) return url
      return baseUrl
    },

    // Allow sign-in; routing handled by callbackUrl/redirect.
    async signIn() {
      return true
    },
  },
}
