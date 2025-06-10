import NextAuth from 'next-auth/next';
// import { authOptions } from '@//utils/authOptions';
//for some reason it will not allow me to inport providers through the util file per the code. 

import GoogleProvider from "next-auth/providers/google";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as Post };
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code'
                }
            }
      
      
    }),
  ],
  // Add other NextAuth options here
});

export { handler as GET, handler as POST };