// utils/authOptions.js
import connectDB from '@/config/database'
import User from '@/models/User'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // No need to override authorization params for normal sign-in.
    }),
  ],
  session: { strategy: 'jwt' },
  trustHost: true,
  callbacks: {
    // Runs on initial sign-in (account exists). Safe place to touch DB once.
    async jwt({ token, account, profile }) {
      if (account && profile?.email) {
        try {
          await connectDB()
          let user = await User.findOne({ email: profile.email }).maxTimeMS(10000) // 10 second timeout
          if (!user) {
            const username = (profile.name || profile.email).slice(0, 20)
            user = await User.create({
              email: profile.email,
              username,
              image: profile.picture,
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
    async signIn() { return true },
  },
}
