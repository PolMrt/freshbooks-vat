import NextAuth from 'next-auth'
// import FreshbooksProvider from "../../../lib/freshbooksProvider";
import FreshbooksProvider from '../../../lib/freshbooksProvider'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    FreshbooksProvider({
      clientId: process.env.FRESHBOOKS_CLIENT_ID,
      clientSecret: process.env.FRESHBOOKS_CLIENT_SECRET
    })
  ],

  secret: 'EiNinH413dCfpnwOQxBnfGS6tZGet5ho96dEflYwkf4=',

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log(user, account, profile)
      // const newToken = await refreshToken({ refreshToken: account.refreshToken })
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, token, user }) {
      //console.log('hey', session, user)
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      //console.log('maybe', token, user, account, profile, isNewUser)
      console.log(account)
      if (account?.provider === 'freshbooks') {
        token.accessToken = account.access_token
      }
      return token
    }
  },

  session: {
    jwt: true
  },

  jwt: {
    secret: process.env.JWT_SECRET
  }

  // debug: true

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL
})

const refreshToken = async ({ refreshToken }) => {
  const rawData = await fetch(`https://api.freshbooks.com/auth/oauth/token`, {
    method: 'post',
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: process.env.FRESHBOOKS_CLIENT_ID,
      client_secret: process.env.FRESHBOOKS_CLIENT_SECRET,
      refresh_token: refreshToken
    }),
    headers: {
      'Api-Version': 'alpha'
    }
  })
  const data = await rawData.json()

  console.log(data)
  return null
}
