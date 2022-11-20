import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';

/* 
We will set up nextauth service here. 
All authentication service will go through the /api/auth/* routes.
This app only use 1 provider (facebook) so register our app to Meta Developer then access that facebook_id and facebook_secret and put in our local env file
Export the `NextAuth` and add in our own custom options
-providers is the facebook providers 
-secret is another layer of security, we can generate this secret on our own
-pages: tell NextAuth that we built our own signIn page and tell it where is the path to it
After that the server is finish, move on to the client
*/

const fbClientId = process.env.FACEBOOK_ID;
const fbClientSecret = process.env.FACEBOOK_SECRET;

if (!fbClientId || !fbClientSecret) {
  throw new Error(
    'Facebook Client Id or Facebook Client Secret env file is not valid, please double check your env file'
  );
}

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret)
  throw new Error('NextAuth Secret is not valid, check your .env file');
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    FacebookProvider({
      clientId: fbClientId,
      clientSecret: fbClientSecret,
    }),
  ],
  secret: nextAuthSecret,
  // https://next-auth.js.org/configuration/pages#sign-in-page
  pages: {
    signIn: 'auth/signin',
  },
};

export default NextAuth(authOptions);
