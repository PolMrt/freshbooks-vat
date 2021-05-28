export default function Freshbooks(options) {
  return {
    id: 'freshbooks',
    name: 'Freshbooks',
    type: 'oauth',
    version: '2.0',
    scope: 'admin:all:legacy',
    params: {
      grant_type: 'authorization_code',
      redirect_uri: options.redirectUri
    },
    accessTokenUrl: `https://api.freshbooks.com/auth/oauth/token`,
    authorizationUrl: `https://my.freshbooks.com/service/auth/oauth/authorize?response_type=code`,
    profileUrl: `https://api.freshbooks.com/auth/api/v1/users/me`,
    profile(profile) {
      return {
        id: profile.response.id,
        name: `${profile.response.first_name} ${profile.response.last_name}`,
        email: profile.response.email,
        image: null
      }
    },
    ...options
  }
}
