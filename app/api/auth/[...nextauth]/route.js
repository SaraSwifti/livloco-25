
import { authOptions } from '@//utils/authOptions';
import NextAuth from 'next-auth/next';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


// this is what has been workUnitAsyncStorage, by skipping the util folder
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//        authorization: {
//                 params: {
//                     prompt: 'consent',
//                     access_type: 'offline',
//                     response_type: 'code'
//                 }
//             }
      
      
//     }),
//   ],
//   // Add other NextAuth options here
// });

// export { handler as GET, handler as POST };