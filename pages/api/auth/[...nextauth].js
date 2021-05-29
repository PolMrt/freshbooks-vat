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

  // debug: true

  // A database is optional, but required to persist accounts in a database
  database: process.env.DATABASE_URL
})
