import NextAuth from 'next-auth'
import FreshbooksProvider from '../../../lib/freshbooksProvider'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    FreshbooksProvider({
      clientId: process.env.FRESHBOOKS_CLIENT_ID,
      clientSecret: process.env.FRESHBOOKS_CLIENT_SECRET,
      redirectUri: 'https://localhost:3000/api/auth/callback/freshbooks'
    })
    // ...add more providers here
  ],

  callbacks: {
    async signIn(user, account, profile) {
      // console.log(user, account, profile)
      // const newToken = await refreshToken({ refreshToken: account.refreshToken })
      return true
    },
    async redirect(url, baseUrl) {
      return baseUrl
    },
    async session(session, user) {
      //console.log('hey', session, user)
      return session
    },
    async jwt(token, user, account, profile, isNewUser) {
      //console.log('maybe', token, user, account, profile, isNewUser)
      if (account?.provider === 'freshbooks') {
        token.accessToken = account.accessToken
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
