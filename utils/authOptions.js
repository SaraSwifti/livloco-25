// import connectDB from '@/config/database';
// import User from '@/models/User';

import GoogleProvider from 'next-auth/providers/google';


export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code'
            }
        })
    ],
    callbacks: {
        //invoked on successful sign in
        async signIn({ profile }) {
            // 1. connect to the database

            // 2. check if user exists
            //3. if not, create user
            // 4. REturn true to allow sign in
            
        },
        // Session callback function that modifies the session object
        async session({ session }) {
            // 1. Get User from database
            // 2. Assign user id fro the session
            // 3. Return Session

        }
    }
}