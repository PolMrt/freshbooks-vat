// export default function Freshbooks(options) {
//   return {
//     id: 'freshbooks',
//     name: 'Freshbooks',
//     type: 'oauth',
//     version: '2.0',
//     scope: 'admin:all:legacy',
//     params: {
//       grant_type: 'authorization_code',
//       redirect_uri: options.redirectUri
//     },
//     accessTokenUrl: `https://api.freshbooks.com/auth/oauth/token`,
//     authorizationUrl: `https://my.freshbooks.com/service/auth/oauth/authorize?response_type=code`,
//     profileUrl: `https://api.freshbooks.com/auth/api/v1/users/me`,
//     profile(profile) {
//       return {
//         id: profile.response.id,
//         name: `${profile.response.first_name} ${profile.response.last_name}`,
//         email: profile.response.email,
//         image: null
//       }
//     },
//     ...options
//   }
// }

export default function Freshbooks(options) {
  return {
    id: 'freshbooks',
    name: 'Freshbooks',
    type: 'oauth',
    // wellKnown: 'https://auth.freshbooks.com/.well-known/openid-configuration',
    authorization: {
      url: 'https://auth.freshbooks.com/oauth/authorize',
      params: { scope: 'user:taxes:read user:profile:read user:reports:read', response_type: 'code' }
    },
    token: {
      url: 'https://api.freshbooks.com/auth/oauth/token',
      params: { grant_type: 'authorization_code' }
    },
    userinfo: {
      url: 'https://api.freshbooks.com/auth/api/v1/users/me'
    },
    // version: '2.0',
    // authorization: {
    //   url: 'https://auth.freshbooks.com/oauth/authorize',https://auth.freshbooks.com/oauth/authorize?client_id=331e3520ca3a16347dfa942dc7265abbaca3c6ee77dd53ad0ce78432854f1bf4&response_type=code&redirect_uri=https%3A%2F%2Fb7b3-2a02-a03f-6430-9800-844-c7f0-3b98-7988.ngrok.io%2Fapi%2Fauth%2Fcallback%2Ffreshbooks&scope=user%3Ataxes%3Aread%20user%3Aprofile%3Aread
    //   params: {
    //     response_type: 'code',
    //     scope: 'admin:all:legacy',
    //     redirect_uri: options.redirectUri
    //   }
    // },
    // token: {
    //   url: 'https://api.freshbooks.com/auth/oauth/token',
    //   params: {
    //     grant_type: 'authorization_code',
    //     redirect_uri: options.redirectUri
    //   }
    // },
    // userinfo: {
    //   url: 'https://api.freshbooks.com/auth/api/v1/users/me'
    // },
    // params: { grant_type: 'authorization_code', redirect_uri: options.redirectUri },
    // accessTokenUrl: 'https://api.freshbooks.com/auth/oauth/token',
    // authorization: 'https://auth.freshbooks.com/service/auth/oauth/authorize?response_type=code',
    // profileUrl: 'https://api.freshbooks.com/auth/api/v1/users/me',
    async profile(profile) {
      return {
        id: profile.response.id,
        name: `${profile.response.first_name} ${profile.response.last_name}`,
        email: profile.response.email
      }
    },
    ...options
  }
}

// https://auth.freshbooks.com/oauth/authorize?client_id=331e3520ca3a16347dfa942dc7265abbaca3c6ee77dd53ad0ce78432854f1bf4&response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Ffreshbooks&scope=admin%3Aall%3Alegacy%20user%3Aprofile%3Aread%20user%3Ataxes%3Aread
